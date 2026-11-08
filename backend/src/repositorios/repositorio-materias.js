const prisma =
    require("../configuracion/base-datos");

class RepositorioMaterias {

    async listar() {

        return await prisma.materias.findMany({
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
    new RepositorioMaterias();