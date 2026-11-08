const prisma =
    require("../configuracion/base-datos");

class RepositorioSesiones {

    async crear(
        usuarioId,
        retoId
    ) {

        return await prisma.sesiones_tutoria.create({
            data: {
                usuario_id: usuarioId,
                reto_id: retoId
            }
        });

    }

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
}

module.exports =
    new RepositorioSesiones();