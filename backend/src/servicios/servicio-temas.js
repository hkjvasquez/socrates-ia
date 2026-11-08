const repositorioTemas =
    require("../repositorios/repositorio-temas");

class ServicioTemas {

    async obtenerTemasPorMateria(materiaId) {

        return await repositorioTemas.listarPorMateria(materiaId);

    }

}

module.exports =
    new ServicioTemas();