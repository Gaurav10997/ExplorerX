// const catchAsync = require('./../utils/catchAsync')
// const AppError = require('./../utils/appError')
const Review = require('../models/reviewModel')
const handleFactory = require('../controllers/handleFactory')
exports.getAllReviews= handleFactory.getAll(Review)
exports.setTourUserIds = (req , res , next) =>{
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id;
    next()
}
exports.getReviewById = handleFactory.getOne(Review)
exports.createReview  = handleFactory.createOne(Review)
exports.deleteReview  = handleFactory.deleteOne(Review)
exports.updateReview  = handleFactory.updateOne(Review)

