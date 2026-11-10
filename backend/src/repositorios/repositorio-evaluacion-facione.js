
const prisma = require("../configuracion/base-datos");

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

        // Validar puntuaciones de las seis dimensiones.

        for (const dimension of dimensiones) {

            const puntuacion = Number(datos[dimension]);

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

        // Validar observaciones.

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

                evaluado_por: true,

                fecha_creacion: true

            }

        });

    }


    // ==========================================
    // CONSULTAR TODOS LOS RESULTADOS
    // ==========================================

    async listarTodos() {

        return await prisma.$queryRaw`

            SELECT

                ef.id AS evaluacion_id,

                ef.sesion_tutoria_id,

                u.id AS estudiante_id,

                u.nombres,

                u.apellidos,

                u.correo,

                r.id AS reto_id,

                r.titulo AS nombre_reto,

                st.fecha_inicio,

                st.fecha_fin,

                st.estado,

                ef.interpretacion,

                ef.analisis,

                ef.evaluacion,

                ef.inferencia,

                ef.explicacion,

                ef.autorregulacion,

                ef.observaciones,

                ef.evaluado_por,

                ef.fecha_creacion AS fecha_evaluacion

            FROM evaluaciones_facione ef

            INNER JOIN sesiones_tutoria st

                ON ef.sesion_tutoria_id = st.id

            INNER JOIN usuarios u

                ON st.usuario_id = u.id

            INNER JOIN retos r

                ON st.reto_id = r.id

            ORDER BY ef.fecha_creacion DESC

        `;

    }

}


// ==========================================
// EXPORTAR REPOSITORIO
// ==========================================

module.exports = new RepositorioEvaluacionFacione();
