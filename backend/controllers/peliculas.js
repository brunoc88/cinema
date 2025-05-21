const Pelicula = require('../models/pelicula')
const Usuario = require('../models/user')

exports.altaPelicula = async (req, res) => {
  try {
    const errores = verificarDatos(req.body)

    if (errores.length > 0) {
      return res.status(400).json({ error: errores })
    }

    const {
      nombre, director, genero, descripcion, lanzamiento
    } = req.body

    const existente = await Pelicula.findOne({ nombre })

    if (existente) {
      return res.status(409).json({ error: 'Ya existe una película con ese nombre' })
    }


    const nuevaPelicula = new Pelicula({
      nombre,
      director,
      genero,
      descripcion,
      imagen: req.file ? req.file.filename : 'default.png',
      lanzamiento,
      likes: 0,
      user: req.user._id
    })

    await nuevaPelicula.save()

    // Popula el usuario antes de devolver la película
    await Pelicula.findById(nuevaPelicula._id).populate('user')
    req.user.peliculas = req.user.peliculas.concat(nuevaPelicula._id)
    await req.user.save()

    return res.status(201).json({
      Mensaje: 'Película creada con éxito!',
      pelicula: nuevaPelicula
    })
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear la película', details: error.message })
  }
}

exports.obtenerPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.find({}).populate('user', { userName: 1, email: 1 })
    return res.status(200).json(peliculas)
  } catch (error) {
    return res.status(500).json('Error al obtener películas')
  }
}

exports.bajarPelicula = async (req, res) => {
  try {
    const { id } = req.params

    const pelicula = await Pelicula.findById(id)

    if (!pelicula) {
      return res.status(404).json({ error: 'Pelicula no encontrada' })
    }

    if (pelicula.user.toString() !== req.user.id) {
      return res.status(401).json({
        error: 'No tienes autorizacion!',
        details: 'Solo el creador puede borrar su posteo!'
      })
    }

    const peliculaEliminada = await Pelicula.findByIdAndDelete(id)

    if (!peliculaEliminada) {
      return res.status(404).json({ error: 'Pelicula no encontrada' })
    }

    //para eliminar los id de pelicuas en el array del usuario
    await Usuario.updateMany(
      { peliculas: id },
      { $pull: { peliculas: id } }
    )
    return res.status(200).json({ message: 'Pelicula eliminada con éxito!' })
  } catch (error) {
    return res.status(500).json({ error: 'Hubo un problema', details: error.message })
  }
}

exports.editarPelicula = async (req, res) => {
  try {
    const { id } = req.params

    const pelicula = await Pelicula.findById(id)

    if (!pelicula) {
      return res.status(404).json({ error: 'Película no encontrada' })
    }

    const cambios = verificarCambios(req.body, pelicula)

    if (cambios) {
      return res.status(400).json({ error: cambios })
    }

    const errores = verificarDatos(req.body)

    if (errores.length > 0) {
      return res.status(400).json({ error: errores })
    }

    // Verificar si ya existe una película con el nombre proporcionado
    const peliculaExistente = await Pelicula.findOne({ nombre: req.body.nombre })

    if (pelicula.nombre !== req.body.nombre) {
      if (peliculaExistente) {
        return res.status(409).json({ error: 'Ya existe una pelicula con ese nombre!' })
      }
    }

    const imagen = req.file ? req.file.path : pelicula.imagen || 'default.png'

    const peliculaEdita = {
      nombre: req.body.nombre,
      director: req.body.director,
      genero: req.body.genero,
      lanzamiento: req.body.lanzamiento,
      descripcion: req.body.descripcion,
      imagen
    }

    const guardarPeliculaEditada = await Pelicula.findByIdAndUpdate(id, peliculaEdita, { new: true, runValidators: true })
    return res.status(200).json({ message: 'Pelicula modificada!', pelicula: guardarPeliculaEditada })
  } catch (error) {
    return res.status(500).json({ error: 'Error al editar película', details: error.message })
  }
}

exports.darLike = async (req, res) => {
  try {
    const { id } = req.params
    const pelicula = await Pelicula.findById(id)
    if (!pelicula) {
      return res.status(404).json({ error: 'Película no encontrada' })
    }

    pelicula.likes += 1
    await pelicula.save()

    return res.status(200).json({ message: 'Like agregado!', likes: pelicula.likes })
  } catch (error) {
    return res.status(500).json({ error: 'Error al dar like', details: error.message })
  }
}

exports.encontrarPelicula = async (req, res) => {
  try {
    const id = req.params.id

    const pelicula = await Pelicula.findById(id)

    if (!pelicula) {
      return res.status(404).json({ error: 'No se encontro la pelicula!' })
    }

    return res.status(200).json(pelicula)
  } catch (error) {
    return res.status(500).json({ error: 'Hubo un error al obtener pelicula', details: error.message })
  }
}

const verificarDatos = (body) => {
  const {
    nombre, director, genero, descripcion, lanzamiento
  } = body

  const errores = []

  if (!nombre && !director && !genero && !descripcion && !lanzamiento) {
    errores.push('Formulario vacío')
    return errores
  }

  if (!nombre) errores.push('Falta el nombre!')
  if (!director) errores.push('Falta el director!')
  if (!genero) errores.push('Falta el género!')
  if (!descripcion) errores.push('Falta la descripción!')
  if (!lanzamiento) errores.push('Falta el lanzamiento!')

  return errores
}

const verificarCambios = (body, pelicula) => {
  const {
    nombre, director, genero, descripcion, lanzamiento
  } = body

  if (
    nombre === pelicula.nombre
    && director === pelicula.director
    && genero === pelicula.genero
    && descripcion === pelicula.descripcion
    && lanzamiento === pelicula.lanzamiento
  ) {
    return 'No hubo cambios!'
  }
  return null // Si hubo cambios, devuelve null o undefined
}
