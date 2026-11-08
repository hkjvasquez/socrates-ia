const repositorioPrompts =
    require("../repositorios/repositorio-prompts");

class ServicioPrompts {

    async obtenerPromptTutor() {

        const prompt =
            await repositorioPrompts
                .obtenerPromptActivo();

        if (!prompt) {

            throw new Error(
                "No existe un prompt activo."
            );

        }

        return prompt;

    }

}

module.exports =
    new ServicioPrompts();