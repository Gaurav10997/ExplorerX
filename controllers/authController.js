const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('./../models/userModel')
const crypto = require('crypto')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('../utils/email')


const signToken = id =>{
    return jwt.sign({
        id
    },'processenvjwtsecret',{
        expiresIn: '10d'
    })
}

const createSendToken = (user , statusCode , res) =>{
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + 90*24*60*60*1000
        ),
        httpOnly:true
      
    }
    res.cookie('jwt', token , cookieOptions)
    user.password=undefined
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}
exports.signup = catchAsync(async(req,res,next) => {
    // problem is that everyone can use to login and signup using admin 
    // const newUser = await User.create(req.body);
    const newUser = await(User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }))

    // secret should be 32 characters  and dont wrte here wite env variable i will do it later 
    createSendToken(newUser,201,res)

})

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;
    // check if email and password esidet 
    if (!email || !password) {
       return next(new AppError('Please provide email and password', 400));
    }; 
    
    //check if user exists && password is correct 

    const user = await User.findOne({email}).select('+password')
    const correct = await user?.correctPassword(password,user.password)
    if(!user || !correct){
        return next(new AppError('Invalid email or password', 401));
    }
    // if evereything is ok , send token to client 
    createSendToken(user,200,res)
})

exports.protect = catchAsync(async(req,res,next) => {
    // getting token an and check of its there 
     let token ; 
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1] ;
    }
    if(!token){
        return next(new AppError('Please log in to get access', 401));
    }

    // 2> Verification Token 
    const decoded = await promisify(jwt.verify)(token,'processenvjwtsecret')
    console.log(decoded);

    const freshUser = await User.findById(decoded.id); 
 

    if(!freshUser){
        next(new AppError('The user Token is not exist'  , 401))
    }
    if(freshUser.changesPasswordAfter(decoded.iat)) {
        return next(new AppError('user recently changed password ! please log in again '),401)

    }

    //go to the protected data
    req.user = freshUser
    next()

})

exports.restrictTo = (...args) => { 
    return(req,res,next)=>{
        if(!args.includes(req.user.role)){
            return next(new AppError('You are not authorized to perform this action ', 403))
        } 
        next();
    }
  
}
exports.forgotPassword = catchAsync( async (req , res , next ) => {
    // 1. Get user based on posted email 
    const user = await User.findOne({email : req.body.email})
    if(!user){
        return next(new AppError("There is no user with this email address") , 404);
    }
    console.log(user);
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false})

    // send it to the user's email 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`

    const message = `Forgot Your PassWord? Submit a Patch Request with Your new PassWord and passWord Confirm
    to : ${resetUrl}.\n If You didn't forgot your password , please Ignore`
    try{
        await sendEmail({
            email: user.email,
            text:message,
            subject : "Password Reset Request (Valid for 10 mins)",
        })
        res.status(200).json({
            status : "success" ,
            messsage: "Token Sent To Email"
            })
    }catch(err){
        console.log(err);
        return next(new AppError('there was an error , try again later',504))
    }
    

})
exports.resetPassword = async(req , res , next ) => {
    // 1. Get user based on token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token)
    .digest('hex')
    const user = await User.findOne({passwordResetToken : hashedToken , passwordResetExpires : {$gt : Date.now()}})

    // 2. If token is Not Expired , and their is user , set The new password
    if(!user){
        return next(new AppError('Token is Invalid or has Expired' , 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // please do this again security issues are there 
    await user.save({validateBeforeSave:false})

    //3 . update changedPasswordAt property for the user 
    createSendToken(user,200,res);



}

exports.updatePassword = catchAsync(async(req , res , next) =>{
    // Get User from Functionality 
    const user = await User.findById(req.user.id).select('+password')

    if(!(await user.correctPassword(req.body.passwordCurrent , user.password))){
        return next(new AppError("Your Current password is Wrong" , 401))
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user,200,res);


})
