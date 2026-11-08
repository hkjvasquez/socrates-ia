import { useEffect, useState } from 'react';

import {
    listarMaterias,
    type Materia
} from '../servicios/servicioMateria';

interface MateriasProps {
    onSeleccionarMateria: (materia: Materia) => void;
}

export default function Materias({
    onSeleccionarMateria,
    
}: MateriasProps) {

    const [materias, setMaterias] = useState<Materia[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarMaterias = async () => {

            try {

                setCargando(true);
                setError('');

                const respuesta = await listarMaterias();

                setMaterias(respuesta.materias || []);

            } catch (error) {

                console.error('Error cargando materias:', error);

                setError(
                    'No fue posible cargar las materias. Intenta nuevamente.'
                );

            } finally {

                setCargando(false);

            }

        };

        cargarMaterias();

    }, []);

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

                <div className="materias-introduccion">

                    <span className="materias-subtitulo">
                        COMIENZA TU APRENDIZAJE
                    </span>

                    <h1>
                        ¿Qué materia deseas explorar?
                    </h1>

                    <p>
                        Selecciona una materia para descubrir sus temas
                        y comenzar a desarrollar tu pensamiento crítico.
                    </p>

                </div>

                {cargando && (

                    <div className="materias-estado">
                        Cargando materias...
                    </div>

                )}

                {error && (

                    <div className="materias-error">

                        <p>{error}</p>

                        <button
                            onClick={() => window.location.reload()}
                        >
                            Intentar nuevamente
                        </button>

                    </div>

                )}

                {!cargando && !error && materias.length === 0 && (

                    <div className="materias-estado">
                        No hay materias disponibles actualmente.
                    </div>

                )}

                {!cargando && !error && materias.length > 0 && (

                    <div className="materias-grid">

                        {materias.map((materia) => (

                            <button
                                key={materia.id}
                                className="materia-card"
                                onClick={() =>
                                    onSeleccionarMateria(materia)
                                }
                            >

                                <div className="materia-icono">
                                    ✦
                                </div>

                                <h2>
                                    {materia.nombre}
                                </h2>

                                <p>
                                    {materia.descripcion ||
                                        'Explora los contenidos de esta materia.'}
                                </p>

                                <span className="materia-enlace">
                                    Explorar materia →
                                </span>

                            </button>

                        ))}

                    </div>

                )}

            </section>

        </main>

    );

}