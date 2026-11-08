
import api from './api';

export interface Materia {
    id: string;
    nombre: string;
    descripcion?: string;
}

export async function listarMaterias() {

    const response = await api.get('/materias');

    return response.data;

}

export async function listarTemas(materiaId: string) {

    const response = await api.get(
        `/materias/${materiaId}/temas`
    );

    return response.data;

}
