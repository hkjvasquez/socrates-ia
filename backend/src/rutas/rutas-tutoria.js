
const express = require("express");

const router = express.Router();

const controlador =
    require("../controladores/controlador-tutoria");

const verificarToken =
    require("../middlewares/middleware-autenticacion");

// Preguntar al tutor socrático (ruta protegida)
router.post(
    "/preguntar",
    verificarToken,
    controlador.preguntar
);

module.exports = router;
