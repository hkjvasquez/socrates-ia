
const express = require("express");

const router = express.Router();

// Controlador de sesiones
const controlador =
    require("../controladores/controlador-sesiones");

// Middleware de autenticación JWT
const verificarToken =
    require("../middlewares/middleware-autenticacion");


// ==========================================
// CREAR SESIÓN DE TUTORÍA
// ==========================================

router.post(
    "/",
    verificarToken,
    controlador.crear
);


// ==========================================
// FINALIZAR RETO DEL ESTUDIANTE
// ==========================================

router.post(
    "/finalizar",
    verificarToken,
    controlador.finalizar
);


// ==========================================
// CONSULTAR RESULTADOS DE UNA SESIÓN
// ==========================================

router.get(
    "/:sesionId/resultados",
    verificarToken,
    controlador.obtenerResultados
);


// ==========================================
// EXPORTAR RUTAS
// ==========================================

module.exports = router;
