const express = require('express')

const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('./utils/loggers')
const { MONGODB_URI } = require('./utils/config')
const { tokenExtractor, requestLogger, unknownEndpoint } = require('./utils/middleware')
const peliculaRouter = require('./routers/pelicula')
const userRouter = require('./routers/user')
const loginRouter = require('./routers/login')

// conectando a la DB
mongoose.set('strictQuery', false)

logger.info('Conectando a Base de datos: ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Conexion a Base de datos exitosa!')
  })
  .catch((error) => {
    logger.error('Error al conectar a Base de datos: ', error.message)
  })

// middleware
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
// rutas
app.use('/pelicula', peliculaRouter)
app.use('/user', userRouter)
app.use('/login', loginRouter)

app.use(requestLogger)
app.use(unknownEndpoint)

module.exports = app
