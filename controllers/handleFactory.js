const catchAsync  =  require("../utils/catchAsync");
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');



exports.getAllUsers = (Modal) => catchAsync(async (req, res,next) => {

    const users = await Modal.find();
    res.status(200).json({
      status: 'success',
      results:users.length ,
      data: {
        data:users
      }
    });
  });


exports.deleteOne = (Modal) => catchAsync(async (req, res,next) => {

    const modal = await Modal.findByIdAndDelete(req.params.id);
    if(!modal){
    return next(new AppError(`No Tour Found with that ID`,400))
    }
    res.status(204).json({
    status: 'success',
    data: null
    });
});

exports.updateOne = Modal => catchAsync(async (req, res, next) => {
        const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });

        if(!doc){
            return next(new AppError('No Tour foun with that Id '))
        }
    
        res.status(200).json({
          status: 'success',
          data: {
            data:doc
          }
        });
    
    });

    exports.createOne = Model => catchAsync( async (req, res,next) => {
        const newTour = await Model.create(req.body);
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
          });
      });


      exports.getOne = (Model, popOptions) => catchAsync(async (req, res,next) => {
        let query = Model.findById(req.params.id); 
        if(popOptions){
            query = query.populate(popOptions);
        }
        const tour = await query;
        if(!tour){
          return next(new AppError('No Tour Found with that ID',400))
        }
        // Tour.findOne({ _id: req.params.id })
    
        res.status(200).json({
          status: 'success',
          data: {
           data:tour
          }
        });
    
    });

    exports.getAll = (Model) => catchAsync(async (req, res, next) => {
        // EXECUTE QUERY

        let filter = {}
        if(req.params.tourId) filter = {tour:req.params.tourId}
        const features = new APIFeatures(Model.find(), req.query)
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
            data:tours
          }
        });
    });


