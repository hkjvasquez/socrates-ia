
const servicioIA =
    require("./servicio-ia");

const servicioPrompts =
    require("./servicio-prompts");

const repositorioEvaluacionFacione =
    require("../repositorios/repositorio-evaluacion-facione");

class ServicioEvaluacionFacione {

    async evaluarConversacion(
        historial,
        datosReto
    ) {

        if (
            !Array.isArray(historial) ||
            historial.length === 0
        ) {

            throw new Error(
                "No existe historial suficiente para evaluar la sesión."
            );

        }

        if (
            !datosReto ||
            !datosReto.materia ||
            !datosReto.tema ||
            !datosReto.reto
        ) {

            throw new Error(
                "Los datos del reto están incompletos para realizar la evaluación."
            );

        }

        const configuracionPrompt =
            await servicioPrompts.obtenerPromptFacione();

        const conversacion = historial
            .map((mensaje) => {

                const remitente =
                    mensaje.remitente === "ESTUDIANTE"
                        ? "ESTUDIANTE"
                        : "SOCRATES IA";

                return `${remitente}: ${mensaje.contenido}`;

            })
            .join("\n\n");

        const prompt = `
${configuracionPrompt.prompt_sistema}

CONTEXTO DEL RETO

Materia: ${datosReto.materia}
Tema: ${datosReto.tema}
Reto: ${datosReto.reto}

HISTORIAL COMPLETO DE LA CONVERSACIÓN

${conversacion}
`;

        return await servicioIA.evaluarFacione(prompt);

    }

    // Guardar la evaluación final en PostgreSQL.
    async guardarEvaluacion(
        datos,
        transaccion
    ) {

        return await repositorioEvaluacionFacione.crear(
            datos,
            transaccion
        );

    }

}

module.exports =
    new ServicioEvaluacionFacione();
