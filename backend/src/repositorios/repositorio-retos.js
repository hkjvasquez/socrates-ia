const prisma =
    require("../configuracion/base-datos");

class RepositorioRetos {

    async listarPorTema(temaId) {

        return await prisma.retos.findMany({
            where: {
                tema_id: temaId,
                activo: true
            },
            orderBy: { nivel_dificultad: "asc" },
            select: {
                id: true,
                titulo: true,
                descripcion: true,
                dificultad: true
            }
        });

    }

    async obtenerPorId(id) {

        return await prisma.retos.findFirst({
            where: {
                id,
                activo: true
            },
            select: {
                id: true,
                titulo: true,
                descripcion: true,
                dificultad: true,
                temas: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });

    }

}

module.exports =
    new RepositorioRetos();