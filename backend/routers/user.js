const router = require('express').Router()
const userController = require('../controllers/user')

router.get('/index', userController.obtenerUsuarios)

router.post('/alta', userController.altaUsuario)



module.exports = router