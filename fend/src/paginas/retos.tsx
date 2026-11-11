
import { useEffect, useState } from 'react';

import {
    listarRetosPorTema,
    type Reto
} from '../servicios/servicioRetos';

import { crearSesion } from '../servicios/servicioSesiones';

import type { EvaluacionFacione } from '../servicios/servicioResultados';

import type { Tema } from './temas';

import Tutor from './tutor';

interface ResultadoRetoFinalizado {
    sesionId: string;
    evaluacion: EvaluacionFacione;
    retoTitulo: string;
    retoDescripcion: string;
}

interface RetosProps {
    tema: Tema;
    usuarioId: string;
    onVolver: () => void;
    onFinalizarReto: (resultado: ResultadoRetoFinalizado) => void;
}

export default function Retos({
    tema,
    onVolver,
    onFinalizarReto
}: RetosProps) {

    const [retos, setRetos] = useState<Reto[]>([]);
    const [sesionId, setSesionId] = useState<string | null>(null);
    const [intentoId, setIntentoId] = useState<string | null>(null);

    const [retoSeleccionado, setRetoSeleccionado] =
        useState<Reto | null>(null);

    const [cargando, setCargando] = useState(true);

    const [retoIniciandoId, setRetoIniciandoId] =
        useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);


    // ==========================================
    // RESUMIR DESCRIPCIONES LARGAS
    // ==========================================

    const resumirDescripcion = (
        descripcion: string,
        limite = 160
    ): string => {

        if (!descripcion) {
            return 'Prepárate para resolver este desafío.';
        }

        if (descripcion.length <= limite) {
            return descripcion;
        }

        return descripcion.substring(0, limite).trimEnd() + '...';

    };


    // ==========================================
    // CARGAR RETOS DEL TEMA
    // ==========================================

    useEffect(() => {

        const cargarRetos = async () => {

            try {

                setCargando(true);
                setError(null);

                const respuesta =
                    await listarRetosPorTema(tema.id);

                setRetos(respuesta.retos || []);

            } catch (error) {

                console.error(
                    'Error cargando retos:',
                    error
                );

                setError(
                    'No fue posible cargar los retos.'
                );

            } finally {

                setCargando(false);

            }

        };

        cargarRetos();

    }, [tema.id]);


    // ==========================================
    // CREAR SESIÓN E INTENTO
    // ==========================================

    const iniciarReto = async (reto: Reto) => {

        try {

            setRetoIniciandoId(reto.id);
            setError(null);

            const respuesta =
                await crearSesion(reto.id);

            const nuevaSesionId =
                respuesta.sesionId ??
                respuesta.sesion?.id;

            const nuevoIntentoId =
                respuesta.intentoId ??
                respuesta.sesion?.intentoId;

            if (
                respuesta.exito !== true ||
                !nuevaSesionId ||
                !nuevoIntentoId
            ) {

                console.error(
                    'Respuesta del servidor:',
                    respuesta
                );

                throw new Error(
                    'El servidor no devolvió correctamente el ID de sesión o intento.'
                );

            }

            setSesionId(nuevaSesionId);
            setIntentoId(nuevoIntentoId);
            setRetoSeleccionado(reto);

            console.log('Sesión:', nuevaSesionId);
            console.log('Intento:', nuevoIntentoId);

        } catch (error) {

            console.error(
                'Error al iniciar reto:',
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible iniciar el reto.'
            );

        } finally {

            setRetoIniciandoId(null);

        }

    };


    // ==========================================
    // RECIBIR RESULTADO DEL TUTOR
    // ==========================================

    const manejarRetoFinalizado = (resultado: {
        sesionId: string;
        evaluacion: EvaluacionFacione;
    }) => {

        if (!retoSeleccionado) {
            console.error(
                'No se encontró el reto asociado al resultado.'
            );
            return;
        }

        onFinalizarReto({

            sesionId: resultado.sesionId,

            evaluacion: resultado.evaluacion,

            retoTitulo: retoSeleccionado.titulo,

            retoDescripcion: retoSeleccionado.descripcion

        });

    };


    // ==========================================
    // REGRESAR A LA SELECCIÓN DE RETOS
    // ==========================================

    const cambiarReto = () => {

        setSesionId(null);
        setIntentoId(null);
        setRetoSeleccionado(null);
        setError(null);

    };


    // ==========================================
    // MOSTRAR TUTOR
    // ==========================================

    if (
        sesionId !== null &&
        intentoId !== null &&
        retoSeleccionado !== null
    ) {

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
                        intentoId={intentoId}
                        retoTitulo={retoSeleccionado.titulo}
                        retoDescripcion={retoSeleccionado.descripcion}
                        onCambiarReto={cambiarReto}
                        onRetoFinalizado={manejarRetoFinalizado}
                    />

                </main>

            </div>

        );

    }


    // ==========================================
    // MOSTRAR LISTADO DE RETOS
    // ==========================================

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
                    Estás explorando los retos de{' '}
                    <strong>{tema.nombre}</strong>.
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
