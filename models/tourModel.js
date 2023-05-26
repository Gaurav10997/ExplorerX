const mongoose = require('mongoose');
const Review = require('./../models/reviewModel')
// const userModel = require('./userModel')
// const DB = `mongodb+srv://natours:natours@cluster0.upgnn6z.mongodb.net/?retryWrites=true&w=majority`;
const DB = `mongodb+srv://natours:natours
@cluster0.upgnn6z.mongodb.net/`
mongoose.connect(DB).then(() => console.log('Connection established'));
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: [Number],
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: [true, 'A tour must have a Price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover Description'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],

  startLocation: {
    //GeoJson
    type: {
      type: String,
      default: "Point",
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }

  ],

},
);

tourSchema.set('toObject',{virtuals:true})
tourSchema.set('toJSON',{virtuals:true})
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7
})
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

tourSchema.pre('save' , async function(next){
  const guidePromise = this.guides.map(async(id)=> await userModel.findById(id));
  this.guides =  await Promise.all(guidePromise);
  next();
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
