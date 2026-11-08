const prisma =
    require("../configuracion/base-datos");

class RepositorioMensajes {

    async guardarMensaje(
        sesionId,
        remitente,
        contenido
    ) {

        return await prisma.mensajes.create({
            data: {
                sesion_tutoria_id: sesionId,
                remitente,
                contenido
            }
        });

    }

    async obtenerHistorial(
        sesionId
    ) {

        return await prisma.mensajes.findMany({
            where: {
                sesion_tutoria_id: sesionId
            },
            orderBy: {
                fecha_creacion: "asc"
            }
        });

    }

}

module.exports =
    new RepositorioMensajes();