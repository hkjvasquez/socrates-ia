
const prisma =
    require("../configuracion/base-datos");

class RepositorioSesiones {

    // Crear sesión de tutoría
    async crear(usuarioId, retoId) {

        return await prisma.sesiones_tutoria.create({
            data: {
                usuario_id: usuarioId,
                reto_id: retoId
            }
        });

    }

    // Obtener sesión con información del reto
    async obtenerPorId(id) {

        return await prisma.sesiones_tutoria.findUnique({
            where: {
                id
            },
            include: {
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

    // Finalizar sesión de tutoría
    async finalizar(id) {

        return await prisma.sesiones_tutoria.updateMany({
            where: {
                id,
                estado: "ACTIVA"
            },
            data: {
                estado: "FINALIZADA",
                fecha_fin: new Date()
            }
        });

    }

}

module.exports =
    new RepositorioSesiones();
