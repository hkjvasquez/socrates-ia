const express = require("express");

const controladorAuth =
    require("../controladores/controlador-auth");

const router = express.Router();

router.post(
    "/login",
    (req, res) => controladorAuth.login(req, res)
);

module.exports = router;