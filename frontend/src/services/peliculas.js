import axios from 'axios'

const baseUrl = 'http://localhost:3000/pelicula'
let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getPeliculas = () => {
    try {
       
        if(!token){
            throw new Error('Acceso invalido!')
        }

        let config = {
            headers: { Authorization: token }
        }
          
        const request = axios.get(`${baseUrl}/index`, config)
        
        return request.then(res => res.data)
    } catch (error) {
        console.log({error: 'error al obtener peliculas', details:error})
        throw error
    }
}

const postearPelicula = async (formData) => {
    if (!token) throw new Error('Acceso inválido!')
    
    const config = {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data'
      }
    }
  
    const res = await axios.post(`${baseUrl}/alta`, formData, config)
    return res.data
  }
  
export { getPeliculas, setToken, postearPelicula }