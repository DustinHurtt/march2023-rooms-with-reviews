var express = require('express');
var router = express.Router();

const Review = require('../models/Review');
const Room = require('../models/Room')

const { isLoggedIn } = require('../middleware/route-guard')

router.post('/add-review/:id', isLoggedIn, (req, res, next) => {

    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        console.log("New review:", newReview)
        return Room.findByIdAndUpdate(
            req.params.id, 
            {
            $push: {reviews: newReview._id}
            }
        ,
        {new: true}
        )})
    .then((updatedRoom) => {
        console.log('Updated Room:', updatedRoom)
        res.redirect(`/rooms/room-details/${updatedRoom._id}`)
    })
    .catch((err) => {
        console.log(err)
    })


})

module.exports = router;