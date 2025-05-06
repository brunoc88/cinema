import axios from 'axios'

const baseUrl = 'http://localhost:3000/login'

const loginUser = async (user) => {
  try {
    const response = await axios.post(baseUrl, user)
    return response.data
  } catch (error) {
    return { error: error.response?.data?.error}
  }
}

export { loginUser }
