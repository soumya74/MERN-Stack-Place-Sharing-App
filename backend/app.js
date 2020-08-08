const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var options = {server: {socketOptions: {socketTimeoutMS: 5000}}};

const httpError = require('./models/http-error')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')

const app = express();

app.use(bodyParser.json())

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
} )

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use('/', (req, res, next) => {
    const error = new httpError("url not found", 404)
    throw error
})

app.use( (error, req, res, next) => {
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "Unknown Error occurred"})
})

mongoose.connect('mongodb://abcdefgh:XvqMzPJPhPCsiGYd@meanstack-shard-00-00-jxtyb.mongodb.net:27017,meanstack-shard-00-01-jxtyb.mongodb.net:27017,meanstack-shard-00-02-jxtyb.mongodb.net:27017/mernAppDB?ssl=true&replicaSet=MeanStack-shard-0&authSource=admin&retryWrites=true&w=majority', options)
    .then( () => {
        app.listen(5000)
    } )
    .catch( err => {
        console.log(err)
    })
