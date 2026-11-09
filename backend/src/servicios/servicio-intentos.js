
const repositorioIntentos =
    require("../repositorios/repositorio-intentos");


class ServicioIntentos {

    // ==========================================
    // CREAR UN INTENTO NUEVO
    // ==========================================

    async crearIntento(
        usuarioId,
        retoId
    ) {

        return await repositorioIntentos.crear(
            usuarioId,
            retoId
        );

    }


    // ==========================================
    // INICIAR O RECUPERAR UN INTENTO
    // ==========================================

    async iniciarIntento(
        usuarioId,
        retoId
    ) {

        const intentoExistente =
            await repositorioIntentos.obtenerEnProceso(
                usuarioId,
                retoId
            );

        if (intentoExistente) {
            return intentoExistente;
        }

        return await this.crearIntento(
            usuarioId,
            retoId
        );

    }


    // ==========================================
    // OBTENER INTENTO POR IDENTIFICADOR
    // ==========================================

    async obtenerPorId(id) {

        return await repositorioIntentos.obtenerPorId(
            id
        );

    }


    // ==========================================
    // VALIDAR INTENTO, ESTUDIANTE Y RETO
    // ==========================================

    async validarIntento(
        intentoId,
        usuarioId,
        retoId
    ) {

        return await repositorioIntentos.obtenerPorIdUsuarioReto(
            intentoId,
            usuarioId,
            retoId
        );

    }


    // ==========================================
    // CONSULTAR INTENTO EN PROCESO
    // ==========================================

    async obtenerEnProceso(
        usuarioId,
        retoId
    ) {

        return await repositorioIntentos.obtenerEnProceso(
            usuarioId,
            retoId
        );

    }


    // ==========================================
    // BUSCAR INTENTO POR SESIÓN
    // MÉTODO PROVISIONAL
    // ==========================================

    async obtenerPorSesion(
        usuarioId,
        retoId,
        fechaInicio
    ) {

        return await repositorioIntentos.obtenerPorSesion(
            usuarioId,
            retoId,
            fechaInicio
        );

    }


    // ==========================================
    // REGISTRAR UNA INTERACCIÓN
    // ==========================================

    async registrarInteraccion(
        intentoId
    ) {

        return await repositorioIntentos.incrementarInteracciones(
            intentoId
        );

    }


    // ==========================================
    // FINALIZAR INTENTO
    // ==========================================

    async finalizarIntento(
        intentoId,
        calificacion
    ) {

        return await repositorioIntentos.finalizar(
            intentoId,
            calificacion
        );

    }

}


module.exports =
    new ServicioIntentos();
