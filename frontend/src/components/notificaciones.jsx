
const Notificaciones = ({ notificaciones }) => {
  const estiloExito = {
    textAlign: 'center',
    backgroundColor: 'lightgreen',
    color: 'green',
    borderStyle: 'solid',
    borderRadius: '5px',
    borderColor: 'green',
    fontSize: 'large',
    marginBottom: '10px',
    padding: '10px'
  }

  const estiloError = {
    textAlign: 'center',
    backgroundColor: 'pink',
    color: 'red',
    borderStyle: 'solid',
    borderRadius: '5px',
    borderColor: 'red',
    fontSize: 'large',
    marginBottom: '10px',
    padding: '10px'
  }

  if (!notificaciones) return null

  if (Array.isArray(notificaciones)) {
    return (
      <div>
        {notificaciones.map((mensaje, index) => (
          <p key={index} style={estiloError}>
            {mensaje}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div>
      <p style={estiloExito}>{notificaciones}</p>
    </div>
  )
}

export { Notificaciones }

  
