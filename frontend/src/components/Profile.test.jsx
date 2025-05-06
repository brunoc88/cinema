import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Perfil } from './profile'

describe('Vista Perfil', () => {
    test('Mostrar datos del usuario', () =>{
        const perfil = {
            userName: 'bruno88',
            email: 'bruno88@gmail.com'
        }
        render(<Perfil perfil={perfil}/>)
        screen.debug()
    })
})