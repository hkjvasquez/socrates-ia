import api from "./api";

export interface PreguntaTutorRequest {

    sesionId: string;
    mensaje: string;

}

export async function preguntar(
    datos: PreguntaTutorRequest
) {

    const response =
        await api.post(
            "/tutoria/preguntar",
            datos
        );

    return response.data;

}