//1import mongoose
const mongoose = require('mongoose')

//2schema creation 
const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
       
    },
        type: {
        type: String,
        required: true
    },
    
    breed: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    petImage: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

//3 create model
const pets = mongoose.model('pets',petSchema)

module.exports = pets