
const jwt = require("jsonwebtoken");

// Middleware para verificar la autenticación del usuario
function verificarToken(req, res, next) {

    try {

        const encabezado =
            req.headers.authorization;

        // Verificar que exista el encabezado
        if (!encabezado || !encabezado.startsWith("Bearer ")) {

            return res.status(401).json({
                exito: false,
                mensaje: "No se proporcionó un token de autenticación."
            });

        }

        // Extraer el token
        const token =
            encabezado.split(" ")[1];

        // Verificar el token JWT
        const datosUsuario =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Guardar la identidad autenticada en la solicitud
        req.usuario = datosUsuario;

        next();

    } catch (error) {

        console.error("Error de autenticación:", error.message);

        return res.status(401).json({
            exito: false,
            mensaje: "El token es inválido o ha expirado."
        });

    }

}

module.exports = verificarToken;
