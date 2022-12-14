const express = require('express')
const router = express.Router({ mergeParams: true })

const Campground = require('../models/campground')
const Review = require('../models/review')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const { reviewSchema } = require('../schemas')

const { isLoggedIn } = require('../middleware')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.reviews)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created New Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId} })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted.')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router