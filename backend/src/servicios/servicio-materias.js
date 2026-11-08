const repositorioMaterias =
    require("../repositorios/repositorio-materias");

class ServicioMaterias {

    async obtenerMaterias() {

        return await repositorioMaterias.listar();

    }

}

module.exports =
    new ServicioMaterias();