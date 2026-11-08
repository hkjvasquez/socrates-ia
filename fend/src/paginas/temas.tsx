
import { useEffect, useState } from 'react';

import { listarTemas } from '../servicios/servicioMateria';

import type { Materia } from '../servicios/servicioMateria';

export interface Tema {
    id: string;
    nombre: string;
    descripcion?: string;
}

interface TemasProps {
    materia: Materia;
    onSeleccionarTema: (tema: Tema) => void;
    onVolver: () => void;
}

export default function Temas({
    materia,
    onSeleccionarTema,
    onVolver
}: TemasProps) {

    const [temas, setTemas] = useState<Tema[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarTemas = async () => {

            try {

                setCargando(true);
                setError('');

                const respuesta = await listarTemas(materia.id);

                setTemas(respuesta.temas || []);

            } catch (error) {

                console.error('Error cargando temas:', error);

                setError('No fue posible cargar los temas.');

            } finally {

                setCargando(false);

            }

        };

        cargarTemas();

    }, [materia.id]);

    return (

        <main className="materias-container">

            <header className="materias-header">

                <div className="materias-logo">
                    Sócrates <span>IA</span>
                </div>

                <span className="materias-etiqueta">
                    Espacio de aprendizaje
                </span>

            </header>

            <section className="materias-contenido">

                <button
                    className="materias-volver"
                    onClick={onVolver}
                >
                    ← Volver a materias
                </button>

                <div className="materias-introduccion">

                    <span className="materias-subtitulo">
                        MATERIA SELECCIONADA
                    </span>

                    <h1>{materia.nombre}</h1>

                    <p>
                        Selecciona un tema para continuar tu experiencia
                        de aprendizaje.
                    </p>

                </div>

                {cargando && (

                    <div className="materias-estado">
                        Cargando temas...
                    </div>

                )}

                {error && (

                    <div className="materias-error">
                        {error}
                    </div>

                )}

                {!cargando && !error && temas.length === 0 && (

                    <div className="materias-estado">
                        No hay temas disponibles para esta materia.
                    </div>

                )}

                {!cargando && !error && temas.length > 0 && (

                    <div className="materias-grid">

                        {temas.map((tema) => (

                            <button
                                key={tema.id}
                                className="materia-card"
                                onClick={() => onSeleccionarTema(tema)}
                            >

                                <div className="materia-icono">
                                    ✦
                                </div>

                                <h2>{tema.nombre}</h2>

                                <p>
                                    {tema.descripcion ||
                                        'Explora este tema y desarrolla tu razonamiento.'}
                                </p>

                                <span className="materia-enlace">
                                    Explorar tema →
                                </span>

                            </button>

                        ))}

                    </div>

                )}

            </section>

        </main>

    );

}
