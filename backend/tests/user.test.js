const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const {getUsers} = require('../tests/test_helper')
const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        userName: 'jorgito56',
        email: 'jorgito56@gmail.com',
        password: passwordHash
    })
    await user.save()
})

describe('POST /user/alta', () => {
    test('Creando usuario', async () => {
        const user = {
            userName: 'bruno88',
            email: 'bruno88@gmail.com',
            password: '123'
        }
        
        const usersInicio = await getUsers()
    
        await api
            .post('/user/alta')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const usersFinal = await getUsers()
        const userNames = usersFinal.map(u => u.userName)
    
        expect(usersFinal).toHaveLength(usersInicio.length + 1)
        expect(userNames).toContain(user.userName)
    })

    test('Faltando el Username & email', async()=>{
        const user = {
            password: 'abc'
        }
        const usersInicio = await getUsers()

        const respuesta = await api
        .post('/user/alta')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersFinal = await getUsers()

        expect(usersFinal).toHaveLength(usersInicio.length)
        expect(respuesta.body.error).toContain('Nombre de usuario vacio!')
        expect(respuesta.body.error).toContain('Email vacio!')
        
    })

    test('Duplicado de email & username', async()=>{
        const user = {
            userName: 'jorgito56',
            email: 'jorgito56@gmail.com',
            password: '123'
        }

        const respuesta = await api
        .post('/user/alta')
        .send(user)
        .expect(409)
        .expect('Content-Type', /application\/json/)
        
        expect(respuesta.body.error).toContain('Nick existente!')
        expect(respuesta.body.error).toContain('Email existente!')
    })
    
})

describe('GET /user/index', () =>{
    test('Obteniendo todos los usuarios', async()=>{
        const respuesta = await api
        .get('/user/index')
        .expect(200)
        .expect('Content-Type', /application\/json/)

         // Verificamos que sea un array
         expect(Array.isArray(respuesta.body)).toBe(true)
         // Verificamos que contenga campos clave
        const user = respuesta.body[0]
        expect(user).toHaveProperty('userName')
        expect(user).toHaveProperty('email')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
