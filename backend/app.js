const express = require('express')
const app = express()
const logger = require('./utils/loggers')
const { MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')
const peliculaRouter = require('./routers/pelicula')


//conectando a la DB
mongoose.set('strictQuery',false)

logger.info('Conectando a Base de datos: ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
.then(()=>{
    logger.info('Conexion a Base de datos exitosa!')
})
.catch(error =>{
    logger.error('Error al conectar a Base de datos: ', error.message)
})


//middleware
app.use(express.json())

//rutas
app.use('/pelicula',peliculaRouter)

app.get('/',(req,res)=> res.status(200).send('Hola!'));


module.exports = app