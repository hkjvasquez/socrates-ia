
const servicioUsuarios =
    require("../servicios/servicio-usuarios");

class ControladorUsuarios {

    async crearEstudiante(req, res) {

        try {

            const usuario =
                await servicioUsuarios.crearEstudiante(req.body);

            return res.status(201).json({
                exito: true,
                mensaje: "Estudiante creado correctamente",
                usuario
            });

        } catch (error) {

            console.error("Error al crear estudiante:", error);

            return res.status(error.statusCode || 500).json({
                exito: false,
                mensaje: error.statusCode
                    ? error.message
                    : "Error interno al crear el estudiante"
            });

        }

    }

}

module.exports = new ControladorUsuarios();
