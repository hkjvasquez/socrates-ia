
const Anthropic = require("@anthropic-ai/sdk");

class ServicioIA {

    constructor() {

        this.cliente = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

    }

    // Generación de respuesta de texto tradicional
    async generarRespuesta(prompt) {

        try {

            const respuesta =
                await this.cliente.messages.create({
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

        } catch (error) {

            console.error(
                "Error al conectar con Anthropic:",
                error
            );

            throw error;

        }

    }

    // Generación de respuesta estructurada para la tutoría
    async generarRespuestaEstructurada(prompt) {

        try {

            const respuesta =
                await this.cliente.messages.create({
                    model: process.env.MODELO_CLAUDE,
                    max_tokens: 2048,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                });

            const texto = respuesta.content
                .filter(bloque => bloque.type === "text")
                .map(bloque => bloque.text)
                .join("\n")
                .trim();

            let resultado;

            try {

                resultado = JSON.parse(texto);

            } catch (errorParseo) {

                const inicio = texto.indexOf("{");
                const fin = texto.lastIndexOf("}");

                if (inicio === -1 || fin === -1) {
                    throw new Error(
                        "Claude no devolvió un JSON válido."
                    );
                }

                resultado = JSON.parse(
                    texto.substring(inicio, fin + 1)
                );

            }

            if (
                !resultado ||
                typeof resultado.respuesta !== "string" ||
                typeof resultado.puedeFinalizar !== "boolean"
            ) {

                throw new Error(
                    "La estructura devuelta por Claude no es válida."
                );

            }

            const dimensionesPermitidas = [
                "interpretacion",
                "analisis",
                "evaluacion",
                "inferencia",
                "explicacion",
                "autorregulacion"
            ];

            const evidencias = Array.isArray(resultado.evidencias)
                ? resultado.evidencias.filter(
                    evidencia => typeof evidencia === "string"
                )
                : [];

            const dimensionesObservadas =
                Array.isArray(resultado.dimensionesObservadas)
                    ? resultado.dimensionesObservadas.filter(
                        dimension =>
                            dimensionesPermitidas.includes(dimension)
                    )
                    : [];

            const puedeFinalizar =
                resultado.puedeFinalizar === true &&
                evidencias.length > 0;

            return {
                respuesta: resultado.respuesta,
                puedeFinalizar,
                evidencias,
                dimensionesObservadas
            };

        } catch (error) {

            console.error(
                "Error al generar respuesta estructurada:",
                error
            );

            throw error;

        }

    }

    // Evaluación final de las seis dimensiones de Facione
    async evaluarFacione(prompt) {

        try {

            const respuesta =
                await this.cliente.messages.create({
                    model: process.env.MODELO_CLAUDE,
                    max_tokens: 2048,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                });

            const texto = respuesta.content
                .filter(bloque => bloque.type === "text")
                .map(bloque => bloque.text)
                .join("\n")
                .trim();

            let resultado;

            try {

                resultado = JSON.parse(texto);

            } catch (errorParseo) {

                const inicio = texto.indexOf("{");
                const fin = texto.lastIndexOf("}");

                if (inicio === -1 || fin === -1) {
                    throw new Error(
                        "Claude no devolvió una evaluación JSON válida."
                    );
                }

                resultado = JSON.parse(
                    texto.substring(inicio, fin + 1)
                );

            }

            const dimensiones = [
                "interpretacion",
                "analisis",
                "evaluacion",
                "inferencia",
                "explicacion",
                "autorregulacion"
            ];

            if (!resultado || typeof resultado !== "object") {

                throw new Error(
                    "La evaluación recibida no tiene una estructura válida."
                );

            }

            for (const dimension of dimensiones) {

                const puntuacion = resultado[dimension];

                if (
                    typeof puntuacion !== "number" ||
                    !Number.isFinite(puntuacion) ||
                    puntuacion < 0 ||
                    puntuacion > 100
                ) {

                    throw new Error(
                        `La puntuación de ${dimension} no es válida.`
                    );

                }

            }

            if (
                typeof resultado.observaciones !== "string" ||
                !resultado.observaciones.trim()
            ) {

                throw new Error(
                    "La evaluación no contiene observaciones."
                );

            }

            return {

                interpretacion: resultado.interpretacion,
                analisis: resultado.analisis,
                evaluacion: resultado.evaluacion,
                inferencia: resultado.inferencia,
                explicacion: resultado.explicacion,
                autorregulacion: resultado.autorregulacion,
                observaciones: resultado.observaciones.trim()

            };

        } catch (error) {

            console.error(
                "Error al evaluar las dimensiones de Facione:",
                error
            );

            throw error;

        }

    }

}

module.exports = new ServicioIA();
