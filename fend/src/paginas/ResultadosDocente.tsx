
import { useEffect, useMemo, useState } from 'react';

import {
    obtenerTodosLosResultados,
    type ResultadoGeneral
} from '../servicios/servicioResultados';

import './resultados-docente.css';

// ==========================================
// COMPONENTE RESULTADOS DEL DOCENTE
// ==========================================

export default function ResultadosDocente() {

    const [resultados, setResultados] = useState<ResultadoGeneral[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');
    const [resultadoSeleccionado, setResultadoSeleccionado] =
        useState<ResultadoGeneral | null>(null);

    // ==========================================
    // CONSULTAR RESULTADOS
    // ==========================================

    async function cargarResultados() {

        try {

            setCargando(true);
            setError('');

            const respuesta = await obtenerTodosLosResultados();

            setResultados(respuesta.resultados || []);

        } catch (err: any) {

            console.error('Error al consultar resultados:', err);

            setError(
                err.response?.data?.mensaje ||
                'No fue posible cargar los resultados académicos.'
            );

        } finally {

            setCargando(false);

        }

    }

    useEffect(() => {

        cargarResultados();

    }, []);

    // ==========================================
    // FILTRAR RESULTADOS
    // ==========================================

    const resultadosFiltrados = useMemo(() => {

        const texto = busqueda.toLowerCase().trim();

        return resultados.filter((resultado) => {

            const nombreEstudiante =
                `${resultado.nombres} ${resultado.apellidos}`.toLowerCase();

            const nombreReto =
                resultado.nombre_reto?.toLowerCase() || '';

            const correo =
                resultado.correo?.toLowerCase() || '';

            const coincideBusqueda =
                !texto ||
                nombreEstudiante.includes(texto) ||
                nombreReto.includes(texto) ||
                correo.includes(texto);

            const coincideEstado =
                filtroEstado === 'TODOS' ||
                resultado.estado?.toUpperCase() === filtroEstado;

            return coincideBusqueda && coincideEstado;

        });

    }, [resultados, busqueda, filtroEstado]);

    // ==========================================
    // INDICADORES
    // ==========================================

    const totalEstudiantes = useMemo(() => {

        return new Set(
            resultados.map((resultado) => resultado.estudiante_id)
        ).size;

    }, [resultados]);

    const totalEvaluaciones = resultados.length;

    const evaluacionesFinalizadas = resultados.filter(
        (resultado) =>
            resultado.estado?.toUpperCase() === 'FINALIZADA'
    ).length;

    // ==========================================
    // FORMATO DE PUNTUACIONES
    // ==========================================

    function convertirPuntuacion(
        valor: number | string | null
    ): number {

        const numero = Number(valor);

        if (!Number.isFinite(numero)) {
            return 0;
        }

        return Math.min(100, Math.max(0, numero));

    }

    function obtenerNivel(valor: number | string | null): string {

        const puntuacion = convertirPuntuacion(valor);

        if (puntuacion >= 80) return 'Alto';

        if (puntuacion >= 60) return 'En desarrollo';

        if (puntuacion >= 1) return 'Inicial';

        return 'Sin evidencia';

    }

    function obtenerClaseNivel(valor: number | string | null): string {

        const puntuacion = convertirPuntuacion(valor);

        if (puntuacion >= 80) return 'nivel-alto';

        if (puntuacion >= 60) return 'nivel-desarrollo';

        if (puntuacion >= 1) return 'nivel-inicial';

        return 'nivel-sin-evidencia';

    }

    // ==========================================
    // FORMATO DE FECHAS
    // ==========================================

    function formatearFecha(fecha: string | null): string {

        if (!fecha) {
            return 'No disponible';
        }

        const fechaValida = new Date(fecha);

        if (Number.isNaN(fechaValida.getTime())) {
            return 'No disponible';
        }

        return fechaValida.toLocaleDateString('es-GT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

    }

    // ==========================================
    // DIMENSIONES DE FACIONE
    // ==========================================

    const dimensiones = [
        {
            campo: 'interpretacion',
            nombre: 'Interpretación',
            descripcion: 'Comprensión y significado de la información.',
            inicial: 'I'
        },
        {
            campo: 'analisis',
            nombre: 'Análisis',
            descripcion: 'Identificación de relaciones y argumentos.',
            inicial: 'A'
        },
        {
            campo: 'evaluacion',
            nombre: 'Evaluación',
            descripcion: 'Valoración de afirmaciones y evidencias.',
            inicial: 'E'
        },
        {
            campo: 'inferencia',
            nombre: 'Inferencia',
            descripcion: 'Obtención de conclusiones razonadas.',
            inicial: 'I'
        },
        {
            campo: 'explicacion',
            nombre: 'Explicación',
            descripcion: 'Justificación del razonamiento utilizado.',
            inicial: 'E'
        },
        {
            campo: 'autorregulacion',
            nombre: 'Autorregulación',
            descripcion: 'Revisión y corrección del propio pensamiento.',
            inicial: 'A'
        }
    ] as const;

    // ==========================================
    // RENDERIZADO
    // ==========================================

    if (cargando) {

        return (
            <div className="rd-contenedor rd-centrado">

                <div className="rd-cargando"></div>

                <h3>Consultando resultados académicos</h3>

                <p>Estamos preparando la información de los estudiantes.</p>

            </div>
        );

    }

    if (error) {

        return (
            <div className="rd-contenedor">

                <div className="rd-error">

                    <span className="rd-icono-error">!</span>

                    <h3>No fue posible cargar los resultados</h3>

                    <p>{error}</p>

                    <button
                        className="rd-btn-principal"
                        onClick={cargarResultados}
                    >
                        <span>↻</span> Intentar nuevamente
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="rd-contenedor">

            {/* ENCABEZADO */}

            <header className="rd-encabezado">

                <div>

                    <span className="rd-etiqueta">
                        PANEL DOCENTE
                    </span>

                    <h1>Resultados académicos</h1>

                    <p>
                        Seguimiento del pensamiento crítico y razonamiento
                        de los estudiantes mediante las seis dimensiones
                        de Facione.
                    </p>

                </div>

                <button
                    className="rd-btn-actualizar"
                    onClick={cargarResultados}
                >
                    <span>↻</span>
                    Actualizar datos
                </button>

            </header>

            {/* INDICADORES */}

            <section className="rd-indicadores">

                <article className="rd-indicador">

                    <div className="rd-indicador-icono rd-icono-azul">
                        <span>▤</span>
                    </div>

                    <div>
                        <span>Total de evaluaciones</span>
                        <strong>{totalEvaluaciones}</strong>
                        <small>Evaluaciones registradas</small>
                    </div>

                </article>

                <article className="rd-indicador">

                    <div className="rd-indicador-icono rd-icono-dorado">
                        <span>♙</span>
                    </div>

                    <div>
                        <span>Estudiantes evaluados</span>
                        <strong>{totalEstudiantes}</strong>
                        <small>Estudiantes con resultados</small>
                    </div>

                </article>

                <article className="rd-indicador">

                    <div className="rd-indicador-icono rd-icono-verde">
                        <span>✓</span>
                    </div>

                    <div>
                        <span>Retos finalizados</span>
                        <strong>{evaluacionesFinalizadas}</strong>
                        <small>Sesiones finalizadas</small>
                    </div>

                </article>

            </section>

            {/* CONTENIDO PRINCIPAL */}

            <section className="rd-panel">

                <div className="rd-panel-encabezado">

                    <div>

                        <h2>Evaluaciones de estudiantes</h2>

                        <p>
                            Consulta el desempeño y las evidencias
                            del proceso de tutoría.
                        </p>

                    </div>

                    <span className="rd-total-registros">
                        {resultadosFiltrados.length} registros
                    </span>

                </div>

                {/* BUSCADOR Y FILTROS */}

                <div className="rd-filtros">

                    <div className="rd-buscador">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Buscar estudiante, correo o reto..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />

                        {busqueda && (
                            <button
                                onClick={() => setBusqueda('')}
                                title="Limpiar búsqueda"
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >

                        <option value="TODOS">Todos los estados</option>

                        <option value="FINALIZADA">Finalizadas</option>

                        <option value="ACTIVA">Activas</option>

                    </select>

                </div>

                {/* TABLA */}

                <div className="rd-tabla-contenedor">

                    <table className="rd-tabla">

                        <thead>

                            <tr>
                                <th>ESTUDIANTE</th>
                                <th>RETO ACADÉMICO</th>
                                <th>FECHA</th>
                                <th>ESTADO</th>
                                <th>EVALUADO POR</th>
                                <th>DETALLE</th>
                            </tr>

                        </thead>

                        <tbody>

                            {resultadosFiltrados.map((resultado) => (

                                <tr key={resultado.evaluacion_id}>

                                    <td>

                                        <div className="rd-estudiante">

                                            <div className="rd-avatar">
                                                {resultado.nombres?.charAt(0)}
                                                {resultado.apellidos?.charAt(0)}
                                            </div>

                                            <div>

                                                <strong>
                                                    {resultado.nombres} {resultado.apellidos}
                                                </strong>

                                                <small>{resultado.correo}</small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>
                                        <span className="rd-nombre-reto">
                                            {resultado.nombre_reto}
                                        </span>
                                    </td>

                                    <td>
                                        {formatearFecha(resultado.fecha_evaluacion)}
                                    </td>

                                    <td>

                                        <span
                                            className={`rd-estado ${
                                                resultado.estado?.toUpperCase() === 'FINALIZADA'
                                                    ? 'rd-estado-finalizada'
                                                    : 'rd-estado-activa'
                                            }`}
                                        >
                                            {resultado.estado}
                                        </span>

                                    </td>

                                    <td>
                                        <span className="rd-evaluador">
                                            {resultado.evaluado_por || 'IA'}
                                        </span>
                                    </td>

                                    <td>

                                        <button
                                            className="rd-btn-detalle"
                                            onClick={() =>
                                                setResultadoSeleccionado(resultado)
                                            }
                                        >
                                            Ver evaluación →
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {resultadosFiltrados.length === 0 && (

                        <div className="rd-vacio">

                            <span>⌕</span>

                            <h3>No se encontraron resultados</h3>

                            <p>
                                {resultados.length === 0
                                    ? 'Todavía no existen evaluaciones registradas.'
                                    : 'No hay coincidencias con los filtros seleccionados.'}
                            </p>

                        </div>

                    )}

                </div>

            </section>

            {/* DETALLE DE EVALUACIÓN */}

            {resultadoSeleccionado && (

                <div
                    className="rd-modal-fondo"
                    onClick={() => setResultadoSeleccionado(null)}
                >

                    <section
                        className="rd-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <header className="rd-modal-encabezado">

                            <div>

                                <span className="rd-etiqueta">
                                    DETALLE DE EVALUACIÓN
                                </span>

                                <h2>Desempeño del estudiante</h2>

                                <p>
                                    {resultadoSeleccionado.nombres}{' '}
                                    {resultadoSeleccionado.apellidos}
                                </p>

                            </div>

                            <button
                                className="rd-cerrar"
                                onClick={() => setResultadoSeleccionado(null)}
                                aria-label="Cerrar detalle"
                            >
                                ×
                            </button>

                        </header>

                        {/* INFORMACIÓN DEL RETO */}

                        <div className="rd-detalle-info">

                            <div>
                                <span>Reto académico</span>
                                <strong>{resultadoSeleccionado.nombre_reto}</strong>
                            </div>

                            <div>
                                <span>Fecha de evaluación</span>
                                <strong>
                                    {formatearFecha(resultadoSeleccionado.fecha_evaluacion)}
                                </strong>
                            </div>

                            <div>
                                <span>Evaluado por</span>
                                <strong>
                                    {resultadoSeleccionado.evaluado_por || 'IA'}
                                </strong>
                            </div>

                        </div>

                        {/* DIMENSIONES FACIONE */}

                        <div className="rd-dimensiones-encabezado">

                            <div>
                                <h3>Dimensiones del pensamiento crítico</h3>
                                <p>
                                    Evaluación de las seis dimensiones propuestas
                                    por Peter Facione.
                                </p>
                            </div>

                            <span>ESCALA DE 0 A 100</span>

                        </div>

                        <div className="rd-dimensiones">

                            {dimensiones.map((dimension) => {

                                const valor = resultadoSeleccionado[
                                    dimension.campo
                                ];

                                const puntuacion = convertirPuntuacion(valor);

                                return (

                                    <article
                                        className="rd-dimension"
                                        key={dimension.campo}
                                    >

                                        <div className="rd-dimension-superior">

                                            <div className="rd-dimension-titulo">

                                                <span className="rd-dimension-inicial">
                                                    {dimension.inicial}
                                                </span>

                                                <div>
                                                    <strong>{dimension.nombre}</strong>
                                                    <small>{dimension.descripcion}</small>
                                                </div>

                                            </div>

                                            <strong className="rd-puntuacion">
                                                {puntuacion}
                                                <small>/100</small>
                                            </strong>

                                        </div>

                                        <div className="rd-barra-fondo">

                                            <div
                                                className={`rd-barra-progreso ${obtenerClaseNivel(valor)}`}
                                                style={{
                                                    width: `${puntuacion}%`
                                                }}
                                            />

                                        </div>

                                        <span className={`rd-nivel ${obtenerClaseNivel(valor)}`}>
                                            {obtenerNivel(valor)}
                                        </span>

                                    </article>

                                );

                            })}

                        </div>

                        {/* OBSERVACIONES */}

                        <div className="rd-observaciones">

                            <h3>
                                <span>✦</span> Observaciones de Sócrates IA
                            </h3>

                            <p>
                                {resultadoSeleccionado.observaciones?.trim()
                                    || 'No se registraron observaciones para esta evaluación.'}
                            </p>

                        </div>

                        <footer className="rd-modal-footer">

                            <button
                                className="rd-btn-principal"
                                onClick={() => setResultadoSeleccionado(null)}
                            >
                                Cerrar evaluación
                            </button>

                        </footer>

                    </section>

                </div>

            )}

        </div>

    );

}
