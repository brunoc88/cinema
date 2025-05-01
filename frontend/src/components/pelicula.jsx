const Pelicula = ({ peliculas, user, eliminarPelicula }) => {

    return (
        <div>
            {peliculas && peliculas.map(p => (
                <li key={p.nombre}>
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
                    <p>Creador: {p.user.userName}</p>
                    <p>Likes: {p.likes}</p>
                    <div>
                        {user.username === p.user.userName && (
                            <button onClick={()=>eliminarPelicula(p.id)}>Eliminar</button>
                        )}
                    </div>
                </li>
            ))}
        </div>
    )
}

export { Pelicula };
