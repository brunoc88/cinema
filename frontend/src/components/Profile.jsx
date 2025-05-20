const Perfil = ({perfil, eliminarCuenta, editar, obtenerUser, misPost, verMisPost}) => {
    return (
        <div>
            <div>
                <h2>Tu Pefil:</h2>
                <p>UserName: {perfil.username}</p>
                <p>Email: {perfil.email}</p>
            </div>
            <div>
                <button onClick={()=>{verMisPost(true),misPost(perfil.id)}}>Mis publicaciones</button>
                <button onClick={()=>{editar(true), obtenerUser(perfil.id)}}>Editar</button>
                <button onClick={()=>{eliminarCuenta(perfil.id)}}>Eliminar Cuenta</button>
            </div>
        </div>
    )
}

export {Perfil}