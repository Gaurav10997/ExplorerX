const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
// const getTours = async (req, res) => {
//   try {
    // Always take the new queryObj just because we dont want to change the original one 
    // 1) Filtering http://localhost:8090/api/v1/tours?price=497&name=radhika
    // const queryObj = { ...req.query };
    // const filter = ['page', 'sort', 'limit', 'fields'];



    // This code for filterring the keywords form main queryobject
    // filter.forEach((element) => delete queryObj[element]);
    // console.log(queryObj);
    // console.log(req.query);
    
    // 2.Advance Filtering  http://localhost:8090/api/v1/tours?price[gte]=497
    // what we want from query object from searching { price : { $gte: 2000 }}
    // what we are getting  query object from searching { price: { gte: '497' }}
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g , match=> `$${match}`)
    // console.log(JSON.parse(queryString));
    // let query = await Tour.find(JSON.parse(queryString));
    // let query = await Tour.find(JSON.parse(queryString));
    // console.log(query);
   
    // query = query.sort("price");
    // console.log(query);
    // const tours = await Tour.find();

    // figure out why this is not working big Pain 
    //3 Sorting 
    // if(req.query.sort){
       // http://localhost:8090/api/v1/tours?sort=price,ratingsAverage
       // But we need query.sort(price ratingsAverage)
    //    const sortBy = req.query.sort.split(',').join(' ');
    //    console.log(sortBy);
    //    query = query.sort(`${sortBy}`);
    // }
    // console.log(query);
    //4 limiting fields 
    // if(req.query.limit){
      // http://localhost:8090/api/v1/tours?sort=price,ratingsAverage
      // But we need query.sort(price ratingsAverage)
  //     const limitBy = req.query.sort.split(',').join(' ');
  //     console.log(limitBy);
  //     query = query.sort(`${limitBy}`);
  //  }
    // res.status(200).json({
    //   status: 'success',
    //   length: Tour.length,
    //   data: {
    //     tours:query,
    //   },
    // });
//   } catch (err) {
//     res.status(400).json({
//       status: 'failed',
//       message: err,
//     });
//   }
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// const getTour = async (req, res) => async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     // Tour.findOne({ _id: req.params.id })

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// const postTours = async (req, res) => {
//   console.log(req.body);
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};



exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
   // good trick for changing string to numbers 
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' // it will just agregate function by the start dates 
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

