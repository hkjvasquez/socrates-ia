
const prisma =
    require("../configuracion/base-datos");


class RepositorioIntentos {

    // ==========================================
    // CREAR UN NUEVO INTENTO
    // ==========================================

    async crear(usuarioId, retoId) {

        return await prisma.intentos_reto.create({

            data: {
                usuario_id: usuarioId,
                reto_id: retoId,
                estado: "EN_PROCESO",
                completado: false
            }

        });

    }


    // ==========================================
    // OBTENER INTENTO POR IDENTIFICADOR
    // ==========================================

    async obtenerPorId(id) {

        return await prisma.intentos_reto.findUnique({

            where: {
                id
            }

        });

    }


    // ==========================================
    // VALIDAR INTENTO DE UN ESTUDIANTE
    // ==========================================

    async obtenerPorIdUsuarioReto(
        id,
        usuarioId,
        retoId
    ) {

        return await prisma.intentos_reto.findFirst({

            where: {
                id,
                usuario_id: usuarioId,
                reto_id: retoId,
                estado: "EN_PROCESO",
                completado: false
            }

        });

    }


    // ==========================================
    // BUSCAR INTENTO EN PROCESO
    // ==========================================

    async obtenerEnProceso(
        usuarioId,
        retoId
    ) {

        return await prisma.intentos_reto.findFirst({

            where: {
                usuario_id: usuarioId,
                reto_id: retoId,
                estado: "EN_PROCESO",
                completado: false
            },

            orderBy: {
                fecha_inicio: "desc"
            }

        });

    }


    // ==========================================
    // BUSCAR INTENTO POR FECHA DE SESIÓN
    // MÉTODO PROVISIONAL
    // ==========================================

    async obtenerPorSesion(
        usuarioId,
        retoId,
        fechaInicio
    ) {

        return await prisma.intentos_reto.findFirst({

            where: {
                usuario_id: usuarioId,
                reto_id: retoId,
                estado: "EN_PROCESO",
                completado: false,

                fecha_inicio: {
                    lte: fechaInicio
                }
            },

            orderBy: {
                fecha_inicio: "desc"
            }

        });

    }


    // ==========================================
    // INCREMENTAR INTERACCIONES
    // ==========================================

    async incrementarInteracciones(id) {

        return await prisma.intentos_reto.update({

            where: {
                id
            },

            data: {
                cantidad_interacciones: {
                    increment: 1
                }
            }

        });

    }


    // ==========================================
    // FINALIZAR INTENTO
    // ==========================================

    async finalizar(
        id,
        calificacion
    ) {

        return await prisma.intentos_reto.updateMany({

            where: {
                id,
                estado: "EN_PROCESO",
                completado: false
            },

            data: {
                estado: "COMPLETADO",
                completado: true,
                fecha_fin: new Date(),
                calificacion
            }

        });

    }

}


module.exports =
    new RepositorioIntentos();
