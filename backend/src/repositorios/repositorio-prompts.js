
const prisma =
    require("../configuracion/base-datos");

class RepositorioPrompts {

    async obtenerPromptActivo(codigo) {

        return await prisma.prompts.findFirst({

            where: {
                codigo: codigo,
                activo: true
            },

            orderBy: {
                version: "desc"
            }

        });

    }

}

module.exports =
    new RepositorioPrompts();
