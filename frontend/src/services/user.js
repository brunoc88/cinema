import axios from "axios"

const baseUrl = 'http://localhost:3000/user'

const crearUsuario = async(userForm) =>{
    try {
        const res = await axios.post(`${baseUrl}/alta`, userForm)
        return res.data
    } catch (error) {
        return { error: error.response?.data.error || 'Error al crear usuario'}
    }
}

export {crearUsuario}