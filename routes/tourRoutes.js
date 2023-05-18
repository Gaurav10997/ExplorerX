// const express = require('express');

// const Router = express.Router();

// const {
//   getTours,
//   getTour,
//   postTours,
// } = require('../controllers/tourController');

// Router.route('/').get(getTours).post(postTours);

// Router.route('/:id').get(getTour);

// module.exports = Router;
const authController = require('./../controllers/authController')
const tourController = require('./../controllers/tourController');
const express = require('express');


const router = express.Router();
console.log(tourController);

// router.param('id', tourController.checkID);

router
  .route('/')
  .get( authController.module.protect ,    tourController.getAllTours)
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
  .delete(authController.module.protect, authController.module.restrictTo('admin' ) ,  tourController.deleteTour);
  
module.exports = router;
