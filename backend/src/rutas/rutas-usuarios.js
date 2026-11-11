
const express = require("express");

const controladorUsuarios =
    require("../controladores/controlador-usuarios");

const verificarToken =
    require("../middlewares/middleware-autenticacion");

const verificarDocente =
    require("../middlewares/middleware-docente");

const router = express.Router();

// Registrar un estudiante.
// Solo permite el acceso a docentes autenticados.
router.post(
    "/",
    verificarToken,
    verificarDocente,
    (req, res) => controladorUsuarios.crearEstudiante(req, res)
);

module.exports = router;
