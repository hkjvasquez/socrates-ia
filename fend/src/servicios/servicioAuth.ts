
import api from './api';

export interface LoginRequest {
    correo: string;
    contrasena: string;
}

export interface UsuarioAutenticado {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
}

export interface LoginResponse {
    exito: boolean;
    mensaje: string;
    usuario: UsuarioAutenticado;
    token: string;
}

export async function iniciarSesion(
    datos: LoginRequest
): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>(
        '/auth/login',
        datos
    );

    return response.data;
}
