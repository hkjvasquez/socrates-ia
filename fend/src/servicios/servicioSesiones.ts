import api from "./api";

export async function crearSesion(
    usuarioId: string,
    retoId: string
) {

    const response =
        await api.post(
            "/sesiones",
            {
                usuarioId,
                retoId
            }
        );

    return response.data;
}