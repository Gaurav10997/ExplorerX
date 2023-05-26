const express = require('express');

const reviewController = require('../controllers/reviewController')
const authController = require("../controllers/authController")


const router = express.Router({mergeParams:true})
// router
//   .route()
//   .post(authController.module.protect, authController.module.restrictTo('user'), reviewController.createReview)



router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.module.protect, 
    authController.module.restrictTo('user' ),
    reviewController.setTourUserIds,
     reviewController.createReview)

router
.route('/:id')
.get(reviewController.getReviewById)
.delete(reviewController.deleteReview)
.patch(reviewController.updateReview)

module.exports = router