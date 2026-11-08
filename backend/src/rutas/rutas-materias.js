
const express = require("express");

const controladorMaterias =
    require("../controladores/controlador-materias");

const router = express.Router();

router.get(
    "/",
    (req, res) => controladorMaterias.listar(req, res)
);

router.get(
    "/:id/temas",
    (req, res) => controladorMaterias.listarTemas(req, res)
);

module.exports = router;