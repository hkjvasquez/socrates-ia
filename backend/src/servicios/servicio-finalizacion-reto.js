
const prisma =
    require("../configuracion/base-datos");

const servicioSesiones =
    require("./servicio-sesiones");

const servicioMensajes =
    require("./servicio-mensajes");

const servicioIntentos =
    require("./servicio-intentos");

const servicioEvaluacionFacione =
    require("./servicio-evaluacion-facione");


class ServicioFinalizacionReto {

    async finalizarReto(sesionId, usuarioId) {

        // ==========================================
        // 1. VALIDAR IDENTIFICADORES
        // ==========================================

        if (!sesionId || !usuarioId) {

            const error = new Error(
                "La sesión y el usuario son obligatorios."
            );

            error.statusCode = 400;
            throw error;

        }

        // ==========================================
        // 2. OBTENER Y VALIDAR LA SESIÓN
        // ==========================================

        const sesion =
            await servicioSesiones.obtenerSesion(
                sesionId
            );

        if (!sesion) {

            const error = new Error(
                "No se encontró la sesión de tutoría."
            );

            error.statusCode = 404;
            throw error;

        }

        // Verificar propietario de la sesión
        if (sesion.usuario_id !== usuarioId) {

            const error = new Error(
                "No tienes autorización para finalizar esta sesión."
            );

            error.statusCode = 403;
            throw error;

        }

        // Verificar estado de la sesión
        if (sesion.estado !== "ACTIVA") {

            const error = new Error(
                "La sesión ya fue finalizada."
            );

            error.statusCode = 409;
            throw error;

        }

        // ==========================================
        // 3. OBTENER EL INTENTO CORRESPONDIENTE
        //    A LA FECHA DE INICIO DE LA SESIÓN
        // ==========================================

        const intento =
            await servicioIntentos.obtenerPorSesion(
                usuarioId,
                sesion.reto_id,
                sesion.fecha_inicio
            );

        if (!intento) {

            const error = new Error(
                "No se encontró un intento activo correspondiente a esta sesión."
            );

            error.statusCode = 404;
            throw error;

        }

        // ==========================================
        // 4. RECUPERAR HISTORIAL
        // ==========================================

        const historial =
            await servicioMensajes.obtenerHistorial(
                sesionId
            );

        if (!historial || historial.length === 0) {

            const error = new Error(
                "No existe una conversación para evaluar."
            );

            error.statusCode = 400;
            throw error;

        }

        // ==========================================
        // 5. PREPARAR CONTEXTO ACADÉMICO
        // ==========================================

        const reto = sesion.retos;
        const tema = reto.temas;
        const materia = tema.materias;

        const datosReto = {

            materia: materia.nombre,

            tema: tema.nombre,

            reto: `
                Título: ${reto.titulo}

                Descripción: ${reto.descripcion}

                Contenido: ${reto.contenido || "No especificado"}

                Dificultad: ${reto.dificultad}
            `

        };

        // ==========================================
        // 6. EVALUAR CON CLAUDE
        // ==========================================

        const evaluacion =
            await servicioEvaluacionFacione.evaluarConversacion(
                historial,
                datosReto
            );

        // ==========================================
        // 7. FINALIZAR Y GUARDAR EVALUACIÓN
        //    EN UNA TRANSACCIÓN
        // ==========================================

        const resultado =
            await prisma.$transaction(async (tx) => {

                // Verificar evaluación existente
                const evaluacionExistente =
                    await tx.evaluaciones_facione.findFirst({
                        where: {
                            sesion_tutoria_id: sesionId
                        }
                    });

                if (evaluacionExistente) {

                    const error = new Error(
                        "Esta sesión ya cuenta con una evaluación."
                    );

                    error.statusCode = 409;
                    throw error;

                }

                // Finalizar sesión
                const sesionFinalizada =
                    await tx.sesiones_tutoria.updateMany({

                        where: {
                            id: sesionId,
                            usuario_id: usuarioId,
                            estado: "ACTIVA"
                        },

                        data: {
                            estado: "FINALIZADA",
                            fecha_fin: new Date()
                        }

                    });

                if (sesionFinalizada.count === 0) {

                    const error = new Error(
                        "La sesión ya fue finalizada o no se encuentra activa."
                    );

                    error.statusCode = 409;
                    throw error;

                }

                // Finalizar intento específico
                const intentoFinalizado =
                    await tx.intentos_reto.updateMany({

                        where: {
                            id: intento.id,
                            usuario_id: usuarioId,
                            reto_id: sesion.reto_id,
                            estado: "EN_PROCESO",
                            completado: false
                        },

                        data: {
                            estado: "COMPLETADO",
                            completado: true,
                            fecha_fin: new Date(),
                            calificacion: null
                        }

                    });

                if (intentoFinalizado.count === 0) {

                    const error = new Error(
                        "El intento ya fue finalizado o no se encuentra activo."
                    );

                    error.statusCode = 409;
                    throw error;

                }

                // Guardar evaluación Facione
                const evaluacionGuardada =
                    await servicioEvaluacionFacione.guardarEvaluacion(
                        {
                            sesionId,
                            ...evaluacion
                        },
                        tx
                    );

                return {

                    sesionId,

                    intentoId: intento.id,

                    evaluacion: evaluacionGuardada

                };

            });

        // ==========================================
        // 8. DEVOLVER RESULTADO
        // ==========================================

        return {

            mensaje: "El reto fue finalizado y evaluado correctamente.",

            ...resultado

        };

    }

}

module.exports =
    new ServicioFinalizacionReto();
