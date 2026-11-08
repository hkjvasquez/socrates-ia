
const servicioRetos =
    require('../servicios/servicio-retos');

class ControladorRetos {

    async listarPorTema(req, res) {

        try {

            const retos =
                await servicioRetos.obtenerRetosPorTema(
                    req.params.temaId
                );

            res.json({ retos });

        } catch (error) {

            console.error('Error obteniendo retos por tema:', error);

            res.status(500).json({
                error: 'No se pudieron obtener los retos'
            });

        }

    }

    async obtener(req, res) {

        try {

            const reto =
                await servicioRetos.obtenerRetoPorId(
                    req.params.id
                );

            if (!reto) {

                return res.status(404).json({
                    error: 'Reto no encontrado'
                });

            }

            res.json({ reto });

        } catch (error) {

            console.error('Error obteniendo reto:', error);

            res.status(500).json({
                error: 'No se pudo obtener el reto'
            });

        }

    }

}

module.exports =
    new ControladorRetos();
