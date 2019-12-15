const HttpError = require('../models/http-error')
// const uuid = require('uuid/v4')
const Place = require('../models/place')
const mongoose = require('mongoose')
const User = require('../models/user')

const {validationResult} = require('express-validator')

// Get place from DB
const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.uid
   
    let places;
    try{
        places = await Place.find({creator: userId})
        if(places.length === 0){
            let error = new HttpError("No place found for User", 404)
            return next(error)           
        }
    } catch (err) {
        console.log(err)
        let error = new HttpError("Error in fetching Data", 500)
        return next(error)
    }
    res.status(200).json({totalCount: places.length ,places: places.map( place => place.toObject( {getters: true } )) })
}

const getPlaceByPlaceId = async (req, res, next) => {
    const placeId = req.params.pid

    let place
    try {
        place = await Place.findById(placeId)
        if(!place){
            console.log("No place found with placeId")
            let err = new HttpError("No place found with placeId", 404)
            return next(err)
        }
    } catch(err) {
        console.log(err)
        let error = new HttpError("Unable to find place", 404)
        return next(error)
    }
    res.status(200).json({place: place.toObject( {getters: true})})
}

// Create new place in DB
const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        throw new HttpError("Invalid Input Parameters", 422)
    }

    // extract from body
    const {title, description, coordinates, address, creator} = req.body

    // create a new Place model object
    const createdPlace = new Place({
        title,
        description,
        image: "test.com",
        location: {
            "lat": 2,
            "lng": 3,
        },
        address,
        creator
    })

    //check if creator user exists
    let existingUser;
    try{
        existingUser = await User.findById(creator)
    } catch(err){
        console.log(err)
        const error = new HttpError("Failed creating Place in DB", 404)
        return next(error)      
    }

    if(!existingUser){
        console.log("No user found with userId")
        let err = new HttpError("No user found with userId", 404)
        return next(err)
    }

    console.log(existingUser)

    // push Place object into DB
    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({session: sess})
        existingUser.places.push(createdPlace)
        await existingUser.save({session: sess})
        await sess.commitTransaction()
    } catch (err) {
        console.log(err)
        const error = new HttpError("Failed creating Place in DB", 404)
        return next(error)
    }
    res.status(201).json({place: createdPlace.toObject({getters: true})})
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        throw new HttpError("Invalid input Parameters", 422)
    }

    const {title, description} = req.body
    const pid = req.params.pid

    let identifiedPlace;

    try{
        identifiedPlace = await Place.findById(pid)
    } catch(err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)       
    }

    if(!identifiedPlace){
        const error = new HttpError("No place found for given PlaceId", 404)
        return next(error)
    }

    identifiedPlace.title = title
    identifiedPlace.description = description

    try{
        identifiedPlace = await identifiedPlace.save()
    } catch( err){
        console.log(err)
        const error = new HttpError("Error in accessing DB", 500)
    }

    res.status(200).json({updatedPlace: identifiedPlace.toObject( { getters: true } )})
}

const deletePlace = async (req, res, next) => {
    pid = req.params.pid

    let identifiedPlace

    try{
        identifiedPlace = await Place.findById(pid).populate('creator')
    } catch (err) {
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)
    }

    if(!identifiedPlace){
        let error = new HttpError("No Place found with given Pid", 404)
        return next(error)
    }

    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await identifiedPlace.remove({session: sess})
        identifiedPlace.creator.places.pull(identifiedPlace)
        await identifiedPlace.creator.save({session: sess})
        await sess.commitTransaction()
    }catch(err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)
    }
    res.status(200).json({message: "deleted successfully"})
}

exports.getPlaceByPlaceId = getPlaceByPlaceId
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace