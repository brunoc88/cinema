const mongoose = require('mongoose')

const peliculaSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
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
        }
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