
const prisma =
    require("../configuracion/base-datos");

class RepositorioEvaluacionFacione {

    // ==========================================
    // CREAR EVALUACIÓN DE FACIONE
    // ==========================================

    async crear(datos, transaccion = prisma) {

        const dimensiones = [
            "interpretacion",
            "analisis",
            "evaluacion",
            "inferencia",
            "explicacion",
            "autorregulacion"
        ];

        for (const dimension of dimensiones) {

            const puntuacion =
                Number(datos[dimension]);

            if (
                !Number.isFinite(puntuacion) ||
                puntuacion < 0 ||
                puntuacion > 100
            ) {

                throw new Error(
                    `La puntuación de ${dimension} debe estar entre 0 y 100.`
                );

            }

        }

        if (
            typeof datos.observaciones !== "string" ||
            !datos.observaciones.trim()
        ) {

            throw new Error(
                "Las observaciones de la evaluación son obligatorias."
            );

        }

        return await transaccion.evaluaciones_facione.create({

            data: {

                sesion_tutoria_id: datos.sesionId,

                interpretacion: datos.interpretacion,

                analisis: datos.analisis,

                evaluacion: datos.evaluacion,

                inferencia: datos.inferencia,

                explicacion: datos.explicacion,

                autorregulacion: datos.autorregulacion,

                observaciones: datos.observaciones,

                evaluado_por: "IA"

            }

        });

    }


    // ==========================================
    // OBTENER EVALUACIÓN POR SESIÓN
    // ==========================================

    async obtenerPorSesion(sesionId) {

        return await prisma.evaluaciones_facione.findFirst({

            where: {

                sesion_tutoria_id: sesionId

            },

            select: {

                id: true,

                sesion_tutoria_id: true,

                interpretacion: true,

                analisis: true,

                evaluacion: true,

                inferencia: true,

                explicacion: true,

                autorregulacion: true,

                observaciones: true,

                evaluado_por: true

            }

        });

    }

}


// ==========================================
// EXPORTAR REPOSITORIO
// ==========================================

module.exports =
    new RepositorioEvaluacionFacione();
