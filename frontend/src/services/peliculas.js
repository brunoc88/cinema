import axios from 'axios'

const baseUrl = 'http://localhost:3000/pelicula'
let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getPeliculas = () => {
    try {
        const res = axios.get(`${baseUrl}/index`)
        return res.data
    } catch (error) {
        console({error: 'error al obtener peliculas', details:error})
        throw error
    }
}

export default { getPeliculas }