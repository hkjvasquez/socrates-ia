require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const rutasAuth =
    require('./rutas/rutas-auth');

const rutasTutoria =
    require("./rutas/rutas-tutoria");

const rutasSesiones =
    require("./rutas/rutas-sesiones");

const rutasMaterias =
    require("./rutas/rutas-materias");

const rutasTemas =
    require("./rutas/rutas-temas");

const rutasRetos =
    require("./rutas/rutas-retos");

app.use(
    "/api/tutoria",
    rutasTutoria
);

app.use(
    "/api/sesiones",
    rutasSesiones
);

app.use(
    "/api/materias",
    rutasMaterias
);

app.use(
    "/api/temas",
    rutasTemas
);


app.use(
    "/api/auth",
    rutasAuth
);

app.use(
    "/api/retos",
    rutasRetos
);

const puerto =
    process.env.PUERTO || 3000;

app.listen(
    puerto,
    () => {
        console.log(
            `Servidor iniciado en puerto ${puerto}`
        );
    }
);