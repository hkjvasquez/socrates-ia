

const bcrypt = require("bcrypt");

const repositorioUsuarios =
    require("../repositorios/repositorio-usuarios");

class ServicioUsuarios {

    async crearEstudiante(datos) {

        const {
            nombres,
            apellidos,
            correo,
            contrasena
        } = datos;

        // Validar campos obligatorios
        if (!nombres || !apellidos || !correo || !contrasena) {
            const error = new Error(
                "Todos los campos son obligatorios"
            );
            error.statusCode = 400;
            throw error;
        }

        // Validar longitud de los datos
        if (nombres.trim().length > 100 ||
            apellidos.trim().length > 100) {
            const error = new Error(
                "Los nombres y apellidos no pueden superar 100 caracteres"
            );
            error.statusCode = 400;
            throw error;
        }

        // Validar correo
        const correoNormalizado = correo.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
            const error = new Error("El correo electrónico no es válido");
            error.statusCode = 400;
            throw error;
        }

        // Validar contraseña
        if (typeof contrasena !== "string" || contrasena.length < 8) {
            const error = new Error(
                "La contraseña debe tener al menos 8 caracteres"
            );
            error.statusCode = 400;
            throw error;
        }

        // Comprobar si el correo ya existe
        const usuarioExistente =
            await repositorioUsuarios.buscarPorCorreo(
                correoNormalizado
            );

        if (usuarioExistente) {
            const error = new Error(
                "Ya existe un usuario registrado con ese correo"
            );
            error.statusCode = 409;
            throw error;
        }

        // Obtener rol ESTUDIANTE
        const rolEstudiante =
            await repositorioUsuarios.buscarRolEstudiante();

        if (!rolEstudiante) {
            const error = new Error(
                "No existe el rol ESTUDIANTE en la base de datos"
            );
            error.statusCode = 500;
            throw error;
        }

        // Generar hash de contraseña
        const contrasenaHash =
            await bcrypt.hash(contrasena, 12);

        // Crear estudiante
        return await repositorioUsuarios.crear({
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            correo: correoNormalizado,
            contrasena_hash: contrasenaHash,
            rol_id: rolEstudiante.id
        });

    }

}

module.exports = new ServicioUsuarios();
