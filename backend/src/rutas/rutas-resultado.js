
const express = require("express");

const router = express.Router();

// Controlador de resultados
const controlador =
    require("../controladores/controlador-resultados");

// Middleware de autenticación
const verificarToken =
    require("../middlewares/middleware-autenticacion");

// ==========================================
// CONSULTAR TODOS LOS RESULTADOS
// ACCESO EXCLUSIVO PARA DOCENTES
// ==========================================

router.get(
    "/",
    verificarToken,
    (req, res, next) => {

        if (req.usuario.rol !== "DOCENTE") {

            return res.status(403).json({
                exito: false,
                mensaje: "No tienes permisos para consultar los resultados. Este recurso es exclusivo para docentes."
            });

        }

        next();

    },
    controlador.listarTodos
);

module.exports = router;
