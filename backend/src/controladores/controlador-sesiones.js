const servicioSesiones =
    require("../servicios/servicio-sesiones");

async function crear(req, res) {

    try {

        const {
            usuarioId,
            retoId
        } = req.body;

        const sesion =
            await servicioSesiones
                .crearSesion(
                    usuarioId,
                    retoId
                );

        res.status(201).json({
            exito: true,
            sesion
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            exito: false,
            mensaje: error.message
        });

    }

}

module.exports = {
    crear
};