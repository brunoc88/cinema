const PeliculaForm = ({handler, handlerFile, handleSubmit}) =>{
    return(
        <div>
            <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                <div>
                    Nombre:
                    <input type="text" name = "nombre" onChange={handler}/>
                </div> 
                <div>
                    Director:
                    <input type="text" name = "director" onChange={handler}/>
                </div>
                <div>
                    Genero:
                    <select name="genero" onChange={handler}>
                        <option>--Seleccione--</option>
                        <option value="Accion">Accion</option>
                        <option value="Terror">Terror</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Romantica">Romantica</option>
                    </select>
                </div>
                <div>
                    Descripcion:
                    <textarea name="descripcion" onChange={handler} rows="4" cols="40" />
                </div>
                <div>
                    Lanzamiento:
                    <input type="numer" name="lanzamiento" onChange={handler}/>
                </div>
                <div>
                    Imagen:
                    <input type="file" name="imagen" onChange={handlerFile}/>
                </div>
                <div>
                    <button type="submit">Guardar Película</button>
                </div>
            </form>
        </div>
    )
}

export {PeliculaForm}