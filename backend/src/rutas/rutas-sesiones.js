const express =
    require("express");

const router =
    express.Router();

const controlador =
    require("../controladores/controlador-sesiones");

router.post(
    "/",
    controlador.crear
);

module.exports =
    router;