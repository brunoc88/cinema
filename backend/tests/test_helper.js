const Pelicula = require('../models/pelicula')
const User = require('../models/user')

const getPeliculas = async () => {
  const peliculas = await Pelicula.find({})
  return peliculas.map((peli) => peli.toJSON())
}

const getUsers = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}
module.exports = {
  getPeliculas,
  getUsers
}
