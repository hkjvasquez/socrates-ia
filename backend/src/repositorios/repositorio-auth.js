
const prisma =
    require("../configuracion/base-datos");

class RepositorioAuth {

    async obtenerUsuarioPorCorreo(correo) {

        return await prisma.usuarios.findUnique({
            where: {
                correo: correo
            },
            select: {
                id: true,
                rol_id: true,
                nombres: true,
                apellidos: true,
                correo: true,
                contrasena_hash: true,
                activo: true,
                roles: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

    }

    async actualizarUltimoAcceso(id) {

        return await prisma.usuarios.update({
            where: {
                id: id
            },
            data: {
                ultimo_acceso: new Date()
            }
        });

    }

}

module.exports =
    new RepositorioAuth();
