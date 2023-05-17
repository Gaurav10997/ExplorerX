const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')


const getAllusers = catchAsync(async (req, res,next) => {

  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results:users.length ,
    data: {
      users
    }
  });
});


module.exports = {
  getAllusers,
};
