
const servicioSesiones =
    require("../servicios/servicio-sesiones");

const servicioFinalizacionReto =
    require("../servicios/servicio-finalizacion-reto");

const repositorioEvaluacionFacione =
    require("../repositorios/repositorio-evaluacion-facione");


// ==========================================
// CREAR SESIÓN DE TUTORÍA
// ==========================================

async function crear(req, res) {

    try {

        const usuarioId =
            req.usuario.id;

        const { retoId } = req.body;

        if (!retoId) {

            return res.status(400).json({

                exito: false,

                mensaje: "El reto es obligatorio."

            });

        }

        const sesion =
            await servicioSesiones.crearSesion(
                usuarioId,
                retoId
            );

        return res.status(201).json({

            exito: true,

            mensaje: "Sesión de tutoría creada correctamente.",

            sesionId: sesion.id,

            intentoId: sesion.intentoId,

            sesion

        });

    } catch (error) {

        console.error(
            "Error al crear sesión:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            exito: false,

            mensaje: error.statusCode
                ? error.message
                : "Error interno al crear la sesión."

        });

    }

}


// ==========================================
// FINALIZAR RETO Y GENERAR EVALUACIÓN
// ==========================================

async function finalizar(req, res) {

    try {

        const usuarioId =
            req.usuario.id;

        const { sesionId } =
            req.body;

        if (!sesionId) {

            return res.status(400).json({

                exito: false,

                mensaje:
                    "El identificador de la sesión es obligatorio."

            });

        }

        const resultado =
            await servicioFinalizacionReto.finalizarReto(
                sesionId,
                usuarioId
            );

        return res.status(200).json({

            exito: true,

            mensaje: resultado.mensaje,

            sesionId: resultado.sesionId,

            intentoId: resultado.intentoId,

            evaluacion: resultado.evaluacion

        });

    } catch (error) {

        console.error(
            "Error al finalizar reto:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            exito: false,

            mensaje: error.statusCode
                ? error.message
                : "Error interno al finalizar el reto."

        });

    }

}


// ==========================================
// CONSULTAR RESULTADOS DE UNA SESIÓN
// ==========================================

async function obtenerResultados(req, res) {

    try {

        const usuarioId =
            req.usuario.id;

        const { sesionId } =
            req.params;

        if (!sesionId) {

            return res.status(400).json({

                exito: false,

                mensaje:
                    "El identificador de la sesión es obligatorio."

            });

        }

        // Obtener la sesión y verificar que pertenezca al usuario.

        const sesion =
            await servicioSesiones.obtenerSesion(sesionId);

        if (
            !sesion ||
            sesion.usuario_id !== usuarioId
        ) {

            return res.status(404).json({

                exito: false,

                mensaje:
                    "No se encontró la sesión solicitada."

            });

        }

        // Verificar que el reto haya sido finalizado.

        if (sesion.estado !== "FINALIZADA") {

            return res.status(409).json({

                exito: false,

                mensaje:
                    "La sesión todavía no ha sido finalizada."

            });

        }

        // Consultar la evaluación de Facione.

        const evaluacion =
            await repositorioEvaluacionFacione.obtenerPorSesion(
                sesionId
            );

        if (!evaluacion) {

            return res.status(404).json({

                exito: false,

                mensaje:
                    "Todavía no existe una evaluación para esta sesión."

            });

        }

        return res.status(200).json({

            exito: true,

            mensaje:
                "Resultados obtenidos correctamente.",

            sesionId: sesion.id,

            reto: {

                id: sesion.retos.id,

                titulo: sesion.retos.titulo,

                descripcion: sesion.retos.descripcion

            },

            evaluacion

        });

    } catch (error) {

        console.error(
            "Error al consultar resultados:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({

            exito: false,

            mensaje: error.statusCode
                ? error.message
                : "Error interno al consultar los resultados."

        });

    }

}


// ==========================================
// EXPORTAR CONTROLADORES
// ==========================================

module.exports = {

    crear,

    finalizar,

    obtenerResultados

};
