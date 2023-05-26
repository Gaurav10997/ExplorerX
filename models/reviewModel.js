const { default: mongoose } = require("mongoose");

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

const Review = mongoose.model('Review' , reviewSchema)

module.exports = Review;