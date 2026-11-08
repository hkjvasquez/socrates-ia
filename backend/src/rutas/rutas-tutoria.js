const express = require("express");

const router = express.Router();

const controlador =
    require("../controladores/controlador-tutoria");

router.post(
    "/preguntar",
    controlador.preguntar
);

module.exports = router;