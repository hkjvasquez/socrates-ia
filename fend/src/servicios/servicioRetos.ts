
import api from './api';

export interface Reto {
    id: string;
    titulo: string;
    descripcion: string;
    dificultad: string;
}

export async function listarRetosPorTema(temaId: string) {

    const response = await api.get(
        `/retos/tema/${temaId}`
    );

    return response.data;

}

export async function obtenerRetoPorId(id: string) {

    const response = await api.get(
        `/retos/${id}`
    );

    return response.data;

}
