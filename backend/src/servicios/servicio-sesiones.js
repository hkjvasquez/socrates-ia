
const repositorioSesiones =
    require("../repositorios/repositorio-sesiones");

const servicioIntentos =
    require("./servicio-intentos");

class ServicioSesiones {

    // Crear sesión de tutoría y un intento nuevo
    async crearSesion(
        usuarioId,
        retoId
    ) {

        // Crear un intento independiente
        const intento =
            await servicioIntentos.crearIntento(
                usuarioId,
                retoId
            );

        // Crear la sesión de tutoría
        const sesion =
            await repositorioSesiones.crear(
                usuarioId,
                retoId
            );

        return {
            ...sesion,
            intentoId: intento.id
        };

    }

    // Obtener sesión de tutoría
    async obtenerSesion(
        sesionId
    ) {

        return await repositorioSesiones.obtenerPorId(
            sesionId
        );

    }

    // Finalizar sesión de tutoría
    async finalizarSesion(
        sesionId
    ) {

        const resultado =
            await repositorioSesiones.finalizar(
                sesionId
            );

        if (resultado.count === 0) {

            throw new Error(
                "La sesión ya fue finalizada o no se encuentra activa."
            );

        }

        return resultado;

    }

}

module.exports =
    new ServicioSesiones();
