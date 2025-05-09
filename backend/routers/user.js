const router = require('express').Router()
const userController = require('../controllers/user')
const { userExtractor } = require('../utils/middleware')

router.get('/index', userController.obtenerUsuarios)

router.get('/perfil/:id', userExtractor, userController.buscarMiPeril)

router.post('/alta', userController.altaUsuario)

router.put('/editar/:id', userExtractor, userController.editarUsuario)

router.delete('/eliminar/:id', userExtractor, userController.eliminarUsuario)

router.get('/mispost/:id', userExtractor, userController.misPublicaciones)

module.exports = router
