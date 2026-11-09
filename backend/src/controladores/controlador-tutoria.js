
const servicioTutoria =
    require("../servicios/servicio-tutoria");


async function preguntar(req, res) {

    try {

        // ==========================================
        // 1. OBTENER DATOS DE LA PETICIÓN
        // ==========================================

        const {
            sesionId,
            intentoId,
            mensaje
        } = req.body;

        // El usuario se obtiene del token JWT
        const usuarioId =
            req.usuario.id;

        // ==========================================
        // 2. VALIDAR IDENTIFICADORES
        // ==========================================

        if (!sesionId || !intentoId || !mensaje) {

            return res.status(400).json({

                exito: false,

                mensaje:
                    "La sesión, el intento y el mensaje son obligatorios."

            });

        }

        // ==========================================
        // 3. EJECUTAR SERVICIO DE TUTORÍA
        // ==========================================

        const resultado =
            await servicioTutoria.preguntar({

                sesionId,

                intentoId,

                usuarioId,

                mensaje

            });

        // ==========================================
        // 4. DEVOLVER RESPUESTA
        // ==========================================

        return res.status(200).json({

            exito: true,

            respuesta:
                resultado.respuesta,

            puedeFinalizar:
                resultado.puedeFinalizar,

            evidencias:
                resultado.evidencias,

            dimensionesObservadas:
                resultado.dimensionesObservadas

        });

    } catch (error) {

        console.error(
            "Error en el controlador de tutoría:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            exito: false,

            mensaje:
                error.message ||
                "Ocurrió un error al procesar la consulta del tutor."

        });

    }

}


module.exports = {
    preguntar
};
