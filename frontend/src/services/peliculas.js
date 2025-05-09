import axios from 'axios'

const baseUrl = 'http://localhost:3000/pelicula'
let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getPeliculas = () => {
    try {

        if (!token) {
            throw new Error('Acceso invalido!')
        }

        let config = {
            headers: { Authorization: token }
        }

        const request = axios.get(`${baseUrl}/index`, config)

        return request.then(res => res.data)
    } catch (error) {
        console.log({ error: 'error al obtener peliculas', details: error })
        throw error
    }
}

const postearPelicula = async (formData) => {
    try {
        if (!token) throw new Error('Acceso inválido!')

        const config = {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
            }
        }

        const res = await axios.post(`${baseUrl}/alta`, formData, config)
        return res.data
    } catch (error) {
        return { error: error.response?.data.error || "Error desconocido" }
    }

}

const eliminarPelicula = async (id) => {
    try {
        if (!token) throw new Error('Acceso inválido!')
        const config = {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
            }
        }
        const res = await axios.delete(`${baseUrl}/baja/${id}`, config)
        return res.data
    } catch (error) {
        return { error: error.response?.data.error + error.response?.data.details }
    }
}

const obtenerPelicula = async (id) => {
    try {
        if (!token) throw new Error('Acceso inválido!')
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            }
            const res = await axios.get(`${baseUrl}/actualizar/${id}`, config)
            return res.data
    } catch (error) {
        return { error: error.response?.data.error + error.response?.data.details }
    }
}

const editarPelicula = async (id, formData) => {
    try {
        if (!token) throw new Error('Acceso inválido!')
        const config = {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
            }
        }
        const res = await axios.put(`${baseUrl}/editar/${id}`, formData, config)
        return res.data
    } catch (error) {
        return { error: error.response?.data?.error + " " + error.response?.data?.details }
    }
}

const darLike = async (id) =>{
    try {
        if (!token) throw new Error('Acceso inválido!')
        const config = {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
            }
        }
        const res = await axios.patch(`${baseUrl}/like/${id}`, {}, config)
        return res.data
    } catch (error) {
        return { error: error.response?.data?.error}
    }
}

export {
    getPeliculas,
    setToken,
    postearPelicula,
    eliminarPelicula,
    obtenerPelicula,
    editarPelicula,
    darLike
}