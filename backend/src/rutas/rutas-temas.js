const express = require("express");

const controladorTemas =
    require("../controladores/controlador-temas");

const router = express.Router();

router.get(
    "/:id/retos",
    (req, res) => controladorTemas.listarRetos(req, res)
);

module.exports = router;