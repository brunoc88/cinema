const Perfil = ({perfil}) => {
    return (
        <div>
            <div>
                <h2>Tu Pefil:</h2>
                <p>UserName: {perfil.userName}</p>
                <p>Email: {perfil.email}</p>
            </div>
            <div>
                <button>Mis publicaciones</button>
                <button>Editar</button>
                <button>Eliminar</button>
            </div>
        </div>
    )
}

export {Perfil}