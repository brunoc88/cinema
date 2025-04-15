const Pelicula = require('../models/pelicula')

const getPeliculas = async() =>{
    const peliculas = await Pelicula.find({})
    return peliculas.map(peli => peli.toJSON())
}

module.exports = {
    getPeliculas
}