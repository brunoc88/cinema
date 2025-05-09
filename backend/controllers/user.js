const bcrypt = require('bcrypt')
const User = require('../models/user')
const logger = require('../utils/loggers')
const Pelicula = require('../models/pelicula')

exports.obtenerUsuarios = async (req, res) => {
  try {
    const users = await User.find({}).populate('peliculas', { nombre: 1, id: 1 })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar usuarios', details: error.message })
  }
}

exports.buscarMiPeril = async (req, res) =>{
  try {
    const id = req.params.id

    const perfil = await User.findById(id)

    if(!perfil){
      return res.status(404).json({error: 'Usuario no encontrado!'})
    }

    if(perfil.id !== req.user.id){
      return res.status(401).json({error: 'No autorizado!'})
    }

    return res.status(200).json({perfil})
  } catch (error) {
    return res.status(500).json('Hubo un error', error)
  }
}

exports.altaUsuario = async (req, res) => {
  try {
    const { userName, email, password } = req.body

    const errores = verificarDatos(req.body)
    if (errores.length > 0) {
      return res.status(400).json({ error: errores })
    }
    const duplicados = await verificarDuplicados(req.body)
    if (duplicados.length > 0) {
      return res.status(409).json({ error: duplicados })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const nuevoUsuario = new User({
      userName,
      password: passwordHash,
      email
    })

    const savedUser = await nuevoUsuario.save()
    return res.status(201).json({ message: 'Usuario Creado!', user: savedUser })
  } catch (error) {
    logger.error(error.message)
    return res.status(500).json('Error al crear usuario')
  }
}

exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const findUser = await User.findById(id)

    if (!findUser) {
      return res.status(404).json({ error: 'Usuario no encontrado!' })
    }

    if (req.user.id !== findUser.id) {
      return res.status(401).json({ error: 'Sin autorizacion!' })
    }

    const errores = verificarDatos(req.body)

    if (errores.length > 0) {
      return res.status(400).json({ error: errores })
    }

    const cambios = await verificarCambios(req.body, findUser)

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'No hay cambios!' })
    }

    // solo si cambian userName o email, verificás duplicados
    if (cambios.userName || cambios.email) {
      const duplicados = await verificarDuplicados(cambios, findUser.id)
      if (duplicados.length > 0) {
        return res.status(409).json({ error: duplicados })
      }
    }
    const userChange = await User.findByIdAndUpdate(id, cambios, { new: true, runValidators: true })
    return res.status(200).json({ exito: 'Usuario editado!', user: userChange })
  } catch (error) {
    return res.status(500).json({ error: 'Problema al editar usuario', details: error.message })
  }
}

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    if (req.user.id !== id) {
      return res.status(401).json({ error: 'Sin autorizacion!' })
    }

    await User.findByIdAndDelete(id)
    return res.status(200).json({ exito: 'Usuario eliminado!' })
  } catch (error) {
    return res.status(500).json({ error: 'Problemas al eliminar usuario', details: error.message })
  }
}

exports.misPublicaciones = async (req, res) => {
  try {
    const { id } = req.params
    const peliculas = await Pelicula.find({ user: id })
    return res.status(200).json({ peliculas })
  } catch (error) {
    return res.status(500).json({ error: `Sucedio un error ${error}` })
  }
}

const verificarDatos = (body) => {
  const { userName, email, password } = body
  const errores = []

  if (!userName && !email && !password) {
    errores.push('Formulario vacio!')
  }

  if (!userName) errores.push('Nombre de usuario vacio!')
  if (!email) errores.push('Email vacio!')
  if (!password) errores.push('Password vacio!')
  if (password && password.length < 3) errores.push('Password demasiado corto!')
  if (userName && userName.length < 5) errores.push('Username demasiado corto!')

  return errores
}
// debe aceptar un parámetro opcional currentUserId
// si es null lo ignora y busca si el username o email estan disponibles
// caso contrario busca un username o email que este disponible y sea diferente al mio
const verificarDuplicados = async (body, currentUserId = null) => {
  const { userName, email } = body
  const errores = []

  if (userName) {
    const userNameExistente = await User.findOne({ userName })
    if (userNameExistente && userNameExistente.id !== currentUserId) {
      errores.push('Nick existente!')
    }
  }

  if (email) {
    const emailExistente = await User.findOne({ email })
    if (emailExistente && emailExistente.id !== currentUserId) {
      errores.push('Email existente!')
    }
  }

  return errores
}

const verificarCambios = async (body, user) => {
  const { userName, email, password } = body
  const userCambios = {}

  if (userName && userName !== user.userName) {
    userCambios.userName = userName
  }

  if (email && email !== user.email) {
    userCambios.email = email
  }

  if (password && !(await bcrypt.compare(password, user.password))) {
    userCambios.password = await bcrypt.hash(password, 10)
  }

  return userCambios
}
