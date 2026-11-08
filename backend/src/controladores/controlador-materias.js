const servicioMaterias =
    require("../servicios/servicio-materias");

const servicioTemas =
    require("../servicios/servicio-temas");

class ControladorMaterias {

    async listar(req, res) {

        try {

            const materias =
                await servicioMaterias.obtenerMaterias();

            res.json({ materias });

        } catch (error) {

            console.error("Error obteniendo materias:", error);

            res.status(500).json({
                error: "No se pudieron obtener las materias"
            });

        }

    }

    async listarTemas(req, res) {

        try {

            const temas =
                await servicioTemas.obtenerTemasPorMateria(
                    req.params.id
                );

            res.json({ temas });

        } catch (error) {

            console.error("Error obteniendo temas:", error);

            res.status(500).json({
                error: "No se pudieron obtener los temas"
            });

        }

    }

}

module.exports =
    new ControladorMaterias();