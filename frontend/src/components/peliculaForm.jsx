const PeliculaForm = ({ handler, handlerFile, handleSubmit, pelicula, editar = false }) => {
    return (
        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div>
                Nombre:
                <input type="text" name="nombre" onChange={handler} value={pelicula.nombre} />
            </div>
            <div>
                Director:
                <input type="text" name="director" onChange={handler} value={pelicula.director} />
            </div>
            <div>
                Genero:
                <select name="genero" onChange={handler} value={pelicula.genero}>
                    <option>--Seleccione--</option>
                    <option value="Accion">Accion</option>
                    <option value="Terror">Terror</option>
                    <option value="Comedia">Comedia</option>
                    <option value="Romantica">Romantica</option>
                </select>
            </div>
            <div>
                Descripcion:
                <textarea name="descripcion" onChange={handler} value={pelicula.descripcion} rows="4" cols="40" />
            </div>
            <div>
                Lanzamiento:
                <input type="number" name="lanzamiento" onChange={handler} value={pelicula.lanzamiento} />
            </div>
            <div>
                Imagen:
                <input type="file" name="imagen" onChange={handlerFile} />
            </div>
            <div>
                <button type="submit">{editar ? 'Editar Película' : 'Guardar Película'}</button>
            </div>
        </form>
    )
}

export { PeliculaForm }