const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Pelicula = require('../models/pelicula');
const { getPeliculas } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Pelicula.deleteMany({});

    const peliculaInicial = {
        nombre: 'Matrix',
        director: 'Wachowski',
        lanzamiento: 1999,
        genero: 'Sci-Fi',
        descripcion: 'Neo y las pastillas'
    };

    await Pelicula.create(peliculaInicial);
});

describe('POST /pelicula/alta', () => {
    test('Creando pelicula', async () => {
        const pelicula = {
            nombre: 'Terminator',
            director: 'James Cameron',
            lanzamiento: 1984,
            genero: 'Accion',
            descripcion: 'Una máquina del futuro es enviada al pasado para evitar la destrucción de la raza humana'
        };

        const pelisAlComienzo = await getPeliculas();

        await api
            .post('/pelicula/alta')
            .send(pelicula)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const pelisAlFinal = await getPeliculas();

        expect(pelisAlFinal).toHaveLength(pelisAlComienzo.length + 1);
    });

    test('Enviando datos vacios', async () => {
        const pelicula = {}

        await api
            .post('/pelicula/alta')
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
            .send(peliculaSinDirector)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(respuesta.body.error).toContain('Falta el director!');
    });

});

describe('GET /pelicula/index', () => {
    test('obtener listado de peliculas', async () => {
        await api
            .get('/pelicula/index')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(async () => {
    await mongoose.connection.close();
});
