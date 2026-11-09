
import api from "./api";

// ==========================================
// TIPOS
// ==========================================

export interface PreguntaTutorRequest {
    sesionId: string;
    intentoId: string;
    mensaje: string;
}

export interface PreguntaTutorResponse {
    exito: boolean;
    respuesta: string;
    puedeFinalizar: boolean;
    evidencias: string[];
    dimensionesObservadas: string[];
    mensaje?: string;
}

// ==========================================
// ENVIAR MENSAJE AL TUTOR SOCRÁTICO
// ==========================================

export async function preguntar(
    datos: PreguntaTutorRequest
): Promise<PreguntaTutorResponse> {

    const response =
        await api.post<PreguntaTutorResponse>(
            "/tutoria/preguntar",
            {
                sesionId: datos.sesionId,
                intentoId: datos.intentoId,
                mensaje: datos.mensaje
            }
        );

    return response.data;
}
