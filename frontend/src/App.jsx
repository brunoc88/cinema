import { useState, useEffect } from "react"
import { LoginForm } from "./components/login"
import { Pelicula } from "./components/pelicula"
import { PeliculaForm } from "./components/peliculaForm"
import { Notificaciones } from "./components/notificaciones"
import { loginUser } from "./services/login"
import { setToken, getPeliculas, postearPelicula, eliminarPelicula } from "./services/peliculas"


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [peliculas, setPeliculas] = useState([])
  const [pelicula, setPelicula] = useState({
    nombre: '',
    director: '',
    lanzamiento: '',
    genero: '',
    descripcion: '',
    imagen: null // imagen se guarda como archivo
  })
  const [mostrarFormularioPelicula, setMostrarFormularioPelicula] = useState(false)
  const [notificacion, setNotificacion] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerCinemaAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user && user.token) {
      setToken(user.token)
      getPeliculas()
        .then(pelicula => {
          setPeliculas(pelicula.sort((a, b) => b.nombre.localeCompare(a.nombre)))
        })
        .catch(error => {
          console.error("Error al obtener películas:", error)
        })
    }
  }, [user])


  const handlerPelicula = (event) => {
    const { value, name } = event.target

    setPelicula({
      ...pelicula,
      [name]: value
    })
  }

  const handleFileChange = (event) => {
    setPelicula(prev => ({
      ...prev,
      imagen: event.target.files[0]
    }))
  }

  const handlerLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await loginUser({ user: username, password })
      window.localStorage.setItem('loggerCinemaAppUser', JSON.stringify(user))
      setUser(user)
      setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogOut = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem('loggerCinemaAppUser');
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      const formData = new FormData()
      formData.append('nombre', pelicula.nombre)
      formData.append('director', pelicula.director)
      formData.append('genero', pelicula.genero)
      formData.append('descripcion', pelicula.descripcion)
      formData.append('lanzamiento', pelicula.lanzamiento)
      formData.append('imagen', pelicula.imagen)

      const nueva = await postearPelicula(formData)
      console.log('Respuesta del POST:', nueva)

      // En caso de error
      if (nueva && nueva.error) {
        setNotificacion({ tipo: 'error', mensaje: nueva.error })
        setTimeout(() => setNotificacion(null), 5000)
        return
      }

      // En caso de éxito
      setNotificacion({ tipo: 'exito', mensaje: nueva.Mensaje })
      setTimeout(() => setNotificacion(null), 5000)

      setPeliculas([...peliculas, nueva.pelicula]) // asumimos que el backend responde con pelicula
      setMostrarFormularioPelicula(false) // cerrar form
      setPelicula({//limpiamos form
        nombre: '',
        director: '',
        lanzamiento: '',
        genero: '',
        descripcion: '',
        imagen: null
      })


    } catch (error) {
      console.error(error)
    }
  }

  const handlerEliminarPelicula = async (id) =>{
    try {
      const res = await eliminarPelicula(id)
      setPeliculas(prev => prev.filter(pelicula => pelicula.id !== id))
      setNotificacion({tipo: 'exito', mensaje: res.message})
      setTimeout(() => {
        setNotificacion(null)
      }, 5000);
    } catch (error) {
      console.error(error)
      setNotificacion({ tipo: 'error', mensaje: error.response?.data?.error || "Error al eliminar" })
      setTimeout(() => setNotificacion(null), 5000)
    }
  }

  if (!user) {
    return (
      <div>
        <LoginForm
          user={(event) => setUsername(event.target.value)}
          password={(event) => setPassword(event.target.value)}
          handleSubmit={handlerLogin}
        />
      </div>
    )
  }
  return (
    <div>
      <div>
        <p>{user.username} logged in <button onClick={handleLogOut}>logout</button></p>
      </div>
      <div>
        <Notificaciones notificacion={notificacion} />
      </div>
      <button onClick={() => setMostrarFormularioPelicula(!mostrarFormularioPelicula)}>
        {mostrarFormularioPelicula ? 'Cancelar' : 'Crear Película'}
      </button>
      {mostrarFormularioPelicula && (
        <PeliculaForm
          handler={handlerPelicula}
          handlerFile={handleFileChange}
          handleSubmit={handleSubmit}
        />
      )}

      <div>
        <Pelicula peliculas={peliculas} user = {user} eliminarPelicula = {handlerEliminarPelicula}/>
      </div>

    </div>
  )
}

export default App