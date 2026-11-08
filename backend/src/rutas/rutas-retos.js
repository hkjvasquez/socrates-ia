
const express = require('express');

const controladorRetos =
    require('../controladores/controlador-retos');

const router = express.Router();

// Obtener todos los retos de un tema
router.get(
    '/tema/:temaId',
    (req, res) => controladorRetos.listarPorTema(req, res)
);

// Obtener un reto específico
router.get(
    '/:id',
    (req, res) => controladorRetos.obtener(req, res)
);

module.exports = router;
