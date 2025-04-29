import { useState, useEffect } from "react"
import { LoginForm } from "./components/login"
import {Pelicula} from "./components/pelicula"
import {loginUser} from "./services/login"
import { setToken, getPeliculas } from "./services/peliculas"


const App = () => {  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [peliculas, setPeliculas] = useState([])



  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggerCinemaAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  },[])
  
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
  


  const handlerLogin = async(event) =>{
    try {
      event.preventDefault();
      const user = await loginUser({user:username, password})
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

  if(!user){
    return (
      <div>
        <LoginForm 
        user={(event)=>setUsername(event.target.value)} 
        password = {(event)=>setPassword(event.target.value)}
        handleSubmit = {handlerLogin}
        />
      </div>
    )
  }
  return(
    <div>
      <p>{user.username} logged in <button onClick={handleLogOut}>logout</button></p>
      <Pelicula peliculas={peliculas}/>
    </div>
  )
}

export default App