const repositorioMensajes =
    require("../repositorios/repositorio-mensajes");

class ServicioMensajes {

    async guardarMensaje(
        sesionId,
        remitente,
        contenido
    ) {

        return await repositorioMensajes
            .guardarMensaje(
                sesionId,
                remitente,
                contenido
            );

    }

    async obtenerHistorial(
        sesionId
    ) {

        return await repositorioMensajes
            .obtenerHistorial(
                sesionId
            );

    }

}

module.exports =
    new ServicioMensajes();