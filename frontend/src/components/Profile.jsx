const Perfil = ({perfil, eliminarCuenta}) => {
    return (
        <div>
            <div>
                <h2>Tu Pefil:</h2>
                <p>UserName: {perfil.username}</p>
                <p>Email: {perfil.email}</p>
            </div>
            <div>
                <button>Mis publicaciones</button>
                <button>Editar</button>
                <button onClick={()=>{eliminarCuenta(perfil.id)}}>Eliminar Cuenta</button>
            </div>
        </div>
    )
}

export {Perfil}