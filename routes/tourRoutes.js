const authController = require('./../controllers/authController')
const tourController = require('./../controllers/tourController');
const express = require('express');
// const reviewController = require("./../controllers/reviewController")
const reviewRouter = require("./../routes/reviewRoutes")


const router = express.Router();
// router.param('id', tourController.checkID);

router.use('/:tourId/reviews' , reviewRouter)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('user'), tourController.deleteTour);


module.exports = router;
