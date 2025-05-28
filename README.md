🎬 Cinema
Aplicación de gestión de películas.

📝 Descripción
Esta aplicación permite a los usuarios registrados realizar operaciones CRUD sobre películas. Sin embargo, solo el usuario creador de una película puede eliminarla. Otros usuarios pueden editarla (por ejemplo, darle likes), pero no borrarla.

Los usuarios también pueden:

Ver sus propios posteos.

Editar su información personal se requiere agregar el password como mecanismo de seguridad.

Eliminar su cuenta (lo cual también elimina todas sus películas).

⚙️ Tecnologías utilizadas
Backend (Node.js + Express + MongoDB)
bcrypt: para el hasheo de contraseñas.

cors: para permitir peticiones desde distintos orígenes.

dotenv: manejo de variables de entorno.

jsonwebtoken: generación y validación de tokens JWT para autenticación.

multer: para manejo de imágenes (subida de archivos).

mongoose: ODM para interactuar con MongoDB.

jest + supertest: testing de los endpoints.

cross-env: para compatibilidad entre sistemas operativos al manejar variables de entorno.

Frontend (React)
React con uso de useState, useEffect, y renderizado condicional.

Axios: para realizar peticiones HTTP al backend.

Vitest, jsdom y @testing-library/react: para pruebas básicas de componentes y aprendizaje de testing en React.

👤 Usuario de prueba
Puedes iniciar sesión con las siguientes credenciales:

makefile
Copiar
Editar
Usuario: bruno88  
Email: bruno88@gmail.com  
Contraseña: 123
📌 Notas
Aún se pueden realizar mejoras como refactorizar componentes usando props.children o implementar un sistema de rutas más robusto con React Router.

El sistema de likes es editable por cualquier usuario, mientras que la eliminación está restringida al creador de la película.

