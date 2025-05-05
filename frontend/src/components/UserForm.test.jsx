import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UserForm } from './userForm'

describe('Formulario de registro de usuario', () => {
    test('Renderizado de formulario', () => {
        render(<UserForm />)
        screen.debug() // Muestra el HTML renderizado
    })
})