const { default: mongoose } = require("mongoose");
const Tour = require('./tourModel')
const reviewSchema  = new mongoose.Schema({
    review:{
        type:String,
        required: [true , "Review Cant Be Empty"]
    },
    ratings:{
        type:Number,
        min:1,
        max:5

    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"Tour Id Is Required"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true , 'Review must Belong To a User']
    }
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
})




reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'tour',
        select:"name"
    })
    next()
})

// static methods 

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    console.log(tourId);
   const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nratings:{$sum :1},
                avgratings:{ $avg:'$ratings' }
            }
        }
        
    ])
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity:1,
        ratingsAverage:1
    })
    console.log(stats);

}


    reviewSchema.post('save', function(){
        // this points to current review 


        // review is no defined 
        // Review.calcAverageRatings(this.tour)

        this.constructor.calcAverageRatings(this.tour)
    })
  
const Review = mongoose.model('Review' , reviewSchema)

module.exports = Review;