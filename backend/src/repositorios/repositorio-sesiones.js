const prisma = require("../configuracion/base-datos");

class RepositorioSesiones {

    // ==========================================
    // CREAR SESIÓN DE TUTORÍA
    // ==========================================
    async crear(usuarioId, retoId) {

        return await prisma.sesiones_tutoria.create({
            data: {
                usuario_id: usuarioId,
                reto_id: retoId
            }
        });

    }

    // ==========================================
    // OBTENER SESIÓN POR IDENTIFICADOR
    // ==========================================
    async obtenerPorId(id) {

        return await prisma.sesiones_tutoria.findUnique({

            where: {
                id: id
            },

            include: {

                // Información del estudiante
                usuarios: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        correo: true
                    }
                },

                // Información del reto y su contexto académico
                retos: {
                    include: {
                        temas: {
                            include: {
                                materias: true
                            }
                        }
                    }
                }

            }

        });

    }

    // ==========================================
    // FINALIZAR SESIÓN
    // ==========================================
    async finalizar(id) {

        return await prisma.sesiones_tutoria.updateMany({

            where: {
                id: id,
                estado: "ACTIVA"
            },

            data: {
                estado: "FINALIZADA",
                fecha_fin: new Date()
            }

        });

    }

}

module.exports = new RepositorioSesiones();