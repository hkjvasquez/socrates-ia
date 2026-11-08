const prisma =
    require("../configuracion/base-datos");

class RepositorioPrompts {

    async obtenerPromptActivo() {

        return await prisma.prompts.findFirst({
            where: {
                codigo: "SOCRATICO_V1",
                activo: true
            }
        });

    }

}

module.exports =
    new RepositorioPrompts();