const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../utils/loggers')

exports.obtenerUsuarios = async (req, res) =>{
    try {
        const users = await User.find({}).populate('peliculas', { nombre: 1, id: 1 })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({error: 'Error al buscar usuarios', details: error.message})
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
        if(duplicados.length > 0){
            return res.status(409).json({error: duplicados})
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
        return res.status(500).json('Error al crear usuario');
    }
}

const verificarDatos = (body) => {
    const { userName, email, password } = body
    const errores = [];

    if (!userName && !email && !password) {
        errores.push('Formulario vacio!')
    }

    if (!userName) errores.push('Nombre de usuario vacio!')
    if (!email) errores.push('Email vacio!')
    if (!password) errores.push('Password vacio!')

    return errores

}

const verificarDuplicados = async (body) => {
    const { userName, email } = body
    const errores = []

    const userNameExistente = await User.findOne({ userName })
    const emailExistente = await User.findOne({ email })

    if (userNameExistente) {
        errores.push('Nick existente!')
    }
    if (emailExistente) {
        errores.push('Email existente!')
    }

    return errores
}