
const repositorioAuth =
    require("../repositorios/repositorio-auth");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ServicioAuth {

    async login(correo, contrasena) {

        // Buscar usuario por correo
        const usuario =
            await repositorioAuth.obtenerUsuarioPorCorreo(correo);

        if (!usuario) {

            const error = new Error("Credenciales incorrectas");
            error.statusCode = 401;
            throw error;

        }

        // Verificar estado del usuario
        if (!usuario.activo) {

            const error = new Error("El usuario está inactivo");
            error.statusCode = 403;
            throw error;

        }

        // Verificar contraseña
        const contrasenaValida =
            await bcrypt.compare(
                contrasena,
                usuario.contrasena_hash
            );

        if (!contrasenaValida) {

            const error = new Error("Credenciales incorrectas");
            error.statusCode = 401;
            throw error;

        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.roles.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        // Actualizar último acceso
        await repositorioAuth.actualizarUltimoAcceso(
            usuario.id
        );

        // Preparar respuesta sin contraseña
        const usuarioRespuesta = {
            id: usuario.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.roles.nombre
        };

        return {
            usuario: usuarioRespuesta,
            token
        };

    }

}

module.exports =
    new ServicioAuth();
