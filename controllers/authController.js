const jwt = require('jsonwebtoken')

const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const signToken = id =>{
    return jwt.sign({
        id
    },'processenvjwtsecret',{
        expiresIn: '1d'
    })
}
const signup = catchAsync(async(req,res,next) => {
    // problem is that everyone can use to login and signup using admin 
    // const newUser = await User.create(req.body);
    const newUser = await(User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }))

    // secret should be 32 characters  and dont wrte here wite env variable i will do it later 
    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success' , 
        token,
        data: { 
            tour: newUser
            }
        });
        
})

 const login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    // check if email and password esidet 
    if (!email || !password) {
       return next(new AppError('Please provide email and password', 400));
    }; 
    
    //check if user exists && password is correct 

    const user = await User.findOne({email}).select('+password')
    const correct = await user.correctPassword(password,user.password)
    if(!user || !correct){
        return next(new AppError('Invalid email or password', 401));
    }
    // if evereything is ok , send token to client 

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success' ,
        token,

    })
})
exports.module = {
    signup,
    login
}