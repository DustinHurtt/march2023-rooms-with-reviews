var express = require('express');
var router = express.Router();

const Room = require('../models/Room');

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/add-room', (req, res, next) => {
    res.render('rooms/add-room.hbs')
})

router.post('/add-room', isLoggedIn, (req, res, next) => {
    const { name, description, imageUrl } = req.body

    Room.create({
        name,
        description,
        imageUrl,
        owner: req.session.user._id
    })
    .then((createdRoom) => {
        console.log("New Room:", createdRoom)
        res.redirect(`/rooms/room-details/${createdRoom._id}`)
    })
    .catch((err) => {
        console.log(err)
    })
        

})

router.get('/all-rooms', (req, res, next) => {

    Room.find()
        .then((rooms) => {
            res.render('rooms/all-rooms.hbs', { rooms })
        })
        .catch((err) => {
            console.log(err)
        })

})

router.get('/room-details/:id', (req, res, next) => {
    
    Room.findById(req.params.id)
        .populate('owner')
        .populate({path: "reviews", 
            populate: {path: "user"}})
        .then((foundRoom) => {

            let copiedRoom = { ...foundRoom }

            if (req.session.user) {
            
            if (foundRoom.owner._id.toString() === req.session.user._id) {
                copiedRoom._doc.isOwner = true
                
                } 
            }
            res.render('rooms/room-details.hbs', copiedRoom._doc)
            
        })
        .catch((err) => {
            console.log(err)
        })
 
})

router.get('/edit-room/:id', (req, res, next) => {

    Room.findById(req.params.id)
        .populate('owner')
        .then((foundRoom) => {
            res.render('rooms/edit-room.hbs', foundRoom)
            
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router;