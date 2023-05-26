const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const handleFactory = require('./../controllers/handleFactory')

exports.getAllusers = async(req,res) =>{
  const user = await User.find()

  res.status(200).json({
    result:"Success",
    data:{
      data:user
    }
  })
}
exports.getUser = handleFactory.getOne(User)
exports.deleteUser  = handleFactory.deleteOne(User)
exports.updateUser  = handleFactory.updateOne(User);


