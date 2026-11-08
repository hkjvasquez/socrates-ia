const servicioIA =
    require("./servicio-ia");

const servicioPrompts =
    require("./servicio-prompts");

const servicioMensajes =
    require("./servicio-mensajes");

const servicioSesiones =
    require("./servicio-sesiones");

const {
    construirPrompt
} = require("../ia/constructor-prompts");

class ServicioTutoria {

    async preguntar(datos) {

        const promptBD =
            await servicioPrompts
                .obtenerPromptTutor();

        console.log(
            "Prompt obtenido desde BD:",
            promptBD.codigo
        );

        let historial = [];

        if (datos.sesionId) {

            historial =
                await servicioMensajes
                    .obtenerHistorial(
                        datos.sesionId
                    );

        }

        const sesion =
            await servicioSesiones
                .obtenerSesion(
                    datos.sesionId
                );

        const datosPrompt = {

            materia:
                sesion.retos.temas.materias.nombre,

            tema:
                sesion.retos.temas.nombre,

            reto:
                sesion.retos.descripcion,

            mensaje:
                datos.mensaje

        };

        const prompt =
            construirPrompt(
                promptBD.prompt_sistema,
                historial,
                datosPrompt
            );

        console.log("Historial:");
        console.log(historial);

        if (datos.sesionId) {

            await servicioMensajes
                .guardarMensaje(
                    datos.sesionId,
                    "ESTUDIANTE",
                    datos.mensaje
                );

        }

        const respuesta =
            await servicioIA
                .generarRespuesta(prompt);

        if (datos.sesionId) {

            await servicioMensajes
                .guardarMensaje(
                    datos.sesionId,
                    "IA",
                    respuesta
                );

        }

        return respuesta;

    }

}

module.exports =
    new ServicioTutoria();