const UserForm = ({handlerUsuario, handlerSubmit, user, setRegistrarse, handleEditarSubmit, editarUser, setEditarUsuario}) =>{
    return(
        <div>
            <form onSubmit={!editarUser?handlerSubmit : handleEditarSubmit}>
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
                    <input type="password" name = "password" onChange={handlerUsuario}/>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                    <button onClick={()=>{setRegistrarse(false), setEditarUsuario(false)}}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export {UserForm}