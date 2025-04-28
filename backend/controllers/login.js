const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { SECRET } = require('../utils/config')

exports.login = async (req, res) => {
  try {
    const { user, password } = req.body

    if (!user || !password) {
      return res.status(400).json({ error: 'Ingresar un usuario y contraseña!' })
    }

    // Buscar por nombre de usuario o email
    const userEncontrado = await User.findOne({
      $or: [{ userName: user }, { email: user }]
    })

    if (!userEncontrado) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos!' })
    }

    const passwordCorrect = await bcrypt.compare(password, userEncontrado.password)

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos!' })
    }

    const userForToken = {
      username: userEncontrado.userName,
      id: userEncontrado._id
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

    return res.status(200).json({
      token,
      email: userEncontrado.email,
      username: userEncontrado.userName,
      id: userEncontrado._id
    })
  } catch (error) {
    return res.status(500).json({ error: 'Hubo un problema', detalle: error.message })
  }
}
