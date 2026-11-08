
const Anthropic = require("@anthropic-ai/sdk");

class ServicioIA {

    constructor() {
        this.cliente = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }

    async generarRespuesta(prompt) {

        try {

            const respuesta = await this.cliente.messages.create({
                model: process.env.MODELO_CLAUDE,
                max_tokens: 2048,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });

            return respuesta.content
                .filter(bloque => bloque.type === "text")
                .map(bloque => bloque.text)
                .join("\n");

        }
        catch (error) {

            console.error(
                "Error al conectar con Anthropic:",
                error
            );

            throw error;
        }
    }

}

module.exports = new ServicioIA();
