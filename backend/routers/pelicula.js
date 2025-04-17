const router = require('express').Router()
const peliculaController = require('../controllers/peliculas')
const upload = require('../utils/multer')

router.get('/index', peliculaController.obtenerPeliculas)

router.post('/alta', upload.single('imagen'),peliculaController.altaPelicula)

router.delete('/baja/:id', peliculaController.bajarPelicula)

module.exports = router