const PeliculaForm = ({handler, handlerFile, handleSubmit}) =>{
    return(
        <div>
            <form onSubmit={handleSubmit} method="post" enctype="multipart/form-data">
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
                        <option value="Accion">Accion</option>
                        <option value="Terror">Terror</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Romantica">Romantica</option>
                    </select>
                </div>
                <div>
                    Descripcion:
                    <input type="text" name = "descripcion" onChange={handler}/>
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