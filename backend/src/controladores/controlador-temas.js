const servicioRetos =
    require("../servicios/servicio-retos");

class ControladorTemas {

    async listarRetos(req, res) {

        try {

            const retos =
                await servicioRetos.obtenerRetosPorTema(
                    req.params.id
                );

            res.json({ retos });

        } catch (error) {

            console.error("Error obteniendo retos:", error);

            res.status(500).json({
                error: "No se pudieron obtener los retos"
            });

        }

    }

}

module.exports =
    new ControladorTemas();


    