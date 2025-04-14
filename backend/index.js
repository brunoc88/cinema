const express = require('express')
const app = express()
const logger = require('./Utils/loggers')
const {PORT} = require('./Utils/config')


app.get('/',(req,res)=> res.status(200).send('Hola!'));

app.listen(PORT,()=>{
    logger.info(`Escuchando Puerto:: ${PORT}`)
})