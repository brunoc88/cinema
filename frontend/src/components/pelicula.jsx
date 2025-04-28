const Pelicula = ({peliculas}) =>{
    return(
        <div>
            <ul>
            {peliculas && peliculas.map(p => {
                <li key={p.nombre}>
                    <h3>Nombre: {p.nombre}</h3>
                    <p>Director: {p.director}</p>
                    <p>Director: {p.genero}</p>
                    <p>Director: {p.lanzamiento}</p>
                    <p>Director: {p.descripcion}</p>
                    <p>Director: {p.likes}</p>
                </li>
            })}
            </ul>
        </div>
    )
} 

export {Pelicula}