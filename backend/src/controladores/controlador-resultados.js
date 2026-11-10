
const repositorioEvaluacionFacione =
    require("../repositorios/repositorio-evaluacion-facione");


// ==========================================
// CONSULTAR TODOS LOS RESULTADOS
// ==========================================

async function listarTodos(req, res) {

    try {

        // Verificar que exista un usuario autenticado.

        if (!req.usuario || !req.usuario.id) {

            return res.status(401).json({

                exito: false,

                mensaje: "Debes iniciar sesión para consultar los resultados."

            });

        }

        // Obtener todos los resultados registrados.

        const resultados =
            await repositorioEvaluacionFacione.listarTodos();

        return res.status(200).json({

            exito: true,

            mensaje: "Resultados consultados correctamente.",

            total: resultados.length,

            resultados

        });

    } catch (error) {

        console.error(
            "Error al consultar todos los resultados:",
            error
        );

        return res.status(500).json({

            exito: false,

            mensaje: "No fue posible consultar los resultados."

        });

    }

}


// ==========================================
// EXPORTAR CONTROLADOR
// ==========================================

module.exports = {

    listarTodos

};
