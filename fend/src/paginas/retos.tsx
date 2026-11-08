
import { useEffect, useState } from 'react';

import {
    listarRetosPorTema,
    type Reto
} from '../servicios/servicioRetos';

import { crearSesion } from '../servicios/servicioSesiones';

import type { Tema } from './temas';

import Tutor from './tutor';

interface RetosProps {
    tema: Tema;
    usuarioId: string;
    onVolver: () => void;
}

export default function Retos({
    tema,
    usuarioId,
    onVolver
}: RetosProps) {

    const [retos, setRetos] = useState<Reto[]>([]);
    const [sesionId, setSesionId] = useState<string | null>(null);
    const [retoSeleccionado, setRetoSeleccionado] = useState<Reto | null>(null);

    const [cargando, setCargando] = useState(true);
    const [retoIniciandoId, setRetoIniciandoId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    // Resumir descripciones largas para las tarjetas
    const resumirDescripcion = (
        descripcion: string,
        limite = 160
    ) => {

        if (!descripcion) {
            return 'Prepárate para resolver este desafío.';
        }

        if (descripcion.length <= limite) {
            return descripcion;
        }

        return descripcion.substring(0, limite).trimEnd() + '...';

    };

    // Cargar retos del tema seleccionado
    useEffect(() => {

        const cargarRetos = async () => {

            try {

                setCargando(true);
                setError(null);

                const respuesta = await listarRetosPorTema(tema.id);

                setRetos(respuesta.retos || []);

            } catch (error) {

                console.error('Error cargando retos:', error);

                setError('No fue posible cargar los retos.');

            } finally {

                setCargando(false);

            }

        };

        cargarRetos();

    }, [tema.id]);

    // Iniciar una sesión con el reto seleccionado
    const iniciarReto = async (reto: Reto) => {

        try {

            setRetoIniciandoId(reto.id);
            setError(null);

            const respuesta = await crearSesion(
                usuarioId,
                reto.id
            );

            setRetoSeleccionado(reto);
            setSesionId(respuesta.sesion.id);

            console.log(
                'Sesión creada correctamente:',
                respuesta.sesion.id
            );

        } catch (error) {

            console.error('Error al crear sesión:', error);

            setError(
                'No fue posible iniciar el reto. Intenta nuevamente.'
            );

        } finally {

            setRetoIniciandoId(null);

        }

    };

    // Regresar a la selección de retos
    const cambiarReto = () => {

        setSesionId(null);
        setRetoSeleccionado(null);
        setError(null);

    };

    // Mostrar la conversación con el tutor
    if (sesionId && retoSeleccionado) {

        return (

            <div className="socrates-app">

                <header className="socrates-header">

                    <div className="socrates-brand">
                        Sócrates <span>IA</span>
                    </div>

                    <div className="socrates-header-info">
                        Tutor inteligente
                    </div>

                </header>

                <main className="socrates-conversation">

                    <Tutor
                        sesionId={sesionId}
                        retoTitulo={retoSeleccionado.titulo}
                        retoDescripcion={retoSeleccionado.descripcion}
                        onCambiarReto={cambiarReto}
                    />

                </main>

            </div>

        );

    }

    return (

        <div className="socrates-app">

            <header className="socrates-header">

                <div className="socrates-brand">
                    Sócrates <span>IA</span>
                </div>

                <div className="socrates-header-info">
                    Espacio de aprendizaje
                </div>

            </header>

            <main className="socrates-welcome">

                <button
                    className="materias-volver"
                    onClick={onVolver}
                >
                    ← Volver a temas
                </button>

                <div className="socrates-symbol">
                    ✦
                </div>

                <h1>
                    Elige tu próximo desafío
                </h1>

                <p>
                    Estás explorando los retos de <strong>{tema.nombre}</strong>.
                    Selecciona uno para poner a prueba tus conocimientos,
                    cuestionar tus ideas y desarrollar tu razonamiento.
                </p>

                {cargando && (

                    <div className="materias-estado">
                        Cargando retos...
                    </div>

                )}

                {error && (

                    <p className="socrates-error">
                        {error}
                    </p>

                )}

                {!cargando && !error && retos.length === 0 && (

                    <div className="materias-estado">
                        No hay retos disponibles para este tema.
                    </div>

                )}

                {!cargando && retos.length > 0 && (

                    <div className="socrates-retos-grid">

                        {retos.map((reto) => (

                            <article
                                className="socrates-reto-card"
                                key={reto.id}
                            >

                                <span className="socrates-reto-dificultad">
                                    {reto.dificultad}
                                </span>

                                <h2>
                                    {reto.titulo}
                                </h2>

                                <p className="socrates-reto-descripcion">
                                    {resumirDescripcion(reto.descripcion)}
                                </p>

                                <button
                                    className="socrates-start"
                                    onClick={() => iniciarReto(reto)}
                                    disabled={retoIniciandoId !== null}
                                >

                                    {retoIniciandoId === reto.id
                                        ? 'Preparando reto...'
                                        : 'Iniciar reto →'
                                    }

                                </button>

                            </article>

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

}
