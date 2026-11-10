
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

    observaciones: string | null;
    evaluado_por?: string | null;
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
// RESULTADOS GENERALES DEL DOCENTE
// ==========================================

export interface ResultadoGeneral {

    evaluacion_id: string;
    sesion_tutoria_id: string;

    estudiante_id: string;
    nombres: string;
    apellidos: string;
    correo: string;

    reto_id: string;
    nombre_reto: string;

    fecha_inicio: string;
    fecha_fin: string | null;

    estado: string;

    interpretacion: number | string | null;
    analisis: number | string | null;
    evaluacion: number | string | null;
    inferencia: number | string | null;
    explicacion: number | string | null;
    autorregulacion: number | string | null;

    observaciones: string | null;
    evaluado_por: string | null;

    fecha_evaluacion: string;
}

// ==========================================
// RESPUESTA DE RESULTADOS GENERALES
// ==========================================

export interface RespuestaResultadosGenerales {
    exito: boolean;
    mensaje: string;
    total: number;
    resultados: ResultadoGeneral[];
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
        `/sesiones/${sesionId}/resultado`
    );

    return respuesta.data;
}

// ==========================================
// CONSULTAR TODOS LOS RESULTADOS DEL DOCENTE
// ==========================================

export async function obtenerTodosLosResultados():
    Promise<RespuestaResultadosGenerales> {

    const respuesta = await api.get<RespuestaResultadosGenerales>(
        '/resultado'
    );

    return respuesta.data;
}
