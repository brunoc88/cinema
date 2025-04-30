import { useState, useEffect } from "react"
import { LoginForm } from "./components/login"
import { Pelicula } from "./components/pelicula"
import { PeliculaForm } from "./components/peliculaForm"
import { Notificaciones } from "./components/notificaciones"
import { loginUser } from "./services/login"
import { setToken, getPeliculas, postearPelicula } from "./services/peliculas"


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
  const [error, setError] = useState([])
  const [exito, setExito] = useState({})


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
      console.log("RESPUESTA", nueva)
      if (nueva && nueva.error) {
        setError(nueva.error)
        setTimeout(() => {
          setError([])
        }, 5000)
        return // detener ejecución si hay error
      }
      
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

      /*
      if (nueva.Mensaje || nueva.message) {
        //const msj = nueva.Mensaje || nueva.message
        const msj = 'exito'
        setExito(msj)
        setTimeout(() => {
          setExito('')
        }, 5000)
      }*/

        const msj = 'exito'
        setExito(msj)
        setTimeout(() => {
          setExito('')
        }, 5000)
    } catch (error) {
      console.error(error)
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
        <Notificaciones notificaciones={error?error : exito}/>
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
        <Pelicula peliculas={peliculas} />
      </div>

    </div>
  )
}

export default App