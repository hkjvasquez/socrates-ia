
import './resultados.css';

import type { EvaluacionFacione } from '../servicios/servicioResultados';

interface ResultadosProps {
    evaluacion: EvaluacionFacione;
    retoTitulo: string;
    retoDescripcion: string;
    onVolver: () => void;
}

interface DimensionFacione {
    clave: keyof Pick<
        EvaluacionFacione,
        | 'interpretacion'
        | 'analisis'
        | 'evaluacion'
        | 'inferencia'
        | 'explicacion'
        | 'autorregulacion'
    >;
    nombre: string;
    descripcion: string;
    icono: string;
}

const dimensiones: DimensionFacione[] = [
    {
        clave: 'interpretacion',
        nombre: 'Interpretación',
        descripcion: 'Comprende y expresa el significado de la información.',
        icono: '◈'
    },
    {
        clave: 'analisis',
        nombre: 'Análisis',
        descripcion: 'Identifica relaciones, argumentos y elementos relevantes.',
        icono: '⌕'
    },
    {
        clave: 'evaluacion',
        nombre: 'Evaluación',
        descripcion: 'Valora la credibilidad de la información y los argumentos.',
        icono: '✓'
    },
    {
        clave: 'inferencia',
        nombre: 'Inferencia',
        descripcion: 'Obtiene conclusiones a partir de evidencias.',
        icono: '⟶'
    },
    {
        clave: 'explicacion',
        nombre: 'Explicación',
        descripcion: 'Comunica y justifica sus razonamientos.',
        icono: '≡'
    },
    {
        clave: 'autorregulacion',
        nombre: 'Autorregulación',
        descripcion: 'Revisa y corrige su propio proceso de pensamiento.',
        icono: '◎'
    }
];

function convertirPuntuacion(
    valor: number | string | null | undefined
): number {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return 0;
    }

    return Math.min(100, Math.max(0, numero));
}

function obtenerNivel(puntuacion: number): string {
    if (puntuacion >= 80) return 'Alto';

    if (puntuacion >= 60) return 'En desarrollo';

    if (puntuacion >= 1) return 'Inicial';

    return 'Sin evidencia suficiente';
}

export default function Resultados({
    evaluacion,
    retoTitulo,
    retoDescripcion,
    onVolver
}: ResultadosProps) {

    // ==========================================
    // VALIDAR EVALUACIÓN RECIBIDA
    // ==========================================

    if (!evaluacion) {
        return (
            <section className="resultados-pagina">
                <div className="resultados-error">
                    <span className="resultados-error-icono">!</span>

                    <h1>No hay una evaluación disponible</h1>

                    <p>
                        No fue posible encontrar los datos de la evaluación
                        de este reto.
                    </p>

                    <button
                        className="resultados-boton-principal"
                        onClick={onVolver}
                    >
                        Volver a materias
                    </button>
                </div>
            </section>
        );
    }

    // ==========================================
    // RESULTADOS
    // ==========================================

    return (
        <section className="resultados-pagina">

            <header className="resultados-encabezado">
                <div>
                    <span className="resultados-etiqueta">
                        SÓCRATES IA · EVALUACIÓN COGNITIVA
                    </span>

                    <h1>
                        Resultados de aprendizaje
                    </h1>

                    <p>
                        Conoce las habilidades de pensamiento crítico
                        que demostraste durante el reto.
                    </p>
                </div>

                <div className="resultados-insignia">
                    <span>✦</span>
                    <small>RETO COMPLETADO</small>
                </div>
            </header>

            {/* INFORMACIÓN DEL RETO */}

            <article className="resultados-reto">
                <div className="resultados-reto-icono">
                    ◈
                </div>

                <div>
                    <span>RETO REALIZADO</span>

                    <h2>
                        {retoTitulo}
                    </h2>

                    {retoDescripcion && (
                        <p>{retoDescripcion}</p>
                    )}
                </div>
            </article>

            {/* DIMENSIONES DE FACIONE */}

            <div className="resultados-seccion-encabezado">
                <div>
                    <span className="resultados-etiqueta">
                        MODELO DE PENSAMIENTO CRÍTICO
                    </span>

                    <h2>
                        Las seis dimensiones de Facione
                    </h2>

                    <p>
                        Valoración basada en las evidencias identificadas
                        durante tu conversación con el tutor.
                    </p>
                </div>
            </div>

            <div className="resultados-grid">
                {dimensiones.map((dimension) => {
                    const puntuacion = convertirPuntuacion(
                        evaluacion[dimension.clave]
                    );

                    return (
                        <article
                            className="resultados-dimension"
                            key={dimension.clave}
                        >
                            <div className="resultados-dimension-superior">
                                <div className="resultados-dimension-icono">
                                    {dimension.icono}
                                </div>

                                <span className="resultados-dimension-nivel">
                                    {obtenerNivel(puntuacion)}
                                </span>
                            </div>

                            <h3>
                                {dimension.nombre}
                            </h3>

                            <p>
                                {dimension.descripcion}
                            </p>

                            <div className="resultados-puntuacion">
                                <strong>
                                    {puntuacion.toFixed(0)}
                                </strong>

                                <span>/ 100</span>
                            </div>

                            <div
                                className="resultados-barra"
                                role="progressbar"
                                aria-label={`Puntuación de ${dimension.nombre}`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={puntuacion}
                            >
                                <div
                                    className="resultados-barra-progreso"
                                    style={{
                                        width: `${puntuacion}%`
                                    }}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* OBSERVACIONES DE LA IA */}

            <article className="resultados-observaciones">
                <div className="resultados-observaciones-icono">
                    ✦
                </div>

                <div>
                    <span className="resultados-etiqueta">
                        RETROALIMENTACIÓN PERSONALIZADA
                    </span>

                    <h2>
                        Observaciones de Sócrates IA
                    </h2>

                    <p>
                        {evaluacion.observaciones ||
                            'No se registraron observaciones para esta evaluación.'}
                    </p>
                </div>
            </article>

            {/* PIE DE PÁGINA */}

            <footer className="resultados-pie">
                <div>
                    <span>Tu aprendizaje continúa.</span>

                    <p>
                        Cada desafío es una oportunidad para fortalecer
                        tu pensamiento y mejorar tu razonamiento.
                    </p>
                </div>

                <button
                    className="resultados-boton-principal"
                    onClick={onVolver}
                >
                    Volver a materias →
                </button>
            </footer>

        </section>
    );
}
