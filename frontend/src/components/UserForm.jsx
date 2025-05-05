const UserForm = ({handlerUsuario, handlerSubmit, user, setRegistrarse}) =>{
    return(
        <div>
            <form onSubmit={handlerSubmit} method="post">
                <div>
                    Nombre de usuario:
                    <input type="text" name = "userName" onChange={handlerUsuario} value={user? user.userName : ''}/>
                </div>
                <div>
                    Email:
                    <input type="email" name = "email" onChange={handlerUsuario} value={user? user.email : ''}/>
                </div>
                <div>
                    Password:
                    <input type="password" name = "password" onChange={handlerUsuario} value={user? user.password : ''}/>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                    <button onClick={()=>setRegistrarse(false)}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export {UserForm}