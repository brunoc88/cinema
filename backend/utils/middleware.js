const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const User = require('../models/user')
const logger = require('./loggers')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Falta Token!' })
  }

  try {
    const decodedToken = jwt.verify(req.token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado!' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint
}
