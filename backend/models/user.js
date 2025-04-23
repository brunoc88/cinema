const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
        minlength: 5
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
        minlength: 3
    },
    peliculas:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Pelicula'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // el passwordHash no debe mostrarse
      delete returnedObject.password
    }
})

const User = new mongoose.model('User', userSchema)

module.exports = User