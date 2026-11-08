const repositorioRetos =
    require("../repositorios/repositorio-retos");

class ServicioRetos {

    async obtenerRetosPorTema(temaId) {

        return await repositorioRetos.listarPorTema(temaId);

    }

    async obtenerRetoPorId(id) {

        return await repositorioRetos.obtenerPorId(id);

    }

}

module.exports =
    new ServicioRetos();