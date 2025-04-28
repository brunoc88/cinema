const router = require('express').Router()
const peliculaController = require('../controllers/peliculas')
const upload = require('../utils/multer')
const { userExtractor } = require('../utils/middleware')

router.use(userExtractor)

router.get('/index', peliculaController.obtenerPeliculas)
router.post('/alta', upload.single('imagen'), peliculaController.altaPelicula)
router.delete('/baja/:id', peliculaController.bajarPelicula)
router.put('/editar/:id', upload.single('imagen'), peliculaController.editarPelicula)
router.patch('/like/:id', peliculaController.darLike)

module.exports = router
