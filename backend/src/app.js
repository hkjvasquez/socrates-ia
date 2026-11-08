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



// Ruta de verificación del servidor
app.get("/health", (req, res) => {
  res.status(200).json({
    exito: true,
    mensaje: "Servidor de Sócrates IA funcionando correctamente"
  });
});
const puerto =
    process.env.PORT || process.env.PUERTO || 3001;

app.listen(
    puerto,
    () => {
        console.log(
            `Servidor iniciado en puerto ${puerto}`
        );
    }
);