
const prisma = require("../configuracion/base-datos");

class RepositorioUsuarios {

    async buscarPorCorreo(correo) {

        return await prisma.usuarios.findUnique({
            where: { correo }
        });

    }

    async buscarRolEstudiante() {

        return await prisma.roles.findUnique({
            where: { nombre: "ESTUDIANTE" }
        });

    }

    async crear(datos) {

        return await prisma.usuarios.create({
            data: datos,
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                correo: true,
                activo: true,
                fecha_creacion: true,
                roles: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

    }

}

module.exports = new RepositorioUsuarios();
