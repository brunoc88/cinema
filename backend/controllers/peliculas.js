const Pelicula = require('../models/pelicula')

exports.altaPelicula = async (req, res) => {
  try {
    const errores = verificarDatos(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ error: errores });
    }

    const { nombre, director, genero, descripcion, lanzamiento } = req.body;

    const existente = await Pelicula.findOne({ nombre });

    if (existente) {
      return res.status(409).json('Ya existe una película con ese nombre');
    }

    const imagen = req.file ? req.file.path : null

    const nuevaPelicula = {
      nombre,
      director,
      genero,
      descripcion,
      imagen:imagen
    }

    return res.status(201).json({
      Mensaje: 'Película creada con éxito!',
      pelicula: nuevaPelicula
    });
  } catch (error) {
    return res.status(500).json('Error al crear la película');
  }
};

exports.obtenerPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.find({});
    return res.status(200).json(peliculas);
  } catch (error) {
    return res.status(500).json('Error al obtener películas');
  }
};

exports.bajarPelicula = async (req, res) => {
  try {
    const id = req.params.id

    const peliculaEliminada = await Pelicula.findByIdAndDelete(id)
    if (!peliculaEliminada) {
      return res.status(404).json({ error: 'Pelicula no encontrada' })
    }
    
    
    return res.status(200).json({ message: 'Pelicula eliminada con éxito!' })
  } catch (error) {
    return res.status(500).json({ error: 'Hubo un problema', details: error.message })
  }
}



const verificarDatos = (body) => {
  const { nombre, director, genero, descripcion, lanzamiento } = body;

  const errores = [];

  if (!nombre && !director && !genero && !descripcion && !lanzamiento) {
    errores.push('Formulario vacío');
    return errores;
  }

  if (!nombre) errores.push('Falta el nombre!');
  if (!director) errores.push('Falta el director!');
  if (!genero) errores.push('Falta el género!');
  if (!descripcion) errores.push('Falta la descripción!');
  if (!lanzamiento) errores.push('Falta el lanzamiento!');

  return errores;
};


