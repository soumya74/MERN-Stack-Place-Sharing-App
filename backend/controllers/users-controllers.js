const HttpError = require('../models/http-error')

const {validationResult} = require('express-validator')
const User = require('../models/user')

const getAllUsers = async (req, res, next) => {

    let allUsers;

    try{
        allUsers = await User.find({}, '-password')
    } catch(err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)          
    }

    res.status(200).json({totalCount: allUsers.length, users: allUsers.map( user => user.toObject( {getters: true}) )  })
}

const signupHandler = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors){
        console.log(errors)
        const error = new HttpError("Invalid input parameters", 422)
        return next(error)
    }

    const {email, password, name} = req.body

    let existingUser
    try{
        existingUser =await User.findOne({email: email})
    }catch (err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)     
    }

    if(existingUser){
        console.log("User with email already exists")
        const error = new HttpError("User with email already exists", 500)
        return next(error)
    }

    const places = "places"
    const createdUser = new User({
        name,
        email,
        password,
        image: "test@test.com",
        places: []
    })

    try{
        await createdUser.save()
    } catch(err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)        
    }

    res.status(200).json({user: createdUser.toObject( {getters: true} )})
}

const loginHandler = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({email: email})
    } catch(err){
        console.log(err)
        let error = new HttpError("Error while fetching Data from DB", 500)
        return next(error)            
    }

    if(!existingUser || existingUser.password!==password){
        console.log("No User found with given email & password")
        let error = new HttpError("No User found with given email & password", 401)
        return next(error)     
    }
    res.status(200).json({user: existingUser.toObject({getters: true})})
}

exports.getAllUsers = getAllUsers
exports.signupHandler = signupHandler
exports.loginHandler = loginHandler