
import { useState } from 'react';

import Login from './paginas/Login';
import Materias from './paginas/materias';
import Temas from './paginas/temas';
import Retos from './paginas/retos';
import EvaluacionCognitiva from './paginas/evaluacionCognitiva';

import type { UsuarioAutenticado } from './servicios/servicioAuth';
import type { Materia } from './servicios/servicioMateria';
import type { Tema } from './paginas/temas';

type Seccion =
    | 'inicio'
    | 'materias'
    | 'evaluacion'
    | 'progreso'
    | 'historial'
    | 'perfil';

function App() {

    const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    });

    const [seccion, setSeccion] = useState<Seccion>('inicio');

    const [materiaSeleccionada, setMateriaSeleccionada] =
        useState<Materia | null>(null);

    const [temaSeleccionado, setTemaSeleccionado] =
        useState<Tema | null>(null);

    const cerrarSesion = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setUsuario(null);
        setMateriaSeleccionada(null);
        setTemaSeleccionado(null);
        setSeccion('inicio');

    };

    const navegar = (destino: Seccion) => {

        setMateriaSeleccionada(null);
        setTemaSeleccionado(null);
        setSeccion(destino);

    };

    if (!usuario) {
        return <Login onLoginExitoso={setUsuario} />;
    }

    const opcionesMenu: {
        id: Seccion;
        icono: string;
        nombre: string;
    }[] = [
        { id: 'inicio', icono: '⌂', nombre: 'Inicio' },
        { id: 'materias', icono: '▤', nombre: 'Materias' },
        { id: 'evaluacion', icono: '◈', nombre: 'Evaluación cognitiva' },
        { id: 'progreso', icono: '▥', nombre: 'Mi progreso' },
        { id: 'historial', icono: '◷', nombre: 'Historial' },
        { id: 'perfil', icono: '♙', nombre: 'Mi perfil' }
    ];

    const mostrarContenido = () => {

        if (seccion === 'materias') {

            if (materiaSeleccionada && temaSeleccionado) {

                return (
                    <Retos
                        tema={temaSeleccionado}
                        usuarioId={usuario.id}
                        onVolver={() => setTemaSeleccionado(null)}
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

        if (seccion === 'evaluacion') {
            return <EvaluacionCognitiva />;
        }

        if (seccion === 'inicio') {

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
                            <span className="menu-tarjeta-icono">✦</span>
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

        const paginas: Record<
            Exclude<Seccion, 'inicio' | 'materias' | 'evaluacion'>,
            { titulo: string; descripcion: string }
        > = {
            progreso: {
                titulo: 'Mi progreso',
                descripcion:
                    'Aquí podrás visualizar tu avance de aprendizaje y el desarrollo de tus habilidades.'
            },
            historial: {
                titulo: 'Historial de aprendizaje',
                descripcion:
                    'Aquí podrás consultar tus sesiones de tutoría y las actividades que has realizado.'
            },
            perfil: {
                titulo: 'Mi perfil',
                descripcion:
                    'Aquí podrás consultar y administrar tu información personal.'
            }
        };

        const pagina = paginas[seccion];

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

    return (

        <div className="socrates-layout">

            <aside className="menu-sidebar">

                <div className="menu-logo">
                    Sócrates <span>IA</span>
                    <small>PLATAFORMA DE APRENDIZAJE</small>
                </div>

                <div className="menu-separador" />

                <span className="menu-seccion-titulo">
                    MENÚ PRINCIPAL
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

                            <span>{opcion.nombre}</span>

                        </button>

                    ))}

                </nav>

                <div className="menu-sidebar-inferior">

                    <div className="menu-usuario">

                        <div className="menu-avatar">
                            {(usuario.nombres || 'E').charAt(0).toUpperCase()}
                        </div>

                        <div className="menu-usuario-info">
                            <strong>
                                {usuario.nombres}
                            </strong>
                            <span>Estudiante</span>
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
