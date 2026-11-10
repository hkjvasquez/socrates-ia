
import { useState } from 'react';

import Login from './paginas/Login';
import Materias from './paginas/materias';
import Temas from './paginas/temas';
import Retos from './paginas/retos';
import EvaluacionCognitiva from './paginas/evaluacionCognitiva';
import Resultados from './paginas/Resultados';
import GestionEstudiantes from './paginas/GestionEstudiantes';
import ResultadosDocente from './paginas/ResultadosDocente';

import type { UsuarioAutenticado } from './servicios/servicioAuth';
import type { Materia } from './servicios/servicioMateria';
import type { Tema } from './paginas/temas';

type Seccion =
    | 'inicio'
    | 'materias'
    | 'evaluacion'
    | 'resultados'
    | 'estudiantes'
    | 'gestionMaterias'
    | 'progreso'
    | 'historial'
    | 'perfil';

interface OpcionMenu {
    id: Seccion;
    icono: string;
    nombre: string;
}

function App() {

    // ==========================================
    // USUARIO AUTENTICADO
    // ==========================================

    const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => {

        const usuarioGuardado = localStorage.getItem('usuario');

        return usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;

    });

    const [seccion, setSeccion] = useState<Seccion>('inicio');

    const [materiaSeleccionada, setMateriaSeleccionada] =
        useState<Materia | null>(null);

    const [temaSeleccionado, setTemaSeleccionado] =
        useState<Tema | null>(null);

    const [sesionResultadoId, setSesionResultadoId] =
        useState<string | null>(null);


    // ==========================================
    // IDENTIFICAR ROL
    // ==========================================

    const rolUsuario = usuario?.rol?.toUpperCase();

    const esDocente = rolUsuario === 'DOCENTE';

    const esEstudiante = rolUsuario === 'ESTUDIANTE';


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const cerrarSesion = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setUsuario(null);
        setMateriaSeleccionada(null);
        setTemaSeleccionado(null);
        setSesionResultadoId(null);
        setSeccion('inicio');

    };


    // ==========================================
    // NAVEGACIÓN SEGÚN EL ROL
    // ==========================================

    const navegar = (destino: Seccion) => {

        // El estudiante no puede acceder a secciones docentes.
        if (
            esEstudiante &&
            ['estudiantes', 'gestionMaterias'].includes(destino)
        ) {
            return;
        }

        // El docente no utiliza el flujo de tutoría del estudiante.
        if (
            esDocente &&
            ['materias', 'evaluacion', 'progreso', 'historial'].includes(destino)
        ) {
            return;
        }

        setMateriaSeleccionada(null);
        setTemaSeleccionado(null);

        setSeccion(destino);

    };


    // ==========================================
    // FINALIZACIÓN DEL RETO
    // ==========================================

    const manejarRetoFinalizado = (sesionId: string) => {

        setSesionResultadoId(sesionId);
        setSeccion('resultados');

    };


    // ==========================================
    // REGRESAR DESDE RESULTADOS
    // ==========================================

    const volverDesdeResultados = () => {

        setMateriaSeleccionada(null);
        setTemaSeleccionado(null);

        setSeccion('materias');

    };


    // ==========================================
    // VALIDAR USUARIO
    // ==========================================

    if (!usuario) {

        return (
            <Login onLoginExitoso={setUsuario} />
        );

    }


    // ==========================================
    // VALIDAR ROL RECONOCIDO
    // ==========================================

    if (!esDocente && !esEstudiante) {

        return (

            <main className="login-container">

                <div className="login-card">

                    <div className="login-logo">
                        Sócrates <span>IA</span>
                    </div>

                    <h1>Acceso no autorizado</h1>

                    <p>
                        No se pudo reconocer el rol de tu usuario.
                        Comunícate con el administrador del sistema.
                    </p>

                    <button onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>

                </div>

            </main>

        );

    }


    // ==========================================
    // MENÚ DEL ESTUDIANTE
    // ==========================================

    const menuEstudiante: OpcionMenu[] = [

        { id: 'inicio', icono: '⌂', nombre: 'Inicio' },

        { id: 'materias', icono: '▤', nombre: 'Materias' },

        { id: 'evaluacion', icono: '◈', nombre: 'Evaluación cognitiva' },

        { id: 'perfil', icono: '♙', nombre: 'Mi perfil' }

    ];


    // ==========================================
    // MENÚ DEL DOCENTE
    // ==========================================

    const menuDocente: OpcionMenu[] = [

        { id: 'inicio', icono: '⌂', nombre: 'Inicio' },

        { id: 'estudiantes', icono: '♙', nombre: 'Estudiantes' },

        { id: 'resultados', icono: '◉', nombre: 'Resultados académicos' },

        { id: 'gestionMaterias', icono: '▤', nombre: 'Gestión académica' },

        { id: 'perfil', icono: '⚙', nombre: 'Mi perfil' }

    ];


    const opcionesMenu = esDocente
        ? menuDocente
        : menuEstudiante;


    // ==========================================
    // PÁGINAS PENDIENTES DEL DOCENTE
    // ==========================================

    const mostrarPaginaDocente = () => {

        const paginas: Partial<
            Record<Seccion, { titulo: string; descripcion: string }>
        > = {

            estudiantes: {

                titulo: 'Gestión de estudiantes',

                descripcion:
                    'Consulta los estudiantes registrados en Sócrates IA y realiza el seguimiento de su participación en las actividades de aprendizaje.'

            },

            resultados: {

                titulo: 'Resultados académicos',

                descripcion:
                    'Consulta las evaluaciones de pensamiento crítico, las dimensiones de Facione y el desempeño de los estudiantes.'

            },

            gestionMaterias: {

                titulo: 'Gestión académica',

                descripcion:
                    'Administra las materias, los temas y los retos que estarán disponibles para los estudiantes.'

            },

            perfil: {

                titulo: 'Mi perfil',

                descripcion:
                    'Aquí podrás consultar y administrar tu información personal.'

            }

        };

        const pagina = paginas[seccion];

        if (!pagina) {
            return null;
        }

        return (

            <section className="menu-pagina">

                <span className="menu-etiqueta">
                    ESPACIO DEL DOCENTE
                </span>

                <h1>{pagina.titulo}</h1>

                <p>{pagina.descripcion}</p>

                <div className="menu-construccion">

                    <span>✦</span>

                    <h2>Espacio en preparación</h2>

                    <p>
                        Este módulo se implementará en la siguiente
                        etapa de desarrollo de Sócrates IA.
                    </p>

                </div>

            </section>

        );

    };


    // ==========================================
    // MOSTRAR CONTENIDO
    // ==========================================

    const mostrarContenido = () => {

        // --------------------------------------
        // INICIO DEL DOCENTE
        // --------------------------------------

        if (esDocente && seccion === 'inicio') {

            return (

                <section className="menu-inicio">

                    <span className="menu-etiqueta">
                        ESPACIO DE GESTIÓN DOCENTE
                    </span>

                    <h1>
                        ¡Bienvenido a Sócrates IA!
                    </h1>

                    <p>
                        Supervisa el aprendizaje, consulta los resultados
                        y acompaña el desarrollo del pensamiento crítico
                        de tus estudiantes.
                    </p>

                    <div className="menu-inicio-tarjeta">

                        <div>

                            <span className="menu-tarjeta-icono">
                                ✦
                            </span>

                            <h2>Panel del docente</h2>

                            <p>
                                Accede a la información académica y
                                próximamente podrás consultar el avance
                                de tus estudiantes.
                            </p>

                        </div>

                        <button
                            className="menu-boton-principal"
                            onClick={() => navegar('estudiantes')}
                        >
                            Consultar estudiantes →
                        </button>

                    </div>

                </section>

            );

        }


        // --------------------------------------
        // INICIO DEL ESTUDIANTE
        // --------------------------------------

        if (esEstudiante && seccion === 'inicio') {

            return (

                <section className="menu-inicio">

                    <span className="menu-etiqueta">
                        TU ESPACIO DE APRENDIZAJE
                    </span>

                    <h1>
                        ¡Bienvenido a Sócrates IA!
                    </h1>

                    <p>
                        Aprende, cuestiona tus ideas y desarrolla
                        tu pensamiento crítico mediante el diálogo.
                    </p>

                    <div className="menu-inicio-tarjeta">

                        <div>

                            <span className="menu-tarjeta-icono">
                                ✦
                            </span>

                            <h2>Comienza a aprender</h2>

                            <p>
                                Explora tus materias, descubre nuevos temas
                                y resuelve desafíos con tu tutor inteligente.
                            </p>

                        </div>

                        <button
                            className="menu-boton-principal"
                            onClick={() => navegar('materias')}
                        >
                            Explorar materias →
                        </button>

                    </div>

                </section>

            );

        }


        // --------------------------------------
        // RESULTADOS
        // --------------------------------------

        if (seccion === 'resultados') {

            // El docente consulta todos los resultados académicos.

            if (esDocente) {
                return <ResultadosDocente />;
            }

            // El estudiante consulta su evaluación
            // inmediatamente después de finalizar el reto.

            if (!sesionResultadoId) {

                return (

                    <section className="menu-pagina">

                        <span className="menu-etiqueta">
                            SÓCRATES IA
                        </span>

                        <h1>Resultados</h1>

                        <div className="menu-construccion">

                            <span>✦</span>

                            <h2>Aún no tienes resultados</h2>

                            <p>
                                Cuando finalices un reto con Sócrates IA,
                                tu evaluación aparecerá en este espacio.
                            </p>

                            <button
                                className="menu-boton-principal"
                                onClick={() => navegar('materias')}
                            >
                                Comenzar a aprender →
                            </button>

                        </div>

                    </section>

                );

            }

            return (

                <Resultados
                    sesionId={sesionResultadoId}
                    onVolver={volverDesdeResultados}
                />

            );

        }


        // --------------------------------------
        // ESPACIOS DEL DOCENTE
        // --------------------------------------

        if (esDocente) {
            if (seccion === 'estudiantes') {
                return <GestionEstudiantes />;
            }

            return mostrarPaginaDocente();
        }


        // --------------------------------------
        // MATERIAS, TEMAS Y RETOS DEL ESTUDIANTE
        // --------------------------------------

        if (seccion === 'materias') {

            if (materiaSeleccionada && temaSeleccionado) {

                return (

                    <Retos
                        tema={temaSeleccionado}
                        usuarioId={usuario.id}
                        onVolver={() => setTemaSeleccionado(null)}
                        onFinalizarReto={manejarRetoFinalizado}
                    />

                );

            }

            if (materiaSeleccionada) {

                return (

                    <Temas
                        materia={materiaSeleccionada}
                        onSeleccionarTema={setTemaSeleccionado}
                        onVolver={() => setMateriaSeleccionada(null)}
                    />

                );

            }

            return (

                <Materias
                    onSeleccionarMateria={setMateriaSeleccionada}
                />

            );

        }


        // --------------------------------------
        // EVALUACIÓN COGNITIVA
        // --------------------------------------

        if (seccion === 'evaluacion') {

            return <EvaluacionCognitiva />;

        }


        // --------------------------------------
        // PÁGINAS PENDIENTES DEL ESTUDIANTE
        // --------------------------------------

        const paginasEstudiante: Partial<
            Record<Seccion, { titulo: string; descripcion: string }>
        > = {

            perfil: {

                titulo: 'Mi perfil',

                descripcion:
                    'Aquí podrás consultar y administrar tu información personal.'

            }

        };

        const pagina = paginasEstudiante[seccion];

        if (!pagina) {
            return null;
        }

        return (

            <section className="menu-pagina">

                <span className="menu-etiqueta">
                    SÓCRATES IA
                </span>

                <h1>{pagina.titulo}</h1>

                <p>{pagina.descripcion}</p>

                <div className="menu-construccion">

                    <span>✦</span>

                    <h2>Estamos preparando este espacio</h2>

                    <p>
                        Próximamente tendrás aquí información
                        relacionada con tu aprendizaje.
                    </p>

                </div>

            </section>

        );

    };


    // ==========================================
    // INTERFAZ PRINCIPAL
    // ==========================================

    return (

        <div className="socrates-layout">

            <aside className="menu-sidebar">

                <div className="menu-logo">

                    Sócrates <span>IA</span>

                    <small>
                        PLATAFORMA DE APRENDIZAJE
                    </small>

                </div>

                <div className="menu-separador" />

                <span className="menu-seccion-titulo">
                    {esDocente ? 'MENÚ DOCENTE' : 'MENÚ PRINCIPAL'}
                </span>

                <nav className="menu-navegacion">

                    {opcionesMenu.map((opcion) => (

                        <button
                            key={opcion.id}
                            className={
                                `menu-opcion ${
                                    seccion === opcion.id
                                        ? 'menu-opcion-activa'
                                        : ''
                                }`
                            }
                            onClick={() => navegar(opcion.id)}
                        >

                            <span className="menu-opcion-icono">
                                {opcion.icono}
                            </span>

                            <span>
                                {opcion.nombre}
                            </span>

                        </button>

                    ))}

                </nav>

                <div className="menu-sidebar-inferior">

                    <div className="menu-usuario">

                        <div className="menu-avatar">

                            {(usuario.nombres || 'U')
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div className="menu-usuario-info">

                            <strong>
                                {usuario.nombres}
                            </strong>

                            <span>
                                {esDocente ? 'Docente' : 'Estudiante'}
                            </span>

                        </div>

                    </div>

                    <button
                        className="menu-cerrar-sesion"
                        onClick={cerrarSesion}
                    >

                        <span>↪</span>

                        Cerrar sesión

                    </button>

                </div>

            </aside>

            <main className="menu-contenido">

                {mostrarContenido()}

            </main>

        </div>

    );

}

export default App;
