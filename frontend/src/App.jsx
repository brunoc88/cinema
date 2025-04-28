import { useState } from "react"
import { LoginForm } from "./components/login"
import {loginUser} from "./services/login"

const App = () => {  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 

  const handlerLogin = async(event) =>{
    try {
      event.preventDefault();
      const userX = await loginUser({user:username, password})
      window.localStorage.setItem('loggerBlogAppUser', JSON.stringify(userX));
    } catch (error) {
      console.log(error)
    }
  } 

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

export default App