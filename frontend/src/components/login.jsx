const LoginForm = ({user, password, handleSubmit}) => {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            Usuario:
            <input
              type="text"
              name="user" 
              onChange={user}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              name="password"
              onChange={password}
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    )
  }
  
  export { LoginForm }