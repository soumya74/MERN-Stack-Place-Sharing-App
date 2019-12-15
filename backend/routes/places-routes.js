const express = require('express');

const {check} = require('express-validator')

const PlacesController = require('../controllers/place-controllers')

const route = express.Router();

// Routes for Places
route.get( '/user/:uid', PlacesController.getPlaceByUserId)
route.get( '/:pid', PlacesController.getPlaceByPlaceId)
route.post('/', [check('title').not().isEmpty(),
                 check('description').isLength({min: 5}),
                 check('address').not().isEmpty()] ,PlacesController.createPlace)
route.patch('/:pid', [check('title').not().isEmpty(),
                      check('description').isLength({min: 5})] , PlacesController.updatePlace)
route.delete('/:pid', PlacesController.deletePlace)

module.exports = route;