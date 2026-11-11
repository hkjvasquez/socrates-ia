
function verificarDocente(req, res, next) {

    // Verificar que exista un usuario autenticado
    if (!req.usuario) {
        return res.status(401).json({
            exito: false,
            mensaje: "No se ha identificado al usuario."
        });
    }

    // Verificar que el usuario tenga el rol DOCENTE
    if (req.usuario.rol !== "DOCENTE") {
        return res.status(403).json({
            exito: false,
            mensaje: "No tienes permisos para realizar esta acción."
        });
    }

    // Si es docente, permitir continuar
    next();
}

module.exports = verificarDocente;
