const Notificaciones = ({ notificacion }) => {
  if (!notificacion) return null

  const estilo = {
    color: notificacion.tipo === 'error' ? 'red' : 'green',
    background: '#eee',
    padding: 10,
    marginBottom: 10,
    border: `1px solid ${notificacion.tipo === 'error' ? 'red' : 'green'}`
  }

  const mensaje = Array.isArray(notificacion.mensaje)
    ? notificacion.mensaje.join(', ')
    : notificacion.mensaje

  return (
    <div style={estilo}>
      {mensaje}
    </div>
  )
}

export {Notificaciones}