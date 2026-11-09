
import api from "./api";

export interface SesionCreada {
    id: string;
    usuario_id: string;
    reto_id: string;
    intentoId: string;
}

export interface RespuestaCrearSesion {
    exito: boolean;
    mensaje: string;
    sesionId: string;
    intentoId: string;
    sesion: SesionCreada;
}

export interface EvaluacionFacione {
    interpretacion: number;
    analisis: number;
    evaluacion: number;
    inferencia: number;
    explicacion: number;
    autorregulacion: number;
    observaciones: string;
}

export interface RespuestaFinalizarSesion {
    exito: boolean;
    mensaje: string;
    sesionId: string;
    intentoId: string;
    evaluacion: EvaluacionFacione;
}

export async function crearSesion(
    retoId: string
): Promise<RespuestaCrearSesion> {

    const response = await api.post<RespuestaCrearSesion>(
        "/sesiones",
        { retoId }
    );

    return response.data;
}

export async function finalizarSesion(
    sesionId: string
): Promise<RespuestaFinalizarSesion> {

    const response = await api.post<RespuestaFinalizarSesion>(
        "/sesiones/finalizar",
        { sesionId }
    );

    return response.data;
}
