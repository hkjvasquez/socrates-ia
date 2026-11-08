const prisma =
    require("../configuracion/base-datos");

class RepositorioTemas {

    async listarPorMateria(materiaId) {

        return await prisma.temas.findMany({
            where: { materia_id: materiaId },
            orderBy: { nombre: "asc" },
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });

    }

}

module.exports =
    new RepositorioTemas();