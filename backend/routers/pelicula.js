const router = require('express').Router()
const peliculaController = require('../controllers/peliculas')

router.get('/index', peliculaController.obtenerPeliculas)

router.post('/alta', peliculaController.altaPelicula)

module.exports = router