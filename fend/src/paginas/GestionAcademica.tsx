
import { useState } from 'react';
import type { FormEvent } from 'react';
import './GestionAcademica.css';

import { crearEstudiante } from '../servicios/servicioUsuarios';

type ModuloAcademico =
    | 'estudiantes'
    | 'materias'
    | 'temas'
    | 'retos';

interface OpcionAcademica {
    id: ModuloAcademico;
    numero: string;
    icono: string;
    titulo: string;
    descripcion: string;
    detalle: string;
}

const opcionesAcademicas: OpcionAcademica[] = [
    {
        id: 'estudiantes',
        numero: '01',
        icono: '♙',
        titulo: 'Estudiantes',
        descripcion: 'Registro y administración de cuentas estudiantiles.',
        detalle: 'Crea cuentas de acceso para los estudiantes y administra su incorporación a Sócrates IA.'
    },
    {
        id: 'materias',
        numero: '02',
        icono: '▤',
        titulo: 'Materias',
        descripcion: 'Organización de las asignaturas académicas.',
        detalle: 'Crea y administra las materias que estarán disponibles en la plataforma.'
    },
    {
        id: 'temas',
        numero: '03',
        icono: '▧',
        titulo: 'Temas',
        descripcion: 'Estructuración de contenidos por materia.',
        detalle: 'Organiza los contenidos y temas que conformarán cada materia.'
    },
    {
        id: 'retos',
        numero: '04',
        icono: '✧',
        titulo: 'Retos socráticos',
        descripcion: 'Diseño de actividades para el aprendizaje.',
        detalle: 'Crea desafíos que permitan desarrollar el pensamiento crítico y el razonamiento.'
    }
];

function GestionAcademica() {
    const [moduloSeleccionado, setModuloSeleccionado] =
        useState<ModuloAcademico | null>(null);

    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] =
        useState<'exito' | 'error' | ''>('');

    const moduloActual = opcionesAcademicas.find(
        (opcion) => opcion.id === moduloSeleccionado
    );

    function limpiarFormulario() {
        setNombres('');
        setApellidos('');
        setCorreo('');
        setContrasena('');
        setConfirmarContrasena('');
    }

    async function registrarEstudiante(
        evento: FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        setMensaje('');
        setTipoMensaje('');

        if (
            !nombres.trim() ||
            !apellidos.trim() ||
            !correo.trim() ||
            !contrasena ||
            !confirmarContrasena
        ) {
            setMensaje('Todos los campos son obligatorios.');
            setTipoMensaje('error');
            return;
        }

        if (contrasena.length < 8) {
            setMensaje('La contraseña debe tener al menos 8 caracteres.');
            setTipoMensaje('error');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            setMensaje('Las contraseñas no coinciden.');
            setTipoMensaje('error');
            return;
        }

        try {
            setCargando(true);

            const respuesta = await crearEstudiante({
                nombres: nombres.trim(),
                apellidos: apellidos.trim(),
                correo: correo.trim().toLowerCase(),
                contrasena
            });

            setMensaje(
                respuesta.mensaje || 'Estudiante registrado correctamente.'
            );

            setTipoMensaje('exito');
            limpiarFormulario();

        } catch (error: unknown) {
            let mensajeError =
                'No fue posible registrar al estudiante.';

            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
            ) {
                const errorApi = error as {
                    response?: {
                        data?: {
                            mensaje?: string;
                        };
                    };
                };

                mensajeError =
                    errorApi.response?.data?.mensaje || mensajeError;
            }

            setMensaje(mensajeError);
            setTipoMensaje('error');

        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="ga-contenedor">

            <header className="ga-encabezado">
                <div>
                    <span className="ga-etiqueta">
                        SÓCRATES IA / PANEL DOCENTE
                    </span>

                    <h1>Gestión académica</h1>

                    <p>
                        Administra los recursos académicos que forman
                        parte del entorno de aprendizaje.
                    </p>
                </div>

                <div className="ga-insignia">
                    <span>✦</span>
                    ADMINISTRACIÓN
                </div>
            </header>

            {!moduloActual ? (
                <>
                    <section className="ga-introduccion">
                        <div className="ga-introduccion-icono">
                            ✦
                        </div>

                        <div>
                            <span>ENTORNO DE ADMINISTRACIÓN</span>
                            <h2>Organiza tu espacio académico</h2>
                            <p>
                                Selecciona el módulo que deseas administrar.
                                Cada sección permitirá gestionar información
                                que utilizarán los estudiantes en Sócrates IA.
                            </p>
                        </div>
                    </section>

                    <section className="ga-modulos">
                        {opcionesAcademicas.map((opcion) => (
                            <button
                                type="button"
                                className="ga-modulo"
                                key={opcion.id}
                                onClick={() =>
                                    setModuloSeleccionado(opcion.id)
                                }
                            >
                                <div className="ga-modulo-superior">
                                    <span className="ga-modulo-numero">
                                        {opcion.numero}
                                    </span>

                                    <span className="ga-modulo-flecha">
                                        ↗
                                    </span>
                                </div>

                                <span className="ga-modulo-icono">
                                    {opcion.icono}
                                </span>

                                <h3>{opcion.titulo}</h3>

                                <p>{opcion.descripcion}</p>

                                <span className="ga-modulo-enlace">
                                    Acceder al módulo
                                    <span> →</span>
                                </span>
                            </button>
                        ))}
                    </section>

                    <footer className="ga-pie">
                        <span>
                            <i />
                            ESPACIO DE ADMINISTRACIÓN DOCENTE
                        </span>

                        <span>SÓCRATES IA · GESTIÓN ACADÉMICA</span>
                    </footer>
                </>
            ) : (
                <section className="ga-modulo-detalle">

                    <button
                        type="button"
                        className="ga-volver"
                        onClick={() => {
                            setModuloSeleccionado(null);
                            setMensaje('');
                            setTipoMensaje('');
                        }}
                    >
                        ← Volver a gestión académica
                    </button>

                    <div className="ga-detalle-contenido">

                        <span className="ga-detalle-icono">
                            {moduloActual.icono}
                        </span>

                        <span className="ga-etiqueta">
                            MÓDULO {moduloActual.numero}
                        </span>

                        <h2>{moduloActual.titulo}</h2>

                        <p>{moduloActual.detalle}</p>

                        {moduloSeleccionado === 'estudiantes' ? (
                            <form
                                className="ga-formulario-estudiante"
                                onSubmit={registrarEstudiante}
                            >
                                <div className="ga-form-encabezado">
                                    <span className="ga-form-etiqueta">
                                        NUEVO REGISTRO
                                    </span>

                                    <h3>Crear cuenta de estudiante</h3>

                                    <p>
                                        Completa los datos para habilitar
                                        el acceso del estudiante a Sócrates IA.
                                    </p>
                                </div>

                                <div className="ga-form-grid">

                                    <div className="ga-form-campo">
                                        <label htmlFor="ga-nombres">
                                            Nombres
                                        </label>

                                        <input
                                            id="ga-nombres"
                                            type="text"
                                            value={nombres}
                                            onChange={(e) =>
                                                setNombres(e.target.value)
                                            }
                                            placeholder="Nombres del estudiante"
                                            maxLength={100}
                                            autoComplete="given-name"
                                            required
                                        />
                                    </div>

                                    <div className="ga-form-campo">
                                        <label htmlFor="ga-apellidos">
                                            Apellidos
                                        </label>

                                        <input
                                            id="ga-apellidos"
                                            type="text"
                                            value={apellidos}
                                            onChange={(e) =>
                                                setApellidos(e.target.value)
                                            }
                                            placeholder="Apellidos del estudiante"
                                            maxLength={100}
                                            autoComplete="family-name"
                                            required
                                        />
                                    </div>

                                    <div className="ga-form-campo ga-form-completo">
                                        <label htmlFor="ga-correo">
                                            Correo electrónico
                                        </label>

                                        <input
                                            id="ga-correo"
                                            type="email"
                                            value={correo}
                                            onChange={(e) =>
                                                setCorreo(e.target.value)
                                            }
                                            placeholder="estudiante@correo.com"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>

                                    <div className="ga-form-campo">
                                        <label htmlFor="ga-contrasena">
                                            Contraseña
                                        </label>

                                        <input
                                            id="ga-contrasena"
                                            type="password"
                                            value={contrasena}
                                            onChange={(e) =>
                                                setContrasena(e.target.value)
                                            }
                                            placeholder="Mínimo 8 caracteres"
                                            minLength={8}
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>

                                    <div className="ga-form-campo">
                                        <label htmlFor="ga-confirmar">
                                            Confirmar contraseña
                                        </label>

                                        <input
                                            id="ga-confirmar"
                                            type="password"
                                            value={confirmarContrasena}
                                            onChange={(e) =>
                                                setConfirmarContrasena(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Repite la contraseña"
                                            minLength={8}
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>

                                </div>

                                {mensaje && (
                                    <div
                                        className={`ga-form-mensaje ga-form-mensaje-${tipoMensaje}`}
                                        role="alert"
                                    >
                                        <span>
                                            {tipoMensaje === 'exito' ? '✓' : '⚠'}
                                        </span>
                                        {mensaje}
                                    </div>
                                )}

                                <div className="ga-form-acciones">
                                    <button
                                        type="submit"
                                        className="ga-form-boton"
                                        disabled={cargando}
                                    >
                                        {cargando
                                            ? 'Registrando estudiante...'
                                            : 'Registrar estudiante →'}
                                    </button>
                                </div>

                                <div className="ga-form-nota">
                                    <span>✦</span>
                                    El sistema asignará automáticamente
                                    el rol de ESTUDIANTE.
                                </div>
                            </form>
                        ) : (
                            <div className="ga-en-preparacion">
                                <span>✦</span>
                                <div>
                                    <strong>Módulo en preparación</strong>
                                    <p>
                                        Aquí incorporaremos las herramientas
                                        de administración y conexión con la
                                        base de datos.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </section>
            )}

        </main>
    );
}

export default GestionAcademica;
