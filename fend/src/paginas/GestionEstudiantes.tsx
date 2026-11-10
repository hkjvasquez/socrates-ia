import { useMemo, useState } from 'react';
import './GestionEstudiantes.css';

type EstadoEstudiante = 'Activo' | 'Inactivo';

type EstudianteDemo = {
    id: number;
    iniciales: string;
    nombre: string;
    correo: string;
    estado: EstadoEstudiante;
    retosCompletados: number;
    sesiones: number;
    ultimaActividad: string;
    materia: string;
    grado: string;
};

// Datos ficticios para construir y probar la interfaz. Cada valor individual es <= 3.
const estudiantesDemo: EstudianteDemo[] = [
    {
        id: 1,
        iniciales: 'AM',
        nombre: 'Ana Lucía Morales Pérez',
        correo: 'ana.morales@ejemplo.edu.gt',
        estado: 'Activo',
        retosCompletados: 3,
        sesiones: 3,
        ultimaActividad: 'Hoy',
        materia: 'Matemática',
        grado: 'Segundo básico'
    },
    {
        id: 2,
        iniciales: 'CL',
        nombre: 'Carlos Daniel López García',
        correo: 'carlos.lopez@ejemplo.edu.gt',
        estado: 'Activo',
        retosCompletados: 2,
        sesiones: 2,
        ultimaActividad: 'Ayer',
        materia: 'Comunicación y Lenguaje',
        grado: 'Primero básico'
    },
    {
        id: 3,
        iniciales: 'MR',
        nombre: 'María Fernanda Reyes Cruz',
        correo: 'maria.reyes@ejemplo.edu.gt',
        estado: 'Inactivo',
        retosCompletados: 1,
        sesiones: 1,
        ultimaActividad: 'Hace 3 días',
        materia: 'Matemática',
        grado: 'Tercero básico'
    }
];

export default function GestionEstudiantes() {
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoEstudiante>('Todos');
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<EstudianteDemo | null>(null);

    const estudiantesFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLocaleLowerCase();
        return estudiantesDemo.filter((estudiante) => {
            const coincideTexto =
                estudiante.nombre.toLocaleLowerCase().includes(termino) ||
                estudiante.correo.toLocaleLowerCase().includes(termino);
            const coincideEstado = filtroEstado === 'Todos' || estudiante.estado === filtroEstado;
            return coincideTexto && coincideEstado;
        });
    }, [busqueda, filtroEstado]);

    const totalEstudiantes = estudiantesDemo.length;
    const activos = estudiantesDemo.filter((e) => e.estado === 'Activo').length;
    const promedioRetos = (estudiantesDemo.reduce((suma, e) => suma + e.retosCompletados, 0) / totalEstudiantes).toFixed(1);
    const promedioSesiones = (estudiantesDemo.reduce((suma, e) => suma + e.sesiones, 0) / totalEstudiantes).toFixed(1);

    return (
        <main className="gestion-estudiantes">
            <header className="ge-encabezado">
                <div>
                    <div className="ge-marca"><span /> SÓCRATES IA <i>/</i> PANEL DOCENTE</div>
                    <h1>Gestión de estudiantes</h1>
                    <p>Administra el directorio y consulta la actividad académica de tus estudiantes.</p>
                </div>
                <div className="ge-demo"><span /> ENTORNO DE DEMOSTRACIÓN</div>
            </header>

            <section className="ge-indicadores" aria-label="Resumen académico">
                <article className="ge-indicador">
                    <div className="ge-indicador-top"><span className="ge-icono">♙</span><span className="ge-tag">DIRECTORIO</span></div>
                    <strong>{totalEstudiantes}</strong>
                    <h2>Estudiantes registrados</h2>
                    <p>Perfiles de ejemplo disponibles</p>
                </article>
                <article className="ge-indicador">
                    <div className="ge-indicador-top"><span className="ge-icono ge-verde">✓</span><span className="ge-tag">ESTADO</span></div>
                    <strong>{activos}</strong>
                    <h2>Estudiantes activos</h2>
                    <p>Cuentas habilitadas</p>
                </article>
                <article className="ge-indicador">
                    <div className="ge-indicador-top"><span className="ge-icono ge-azul">◎</span><span className="ge-tag">APRENDIZAJE</span></div>
                    <strong>{promedioRetos}</strong>
                    <h2>Promedio de retos</h2>
                    <p>Por estudiante · máximo individual: 3</p>
                </article>
                <article className="ge-indicador">
                    <div className="ge-indicador-top"><span className="ge-icono ge-violeta">↗</span><span className="ge-tag">TUTORÍA</span></div>
                    <strong>{promedioSesiones}</strong>
                    <h2>Promedio de sesiones</h2>
                    <p>Por estudiante · máximo individual: 3</p>
                </article>
            </section>

            <section className="ge-directorio">
                <div className="ge-directorio-cabecera">
                    <div>
                        <span className="ge-overline">COMUNIDAD ACADÉMICA</span>
                        <h2>Directorio estudiantil</h2>
                        <p>Busca estudiantes y revisa su actividad en Sócrates IA.</p>
                    </div>
                    <span className="ge-total">{estudiantesFiltrados.length} DE {totalEstudiantes} ESTUDIANTES</span>
                </div>

                <div className="ge-controles">
                    <label className="ge-busqueda">
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre o correo..."
                            aria-label="Buscar por nombre o correo"
                        />
                        {busqueda && <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">×</button>}
                    </label>
                    <label className="ge-filtro-label">
                        <span>Estado</span>
                        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoEstudiante)}>
                            <option value="Todos">Todos</option>
                            <option value="Activo">Activos</option>
                            <option value="Inactivo">Inactivos</option>
                        </select>
                    </label>
                </div>

                <div className="ge-tabla-wrap">
                    <table className="ge-tabla">
                        <thead><tr>
                            <th>ESTUDIANTE</th><th>ESTADO</th><th>RETOS</th><th>SESIONES</th><th>ÚLTIMA ACTIVIDAD</th><th>PERFIL</th>
                        </tr></thead>
                        <tbody>
                            {estudiantesFiltrados.map((estudiante) => (
                                <tr key={estudiante.id}>
                                    <td><div className="ge-persona"><span className="ge-avatar">{estudiante.iniciales}</span><span><b>{estudiante.nombre}</b><small>{estudiante.correo}</small></span></div></td>
                                    <td><span className={`ge-estado ${estudiante.estado === 'Activo' ? 'is-activo' : 'is-inactivo'}`}><i />{estudiante.estado}</span></td>
                                    <td><span className="ge-numero">{estudiante.retosCompletados}</span></td>
                                    <td><span className="ge-numero">{estudiante.sesiones}</span></td>
                                    <td className="ge-actividad">{estudiante.ultimaActividad}</td>
                                    <td><button className="ge-ver-perfil" type="button" onClick={() => setEstudianteSeleccionado(estudiante)}>Ver perfil <span>↗</span></button></td>
                                </tr>
                            ))}
                            {estudiantesFiltrados.length === 0 && <tr><td className="ge-vacio" colSpan={6}>No se encontraron estudiantes con esos criterios.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <footer className="ge-pie-tabla"><span>Mostrando {estudiantesFiltrados.length} registros de demostración</span><span>Directorio académico <b>·</b> Sócrates IA</span></footer>
            </section>

            <aside className="ge-aviso"><span>i</span><p><b>Datos de demostración.</b> Esta pantalla utiliza información ficticia. Los indicadores muestran promedios y actividad; no representan evaluaciones cognitivas. La conexión con los registros reales se realizará en una siguiente etapa.</p></aside>

            {estudianteSeleccionado && (
                <div className="ge-modal-fondo" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setEstudianteSeleccionado(null); }}>
                    <section className="ge-perfil-modal" role="dialog" aria-modal="true" aria-labelledby="ge-perfil-titulo">
                        <button className="ge-cerrar" type="button" onClick={() => setEstudianteSeleccionado(null)} aria-label="Cerrar perfil">×</button>
                        <span className="ge-overline">FICHA DEL ESTUDIANTE</span>
                        <div className="ge-perfil-identidad"><span className="ge-avatar ge-avatar-grande">{estudianteSeleccionado.iniciales}</span><div><h2 id="ge-perfil-titulo">{estudianteSeleccionado.nombre}</h2><p>{estudianteSeleccionado.correo}</p><span className={`ge-estado ${estudianteSeleccionado.estado === 'Activo' ? 'is-activo' : 'is-inactivo'}`}><i />{estudianteSeleccionado.estado}</span></div></div>
                        <div className="ge-perfil-datos">
                            <div><small>GRADO</small><b>{estudianteSeleccionado.grado}</b></div>
                            <div><small>MATERIA RECIENTE</small><b>{estudianteSeleccionado.materia}</b></div>
                            <div><small>RETOS COMPLETADOS</small><b>{estudianteSeleccionado.retosCompletados} de 3</b></div>
                            <div><small>SESIONES DE TUTORÍA</small><b>{estudianteSeleccionado.sesiones} de 3</b></div>
                            <div><small>ÚLTIMA ACTIVIDAD</small><b>{estudianteSeleccionado.ultimaActividad}</b></div>
                        </div>
                        <p className="ge-perfil-nota">La ficha detallada y el historial de resultados se habilitarán al conectar este módulo con los servicios del sistema.</p>
                        <button className="ge-boton-cerrar" type="button" onClick={() => setEstudianteSeleccionado(null)}>Cerrar ficha</button>
                    </section>
                </div>
            )}
        </main>
    );
}
