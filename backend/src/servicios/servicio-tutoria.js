
const servicioIA =
    require("./servicio-ia");

const servicioPrompts =
    require("./servicio-prompts");

const servicioMensajes =
    require("./servicio-mensajes");

const servicioSesiones =
    require("./servicio-sesiones");

const servicioIntentos =
    require("./servicio-intentos");

const {
    construirPrompt
} = require("../ia/constructor-prompts");


class ServicioTutoria {

    async preguntar(datos) {

        // ==========================================
        // 1. VALIDAR DATOS DE ENTRADA
        // ==========================================

        if (
            !datos.sesionId ||
            !datos.intentoId ||
            !datos.usuarioId ||
            !datos.mensaje?.trim()
        ) {

            const error = new Error(
                "La sesión, el intento, el usuario y el mensaje son obligatorios."
            );

            error.statusCode = 400;
            throw error;

        }

        // ==========================================
        // 2. OBTENER SESIÓN
        // ==========================================

        const sesion =
            await servicioSesiones.obtenerSesion(
                datos.sesionId
            );

        if (!sesion) {

            const error = new Error(
                "No se encontró la sesión de tutoría."
            );

            error.statusCode = 404;
            throw error;

        }

        // ==========================================
        // 3. VALIDAR PROPIETARIO DE LA SESIÓN
        // ==========================================

        if (sesion.usuario_id !== datos.usuarioId) {

            const error = new Error(
                "No tienes autorización para utilizar esta sesión."
            );

            error.statusCode = 403;
            throw error;

        }

        // ==========================================
        // 4. VALIDAR ESTADO DE LA SESIÓN
        // ==========================================

        if (sesion.estado !== "ACTIVA") {

            const error = new Error(
                "No se pueden enviar mensajes a una sesión finalizada."
            );

            error.statusCode = 409;
            throw error;

        }

        // ==========================================
        // 5. VALIDAR INTENTO
        // ==========================================

        const intento =
            await servicioIntentos.validarIntento(
                datos.intentoId,
                datos.usuarioId,
                sesion.reto_id
            );

        if (!intento) {

            const error = new Error(
                "El intento no existe, no pertenece al estudiante o ya fue finalizado."
            );

            error.statusCode = 403;
            throw error;

        }

        // ==========================================
        // 6. OBTENER PROMPTS
        // ==========================================

        const promptTutor =
            await servicioPrompts.obtenerPromptTutor();

        const promptEvaluacion =
            await servicioPrompts.obtenerPromptEvaluacion();

        console.log(
            "Prompt del tutor:",
            promptTutor.codigo
        );

        console.log(
            "Prompt de evaluación:",
            promptEvaluacion.codigo
        );

        // ==========================================
        // 7. RECUPERAR HISTORIAL
        // ==========================================

        const historial =
            await servicioMensajes.obtenerHistorial(
                datos.sesionId
            );

        // ==========================================
        // 8. PREPARAR CONTEXTO ACADÉMICO
        // ==========================================

        const datosPrompt = {

            materia:
                sesion.retos.temas.materias.nombre,

            tema:
                sesion.retos.temas.nombre,

            reto:
                sesion.retos.descripcion,

            mensaje:
                datos.mensaje.trim()

        };

        // ==========================================
        // 9. CONSTRUIR CONTEXTO SOCRÁTICO
        // ==========================================

        const contextoTutor =
            construirPrompt(
                promptTutor.prompt_sistema,
                historial,
                datosPrompt
            );

        // ==========================================
        // 10. INTEGRAR INSTRUCCIONES DE EVALUACIÓN
        // ==========================================

        const promptCompleto = `

INSTRUCCIONES DEL TUTOR SOCRÁTICO:

${contextoTutor}


INSTRUCCIONES DE EVALUACIÓN DEL PROGRESO:

${promptEvaluacion.prompt_sistema}

`;

        // ==========================================
        // 11. GENERAR RESPUESTA DE CLAUDE
        // ==========================================

        const resultado =
            await servicioIA.generarRespuestaEstructurada(
                promptCompleto
            );

        // ==========================================
        // 12. GUARDAR MENSAJES
        // ==========================================

        await servicioMensajes.guardarMensaje(
            datos.sesionId,
            "ESTUDIANTE",
            datos.mensaje.trim()
        );

        await servicioMensajes.guardarMensaje(
            datos.sesionId,
            "IA",
            resultado.respuesta
        );

        // ==========================================
        // 13. REGISTRAR INTERACCIÓN
        // ==========================================

        await servicioIntentos.registrarInteraccion(
            intento.id
        );

        // ==========================================
        // 14. DEVOLVER RESPUESTA
        // ==========================================

        return {

            respuesta:
                resultado.respuesta,

            puedeFinalizar:
                resultado.puedeFinalizar,

            evidencias:
                resultado.evidencias,

            dimensionesObservadas:
                resultado.dimensionesObservadas

        };

    }

}


module.exports =
    new ServicioTutoria();
