
const servicioAuth =
    require("../servicios/servicio-auth");

class ControladorAuth {

    async login(req, res) {

        try {

            const { correo, contrasena } = req.body;

            // Validar campos obligatorios
            if (!correo || !contrasena) {

                return res.status(400).json({
                    exito: false,
                    mensaje: "El correo y la contraseña son obligatorios"
                });

            }

            // Delegar autenticación al servicio
            const resultado =
                await servicioAuth.login(
                    correo,
                    contrasena
                );

            return res.status(200).json({
                exito: true,
                mensaje: "Inicio de sesión exitoso",
                usuario: resultado.usuario,
                token: resultado.token
            });

        } catch (error) {

            console.error("Error en Login:", error);

            return res.status(error.statusCode || 500).json({
                exito: false,
                mensaje: error.statusCode
                    ? error.message
                    : "Error interno al iniciar sesión"
            });

        }

    }

}

module.exports =
    new ControladorAuth();
