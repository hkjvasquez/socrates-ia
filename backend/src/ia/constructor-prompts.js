function construirPrompt(
    promptSistema,
    historial,
    datos
) {

    const contextoConversacion =
        historial
            .map(
                mensaje =>
                    `${mensaje.remitente}: ${mensaje.contenido}`
            )
            .join("\n\n");

    return `
${promptSistema}

MATERIA:
${datos.materia}

TEMA:
${datos.tema}

RETO:
${datos.reto}

HISTORIAL DE CONVERSACIÓN:

${contextoConversacion}

MENSAJE ACTUAL DEL ESTUDIANTE:

${datos.mensaje}
`;

}

module.exports = {
    construirPrompt
};