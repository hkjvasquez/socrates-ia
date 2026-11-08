const repositorioSesiones =
    require("../repositorios/repositorio-sesiones");

class ServicioSesiones {

    async crearSesion(
        usuarioId,
        retoId
    ) {

        return await repositorioSesiones.crear(
            usuarioId,
            retoId
        );

    }

    async obtenerSesion(
        sesionId
    ) {

        return await repositorioSesiones
            .obtenerPorId(
                sesionId
            );

    }

}

module.exports =
    new ServicioSesiones();