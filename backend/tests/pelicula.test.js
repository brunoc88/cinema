const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Pelicula = require('../models/pelicula')
const { getPeliculas } = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)


let userId = null
let token = null


beforeEach(async () => {
    await Pelicula.deleteMany({})
    await User.deleteMany({})

    const userNuevo = {
        email: 'bruno88@gmail.com',
        userName: 'bruno88',
        password: '123'
    }

    await api
        .post('/user/alta')
        .send(userNuevo)

    const loginRes = await api
        .post('/login')
        .send({ user: userNuevo.userName, password: userNuevo.password })

    token = loginRes.body.token
    userId = loginRes.body.id

    const peliculaInicial = {
        nombre: 'Matrix',
        director: 'Wachowski',
        lanzamiento: 1999,
        genero: 'Sci-Fi',
        descripcion: 'Neo y las pastillas',
        imagen: 'uploads/default.png',
        user: userId 
    }

    await Pelicula.create(peliculaInicial)//guardado directo en base de datos de test
})


describe('POST /pelicula/alta', () => {
    test('crear una nueva película sin imagen', async () => {
        const pelicula = {
            nombre: 'Terminator',
            director: 'James Cameron',
            lanzamiento: 1984,
            genero: 'Accion',
            descripcion: 'Una máquina del futuro es enviada al pasado para evitar la destrucción de la raza humana'
        }

        const pelisAntes = await getPeliculas()

        await api
            .post('/pelicula/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(pelicula)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const pelisDespues = await getPeliculas()
        expect(pelisDespues).toHaveLength(pelisAntes.length + 1)

        const nombres = pelisDespues.map(p => p.nombre)
        expect(nombres).toContain('Terminator')
    })
    
    test('Enviando datos vacios', async () => {
        const pelicula = {}

        await api
            .post('/pelicula/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(pelicula)
            .expect(400)
            .expect('Content-Type', /application\/json/);
    })

    test('Duplicado de peliculas', async () => {
        const pelicula = {
            nombre: 'Matrix',
            director: 'Wachowski',
            lanzamiento: 1999,
            genero: 'Sci-Fi',
            descripcion: 'Neo y las pastillas'
        };

        await api
            .post('/pelicula/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(pelicula)
            .expect(409)
            .expect('Content-Type', /application\/json/);
    })
    test('Falta el nombre', async () => {
        const peliculaSinNombre = {
            director: 'James Cameron',
            lanzamiento: 1984,
            genero: 'Acción',
            descripcion: 'Una máquina del futuro...'
        };

        const respuesta = await api
            .post('/pelicula/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(peliculaSinNombre)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(respuesta.body.error).toContain('Falta el nombre!');
    });

    test('Falta el director', async () => {
        const peliculaSinDirector = {
            nombre: 'Terminator',
            lanzamiento: 1984,
            genero: 'Acción',
            descripcion: 'Una máquina del futuro...'
        };

        const respuesta = await api
            .post('/pelicula/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(peliculaSinDirector)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(respuesta.body.error).toContain('Falta el director!');
    });

    test('Creando pelicula sin token', async() =>{
        const pelicula = {
            nombre: 'Terminator',
            director: 'James Cameron',
            lanzamiento: 1984,
            genero: 'Accion',
            descripcion: 'Una máquina del futuro es enviada al pasado para evitar la destrucción de la raza humana'
        }

        const respuesta = await api
            .post('/pelicula/alta')
            .send(pelicula)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(respuesta.body.error).toContain('Falta Token!')
        
    })
})

describe('GET /pelicula/index', () => {
    test('obtener listado de peliculas', async () => {
        await api
            .get('/pelicula/index')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('obtener listado de peliculas sin token', async () => {
        const res = await api
            .get('/pelicula/index')
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(res.body.error).toContain('Falta Token!')
    })
})

describe('DELETE /pelicula/baja/:id', () => {
    test('Eliminar Pelicula', async () => {
        const peliculas = await getPeliculas();
        const pelicula = peliculas[0]

        const respuesta = await api
            .delete(`/pelicula/baja/${pelicula.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const peliculasFinal = await getPeliculas();

        expect(respuesta.body.message).toContain('Pelicula eliminada con éxito!')
        expect(peliculasFinal).toHaveLength(peliculas.length - 1)
    })

    test('Eliminar Pelicula con token invalido o diferente', async () => {
        const peliculas = await getPeliculas();
        const pelicula = peliculas[0]

        //creo un nuevo usuario
        const userAlternativo = {
            email: 'jorgito56@gmail.com',
            userName: 'jorgito56',
            password: '123'
        }
    
        await api
            .post('/user/alta')
            .send(userAlternativo)
    
        const loginRes = await api
            .post('/login')
            .send({ user: userAlternativo.userName, password: userAlternativo.password })

        let alternativoToken = loginRes.body.token

        const respuesta = await api
            .delete(`/pelicula/baja/${pelicula.id}`)
            .set('Authorization', `Bearer ${alternativoToken}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(respuesta.body.error).toContain('No tienes autorizacion!')
        expect(respuesta.body.details).toContain('Solo el creador puede borrar su posteo!')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})