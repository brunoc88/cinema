const Pelicula = ({ peliculas, user, eliminarPelicula, editar, handlerLike }) => {

    return (
        <div>
            {peliculas && peliculas.map(p => (
                <li key={p.nombre} className="tarjeta">
                    <img
                        src={`http://localhost:3000/uploads/${p.imagen}`}
                        alt={p.nombre}
                        width="200"
                    />
                    <h3>Nombre: {p.nombre}</h3>
                    <p>Director: {p.director}</p>
                    <p>Género: {p.genero}</p>
                    <p>Lanzamiento: {p.lanzamiento}</p>
                    <p>Descripción: {p.descripcion}</p>
                    <p>Creador: {p.user.userName?p.user.userName:'Usuario eliminado'}</p>
                    <p>Likes: {p.likes} <button onClick={()=>{handlerLike(p.id)}}>Like!</button></p>
                    <button  className="editar" onClick={()=>editar(p.id)}>Editar</button>
                    <div>
                        {user.username === p.user.userName && (
                            <button className="eliminar" onClick={()=>eliminarPelicula(p.id)}>Eliminar</button>
                        )}
                    </div>
                </li>
            ))}
        </div>
    )
}

export { Pelicula };
