import axios from "axios"

const baseUrl = 'http://localhost:3000/user'

let token = null

const setTokenUser = newToken => {
    token = `Bearer ${newToken}`
}

const crearUsuario = async (userForm) => {
    try {
        const res = await axios.post(`${baseUrl}/alta`, userForm)
        return res.data
    } catch (error) {
        return { error: error.response?.data.error || 'Error al crear usuario' }
    }
}

const eliminarCuenta = async (id) => {
    try {
        if (!token) {
            throw new Error('Acceso invalido!')
        }

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.delete(`${baseUrl}/eliminar/${id}`, config)
        return res.data
    } catch (error) {
        return error.response?.data.error
    }

}

const misDatos = async (id) =>{
    try {
        if (!token) {
            throw new Error('Acceso invalido!')
        }

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.get(`${baseUrl}/perfil/${id}`, config)
        return res.data
    } catch (error) {
        return error.response?.data.error 
    }
}

const editarMyUser = async (id, user) => {
    try {
        if (!token) {
            throw new Error('Acceso invalido!')
        }

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.put(`${baseUrl}/editar/${id}`, user, config)
        return res.data
    } catch (error) {
        return error.response?.data.error
    }
}
export { crearUsuario, setTokenUser, eliminarCuenta, misDatos, editarMyUser }