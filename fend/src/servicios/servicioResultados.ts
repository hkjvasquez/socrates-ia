
import api from './api';

// ==========================================
// EVALUACIÓN DE LAS SEIS DIMENSIONES
// ==========================================

export interface EvaluacionFacione {
    id?: string;
    sesion_tutoria_id?: string;

    interpretacion: number | string | null;
    analisis: number | string | null;
    evaluacion: number | string | null;
    inferencia: number | string | null;
    explicacion: number | string | null;
    autorregulacion: number | string | null;

    observaciones: string;
    evaluado_por?: string;
}

// ==========================================
// INFORMACIÓN DEL RETO
// ==========================================

export interface RetoResultado {
    id: string;
    titulo: string;
    descripcion?: string | null;
}

// ==========================================
// RESPUESTA DEL BACKEND
// ==========================================

export interface RespuestaResultados {
    exito: boolean;
    mensaje: string;
    sesionId: string;
    reto: RetoResultado;
    evaluacion: EvaluacionFacione;
}

// ==========================================
// CONSULTAR RESULTADOS DE UNA SESIÓN
// ==========================================

export async function obtenerResultados(
    sesionId: string
): Promise<RespuestaResultados> {

    if (!sesionId) {
        throw new Error(
            'No se proporcionó el identificador de la sesión.'
        );
    }

    const respuesta = await api.get<RespuestaResultados>(
        `/sesiones/${sesionId}/resultados`
    );

    return respuesta.data;
}
