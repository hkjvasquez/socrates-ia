const servicioTutoria =
    require("../servicios/servicio-tutoria");

async function preguntar(req, res) {

    try {

        const respuesta =
            await servicioTutoria
                .preguntar(req.body);

        res.json({
            exito: true,
            respuesta
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            exito: false,
            mensaje: error.message
        });

    }

}

module.exports = {
    preguntar
};