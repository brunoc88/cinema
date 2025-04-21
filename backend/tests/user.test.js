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

describe('POST /login', () =>{
    test('Login usuario con email', async() => {
        const user = {
            user: 'jorgito56@gmail.com',
            password: 'sekret'
        }

        const res = await api
        .post('/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body.token).toBeDefined() //para saber si contiene una propiedad o variable token
        expect(res.body.username).toBe('jorgito56')//tobe sirve para comparar valores exactos
        //toContain sirve para comparar valores en string o arrays
        //como user name no es ninguno de los dos se uso toBe
    })

    test('Login usuario con username', async() => {
        const user = {
            user: 'jorgito56',
            password: 'sekret'
        }

        const res = await api
        .post('/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body.token).toBeDefined() 
        expect(res.body.username).toBe('jorgito56')
        expect(res.body.email).toBe('jorgito56@gmail.com')
        
    })

    test('Login sin usuario', async() => {
        const user = {
            password: 'sekret'
        }

        const res = await api
        .post('/login')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(res.body.error).toContain('Ingresar un usuario y contraseña!')
        
    })

    test('Login con usuario falso', async() => {
        const user = {
            user: 'jaimito',
            password: '000'
        }

        const res = await api
        .post('/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        expect(res.body.error).toContain('Usuario o contraseña incorrectos!')
        
    })

    test('Login usuario con password incorrecto', async() => {
        const user = {
            user: 'jorgito56@gmail.com',
            password: '000'
        }

        const res = await api
        .post('/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /application\/json/)

        expect(res.body.error).toContain('Usuario o contraseña incorrectos!')
        
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
