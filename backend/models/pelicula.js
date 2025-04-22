const mongoose = require('mongoose')

const peliculaSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true
        },
        director: {
            type: String,
            required: true
        },
        lanzamiento: {
            type: Number,
            required: true
        },
        genero:{
            type: String,
            required: true
        },
        descripcion:{
            type: String,
            required: true
        },
        imagen: {
            type: String,
            default: 'default.png'
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        likes: { type: Number, default: 0 }
    }
)


peliculaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Pelicula = new mongoose.model('Pelicula', peliculaSchema)

module.exports = Pelicula