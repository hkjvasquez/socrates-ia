
const repositorioPrompts =
    require("../repositorios/repositorio-prompts");

class ServicioPrompts {

    // Obtener las instrucciones del tutor socrático.
    async obtenerPromptTutor() {

        const prompt =
            await repositorioPrompts.obtenerPromptActivo(
                "SOCRATICO_V1"
            );

        if (!prompt) {

            throw new Error(
                "No existe un prompt socrático activo."
            );

        }

        return prompt;

    }

    // Obtener las instrucciones para evaluar el progreso.
    async obtenerPromptEvaluacion() {

        const prompt =
            await repositorioPrompts.obtenerPromptActivo(
                "EVALUACION_PROGRESO_V1"
            );

        if (!prompt) {

            throw new Error(
                "No existe un prompt de evaluación activo."
            );

        }

        return prompt;

    }

    // Obtener las instrucciones para la evaluación final Facione.
    async obtenerPromptFacione() {

        const prompt =
            await repositorioPrompts.obtenerPromptActivo(
                "EVALUACION_FACIONE_V1"
            );

        if (!prompt) {

            throw new Error(
                "No existe un prompt de evaluación Facione activo."
            );

        }

        return prompt;

    }

}

module.exports =
    new ServicioPrompts();
