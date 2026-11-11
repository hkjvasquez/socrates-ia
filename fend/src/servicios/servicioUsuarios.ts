
import api from './api';

export interface CrearEstudianteRequest {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
}

export interface EstudianteCreado {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    activo: boolean;
    fecha_creacion: string;
    roles: {
        nombre: string;
    };
}

export interface CrearEstudianteResponse {
    exito: boolean;
    mensaje: string;
    usuario: EstudianteCreado;
}

export async function crearEstudiante(
    datos: CrearEstudianteRequest
): Promise<CrearEstudianteResponse> {

    const response = await api.post<CrearEstudianteResponse>(
        '/usuarios',
        datos
    );

    return response.data;
}
