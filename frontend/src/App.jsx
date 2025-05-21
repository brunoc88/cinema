import { useState, useEffect } from "react"
import { LoginForm } from "./components/Login"
import { Pelicula } from "./components/Pelicula"
import { PeliculaForm } from "./components/PeliculaForm"
import { UserForm } from "./components/userForm"
import { Notificaciones } from "./components/Notificaciones"
import { loginUser } from "./services/login"
import { Perfil } from "./components/Profile"
import { setToken, getPeliculas, postearPelicula, eliminarPelicula, obtenerPelicula, editarPelicula, darLike } from "./services/peliculas"
import { crearUsuario, setTokenUser, eliminarCuenta, misDatos, editarMyUser, misPost } from "./services/user"
import { set } from "mongoose"

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
  const [modoEdicion, setModoEdicion] = useState(false)
  const [userForm, setUserForm] = useState({ userName: '', email: '', password: '' })
  const [registrarse, setRegistrarse] = useState(false)
  const [verPerfil, setVerPerfil] = useState(false)
  const [editarUser, setEditarUsuario] = useState(false)
  const [filter, setFilter] = useState('')
  const [peliculasFilter, setPeliculasFilter] = useState(null)
  const [verMisPost, setVerMisPost] = useState(null)
  const [misPeliculas, setMisPeliculas] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerCinemaAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
      setTokenUser(user.token)
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
      if (user && user.error) {
        setNotificacion({ tipo: 'error', mensaje: user.error })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000)
      }
      if (user && !user.error) {
        window.localStorage.setItem('loggerCinemaAppUser', JSON.stringify(user))
        setUser(user)
        setToken(user.token)
        setNotificacion({ tipo: '', mensaje: `Bienvenido ${username}` })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000)
        setUsername('')
        setPassword('')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleLogOut = () => {
    setUser(null)
    setToken(null)
    //cerramos todo lo que dejamos abierto
    setModoEdicion(false)
    setMostrarFormularioPelicula(false)
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

    if (nueva && nueva.error) {
      setNotificacion({ tipo: 'error', mensaje: nueva.error })
      setTimeout(() => setNotificacion(null), 5000)
      return
    }

    setNotificacion({ tipo: 'exito', mensaje: nueva.Mensaje })
    setTimeout(() => setNotificacion(null), 5000)

    // recargar películas con usuario poblado
    const peliculasActualizadas = await getPeliculas()
    setPeliculas(peliculasActualizadas.sort((a,b) => b.nombre.localeCompare(a.nombre)))

    setMostrarFormularioPelicula(false)
    setPelicula({
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


  const handlerEliminarPelicula = async (id) => {
    try {
      const confirmar = confirm("¿Estás seguro de querer eliminar esta pelicula?")
      if (confirmar) {
        const res = await eliminarPelicula(id)
        if (res && res.message) {
          setPeliculas(prev => prev.filter(pelicula => pelicula.id !== id))
          setNotificacion({ tipo: 'exito', mensaje: res.message })
          setTimeout(() => {
            setNotificacion(null)
          }, 5000)
        }
        if (res && res.error) {
          setNotificacion({ tipo: 'error', mensaje: error.response?.data?.error || "Error al eliminar" })
          setTimeout(() => setNotificacion(null), 5000)
        }
      }

    } catch (error) {
      console.error(error)
    }
  }

  const handlerObtenerPelicula = async (id) => {
    try {
      const pelicula = await obtenerPelicula(id)
      setPelicula(pelicula)
      setModoEdicion(true)
      setMostrarFormularioPelicula(true)
    } catch (error) {
      setNotificacion({ tipo: 'error', mensaje: error.response?.data?.error })
      setTimeout(() => {
        setNotificacion(null)
      }, 5000);
    }
  }

  const handleEditarSubmit = async (event) => {
    try {
      event.preventDefault()
      const formData = new FormData()
      formData.append('nombre', pelicula.nombre)
      formData.append('director', pelicula.director)
      formData.append('genero', pelicula.genero)
      formData.append('descripcion', pelicula.descripcion)
      formData.append('lanzamiento', pelicula.lanzamiento)
      formData.append('imagen', pelicula.imagen)

      const respuesta = await editarPelicula(pelicula.id, formData)

      if (respuesta && respuesta.error) {
        setNotificacion({ tipo: 'error', mensaje: respuesta.error })
        setTimeout(() => setNotificacion(null), 5000)
        return
      }

      setNotificacion({ tipo: 'exito', mensaje: respuesta.Mensaje })
      setTimeout(() => setNotificacion(null), 5000)

      // actualizar la lista sin tener que hacer otro GET
      setPeliculas(prev =>
        prev.map(p => (p.id === pelicula.id ? respuesta.pelicula : p))
      )

      // reset
      setMostrarFormularioPelicula(false)
      setModoEdicion(false)
      setPelicula({
        nombre: '',
        director: '',
        lanzamiento: '',
        genero: '',
        descripcion: '',
        imagen: null
      })

      setNotificacion({ tipo: 'exito', mensaje: respuesta.message })
      setTimeout(() => {
        setNotificacion(null)
      }, 5000);
    } catch (error) {
      console.error(error)
    }
  }

  //handlers de usuario

  const handlerUsuario = (event) => {
    const { name, value } = event.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(userForm)
  }


  const handlerSubmitUser = async (event) => {
    try {
      event.preventDefault()
      const res = await crearUsuario(userForm)
      if (res && res.error) {
        setNotificacion({ tipo: 'error', mensaje: res.error })
        console.log("ERROR:", error)
        setTimeout(() => {
          setNotificacion(null)
        }, 5000)
      }
      setUser(res.user)
      setNotificacion({ tipo: 'exito', mensaje: res.message })
      setRegistrarse({
        userName: '',
        email: '',
        password: ''
      })
      setTimeout(() => {
        setNotificacion(null)
      }, 5000);
    } catch (error) {
      console.log(error)
    }
  }

  const handlerEliminarCuenta = async (id) => {
    try {
      const confirmar = confirm("¿Estás seguro de que querés eliminar este usuario?")
      if (confirmar) {
        const res = await eliminarCuenta(id)
        if (res && res.exito) {
          handleLogOut()
          setNotificacion({ tipo: '', mensaje: res.exito })
          setTimeout(() => {
            setNotificacion(null)
          }, 5000)
        }
        if (res && res.error) {
          setNotificacion({ tipo: 'error', mensaje: res.error })
          setTimeout(() => {
            setNotificacion(null)
          }, 5000)
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handlerObtenerDatosUser = async (id) => {
    try {
      const res = await misDatos(id)
      if (res && res.error) {
        setNotificacion({ tipo: 'error', mensaje: res.error })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000);
      }

      if (res && !res.error) {
        setUserForm(res.perfil)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerEditarUsuario = async (event) => {
    try {
      event.preventDefault()
      const res = await editarMyUser(user.id, userForm)
      console.log("respues", res)
      if (res && res.exito) {
        setNotificacion({ tipo: 'exito', mensaje: res.exito })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000);
        handleLogOut()
      }
      else {
        setNotificacion({ tipo: 'error', mensaje: res ? res : 'se produjo un error' })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerLike = async (id) => {
    try {
      const res = await darLike(id)

      if (res && res.message && typeof res.likes === 'number') {
        setPeliculas(prev =>
          prev.map(p => (p.id === id ? { ...p, likes: res.likes } : p))
        )
        setNotificacion({ tipo: '', mensaje: res.message })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000)
      }

      if (res && res.error) {
        setNotificacion({ tipo: 'error', mensaje: res.error })
        setTimeout(() => {
          setNotificacion(null)
        }, 5000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerFilter = (event) => {
    const value = event.target.value
    setFilter(value)
    setPeliculasFilter(
      peliculas.filter(p => p.nombre.toLowerCase().includes(value.toLowerCase().trim()))
    )
    console.log("FILTRADAS",peliculasFilter)
  }

  const handlerMyPosts = async(id) =>{
    try {
      const res = await misPost(id)
      setMisPeliculas(res.peliculas)
      if(res && res.error){
        setNotificacion({tipo: 'error', mensaje: res.error})
        setTimeout(() => {
          setNotificacion(null)
        }, 5000);
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) {
    return (
      <div>
        <div>
          <Notificaciones notificacion={notificacion} />
        </div>
        <div>
          {!registrarse ? (
            <LoginForm
              user={(event) => setUsername(event.target.value)}
              password={(event) => setPassword(event.target.value)}
              handleSubmit={handlerLogin}
            />
          ) : (
            <UserForm
              handlerUsuario={handlerUsuario}
              handlerSubmit={handlerSubmitUser}
              setRegistrarse={setRegistrarse}
              user={userForm}
            />
          )}
        </div>
        <div>
          {!registrarse && (
            <button onClick={() => setRegistrarse(true)}>Registrarse</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="nav">{user.username}! logged in <button onClick={handleLogOut}>logout</button></p>
      </div>
      <div>
        <Notificaciones notificacion={notificacion} />
      </div>
      <div>
        <input
          type="text"
          value={filter}
          onChange={handlerFilter}
          placeholder="Buscar película por nombre"
        />

      </div>
      <div>
        <button onClick={() => {
          if (!mostrarFormularioPelicula) {
            // Si voy a mostrar el formulario, aseguro de limpiar el estado
            setPelicula({
              nombre: '',
              director: '',
              lanzamiento: '',
              genero: '',
              descripcion: '',
              imagen: null
            })
            setModoEdicion(false)
          }
          setMostrarFormularioPelicula(!mostrarFormularioPelicula)
        }}>
          {mostrarFormularioPelicula ? 'Cancelar' : 'Crear Película'}
        </button>

        {mostrarFormularioPelicula && (
          <PeliculaForm
            handler={handlerPelicula}
            handlerFile={handleFileChange}
            handleSubmit={modoEdicion ? handleEditarSubmit : handleSubmit}
            pelicula={pelicula}
          />
        )}
      </div>
      <div>
        {!mostrarFormularioPelicula && (
          <button onClick={() => {
            setVerPerfil(!verPerfil)
          }}>
            {verPerfil ? 'Volver' : 'Mi perfil'}
          </button>
        )}

        {verPerfil && !mostrarFormularioPelicula && (
          <Perfil perfil={user} eliminarCuenta={handlerEliminarCuenta} editar={setEditarUsuario} obtenerUser={handlerObtenerDatosUser} misPost = {handlerMyPosts} verMisPost = {setVerMisPost}/>
        )}
      </div>
      <div>
        {verPerfil && editarUser ? <UserForm handlerUsuario={handlerUsuario} user={userForm} setRegistrarse={setRegistrarse} handleEditarSubmit={handlerEditarUsuario} editarUser={editarUser} setEditarUsuario = {setEditarUsuario}/> : ''}
      </div>
      <div>
        {!verPerfil && !mostrarFormularioPelicula ? (
          <Pelicula
            peliculas={peliculasFilter? peliculasFilter : peliculas}
            user={user}
            eliminarPelicula={handlerEliminarPelicula}
            editar={handlerObtenerPelicula}
            handlerLike={handlerLike}
          />
        ) : (
          ''
        )}
      </div>
      <div>
        {verPerfil && verMisPost?(<Pelicula
            peliculas={misPeliculas}
            user={user}
            eliminarPelicula={handlerEliminarPelicula}
            editar={handlerObtenerPelicula}
            handlerLike={handlerLike}
          />):('')}
      </div>
    </div>
  )
}

export default App