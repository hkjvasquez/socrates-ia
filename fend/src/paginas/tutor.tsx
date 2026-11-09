
import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent
} from "react";

import { preguntar } from "../servicios/servicioTutoria";
import { finalizarSesion } from "../servicios/servicioSesiones";

interface TutorProps {
    sesionId: string;
    intentoId: string;
    retoTitulo: string;
    retoDescripcion?: string;
    onCambiarReto: () => void;
    onRetoFinalizado: (sesionId: string) => void;
}

interface Mensaje {
    id: string;
    remitente: "ESTUDIANTE" | "IA";
    contenido: string;
}

interface EvaluacionFacione {
    interpretacion: number;
    analisis: number;
    evaluacion: number;
    inferencia: number;
    explicacion: number;
    autorregulacion: number;
    observaciones: string;
}

interface RespuestaFinalizacion {
    exito: boolean;
    mensaje: string;
    sesionId: string;
    intentoId: string;
    evaluacion: EvaluacionFacione;
}

const nivelesAyuda = {
    2: {
        titulo: "Nivel 2 · Necesito una pista",
        descripcion: "Dame una pequeña ayuda para continuar.",
        solicitud:
            "Quiero avanzar al NIVEL 2 de ayuda. Necesito una pista breve que me permita continuar razonando sobre el reto."
    },
    3: {
        titulo: "Nivel 3 · Quiero ver un ejemplo",
        descripcion: "Muéstrame otro ejercicio parecido.",
        solicitud:
            "Quiero avanzar al NIVEL 3 de ayuda. Muéstrame un ejemplo similar que me ayude a comprender cómo resolver este tipo de problema, sin darme la respuesta del reto actual."
    },
    4: {
        titulo: "Nivel 4 · Paso a paso",
        descripcion: "Acompáñame en cada parte del procedimiento.",
        solicitud:
            "Quiero avanzar al NIVEL 4 de ayuda. Acompáñame paso a paso para desarrollar mi razonamiento y resolver el reto por mi cuenta."
    }
};

export default function Tutor({
    sesionId,
    intentoId,
    retoTitulo,
    retoDescripcion,
    onCambiarReto,
    onRetoFinalizado
}: TutorProps) {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const [finalizando, setFinalizando] = useState(false);
    const [retoFinalizado, setRetoFinalizado] = useState(false);
    const [nivelAyuda, setNivelAyuda] = useState(1);

    const [puedeFinalizar, setPuedeFinalizar] = useState(false);
    const [evidencias, setEvidencias] = useState<string[]>([]);
    const [dimensionesObservadas, setDimensionesObservadas] =
        useState<string[]>([]);

    // IMPORTANTE: mensajes se declara antes de los useEffect.

    const [mensajes, setMensajes] = useState<Mensaje[]>([
        {
            id: crypto.randomUUID(),
            remitente: "IA",
            contenido:
                `¡Hola! Soy Sócrates IA. Estoy aquí para acompañarte a resolver el reto "${retoTitulo}". No te daré las respuestas directamente; te ayudaré a descubrirlas mediante preguntas. ¿Qué piensas sobre este desafío?`
        }
    ]);

    const finRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const siguienteNivel =
        nivelAyuda < 4
            ? nivelesAyuda[(nivelAyuda + 1) as 2 | 3 | 4]
            : null;


    // ==========================================
    // ACTUALIZAR EVIDENCIAS DE APRENDIZAJE
    // ==========================================

    const actualizarEvaluacion = (resultado: any) => {

        setPuedeFinalizar(
            resultado?.puedeFinalizar === true
        );

        setEvidencias(
            Array.isArray(resultado?.evidencias)
                ? resultado.evidencias
                : []
        );

        setDimensionesObservadas(
            Array.isArray(resultado?.dimensionesObservadas)
                ? resultado.dimensionesObservadas
                : []
        );

    };


    // ==========================================
    // DESPLAZAMIENTO AUTOMÁTICO DEL CHAT
    // ==========================================

    useEffect(() => {

        finRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });

    }, [mensajes, cargando, finalizando]);


    // ==========================================
    // AJUSTAR ALTURA DEL ÁREA DE TEXTO
    // ==========================================

    useEffect(() => {

        const el = textareaRef.current;

        if (!el) return;

        el.style.height = "auto";

        el.style.height =
            `${Math.min(el.scrollHeight, 160)}px`;

    }, [mensaje]);


    // ==========================================
    // AGREGAR MENSAJE AL CHAT
    // ==========================================

    const agregarMensaje = (
        remitente: Mensaje["remitente"],
        contenido: string
    ) => {

        setMensajes(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                remitente,
                contenido
            }
        ]);

    };


    // ==========================================
    // ENVIAR MENSAJE
    // ==========================================

    const enviarMensaje = async () => {

        if (
            !mensaje.trim() ||
            cargando ||
            finalizando ||
            retoFinalizado
        ) {
            return;
        }

        const mensajeUsuario = mensaje.trim();

        setMensaje("");
        setCargando(true);

        agregarMensaje(
            "ESTUDIANTE",
            mensajeUsuario
        );

        try {

            const respuesta = await preguntar({

                sesionId,

                intentoId,

                mensaje: mensajeUsuario

            });

            actualizarEvaluacion(respuesta);

            agregarMensaje(
                "IA",
                typeof respuesta?.respuesta === "string" &&
                respuesta.respuesta.trim()
                    ? respuesta.respuesta
                    : "No fue posible obtener una respuesta válida."
            );

        } catch (error) {

            console.error(
                "Error enviando mensaje:",
                error
            );

            agregarMensaje(
                "IA",
                "Ocurrió un error al comunicarse con Sócrates IA. Verifica la conexión con el servidor e inténtalo nuevamente."
            );

        } finally {

            setCargando(false);

            textareaRef.current?.focus();

        }

    };


    // ==========================================
    // SOLICITAR SIGUIENTE NIVEL DE AYUDA
    // ==========================================

    const solicitarNivelAyuda = async () => {

        if (
            cargando ||
            finalizando ||
            retoFinalizado ||
            nivelAyuda >= 4
        ) {
            return;
        }

        const siguienteNumero =
            (nivelAyuda + 1) as 2 | 3 | 4;

        const solicitud =
            nivelesAyuda[siguienteNumero];

        setCargando(true);

        agregarMensaje(
            "ESTUDIANTE",
            solicitud.solicitud
        );

        try {

            const respuesta = await preguntar({

                sesionId,

                intentoId,

                mensaje: solicitud.solicitud

            });

            actualizarEvaluacion(respuesta);

            agregarMensaje(
                "IA",
                typeof respuesta?.respuesta === "string" &&
                respuesta.respuesta.trim()
                    ? respuesta.respuesta
                    : "No fue posible obtener una respuesta válida."
            );

            setNivelAyuda(siguienteNumero);

        } catch (error) {

            console.error(
                "Error cambiando nivel de ayuda:",
                error
            );

            agregarMensaje(
                "IA",
                "No fue posible cambiar el nivel de ayuda. Inténtalo nuevamente."
            );

        } finally {

            setCargando(false);

        }

    };


    // ==========================================
    // FINALIZAR RETO Y REDIRIGIR A RESULTADOS
    // ==========================================

    const manejarFinalizacion = async () => {

        if (
            !puedeFinalizar ||
            cargando ||
            finalizando ||
            retoFinalizado
        ) {
            return;
        }

        const confirmar = window.confirm(
            "¿Estás seguro de que deseas finalizar este reto? Sócrates IA evaluará tu razonamiento y generará tus resultados."
        );

        if (!confirmar) return;

        setFinalizando(true);

        try {

            const resultado: RespuestaFinalizacion =
                await finalizarSesion(sesionId);

            if (
                !resultado?.exito ||
                !resultado.evaluacion
            ) {

                throw new Error(
                    resultado?.mensaje ||
                    "No se pudo finalizar el reto."
                );

            }

            setRetoFinalizado(true);
            setPuedeFinalizar(false);

            // App.tsx abrirá el dashboard de resultados.

            onRetoFinalizado(
                resultado.sesionId || sesionId
            );

        } catch (error) {

            console.error(
                "Error finalizando reto:",
                error
            );

            agregarMensaje(
                "IA",
                error instanceof Error
                    ? error.message
                    : "No fue posible finalizar el reto. Inténtalo nuevamente."
            );

        } finally {

            setFinalizando(false);

        }

    };


    // ==========================================
    // MANEJAR TECLA ENTER
    // ==========================================

    const manejarTecla = (
        e: KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            enviarMensaje();

        }

    };


    // ==========================================
    // INTERFAZ DEL TUTOR
    // ==========================================

    return (

        <section className="chat">

            <div className="chat-header">

                <div className="chat-header-avatar">
                    ✦
                </div>

                <div className="chat-header-identidad">

                    <h2>Sócrates IA</h2>

                    <span className="chat-estado">
                        <i />
                        {retoFinalizado
                            ? "Reto finalizado"
                            : "En línea"}
                    </span>

                </div>

                <div className="chat-header-acciones">

                    <div className="chat-ayuda-header">

                        {siguienteNivel && !retoFinalizado ? (

                            <button
                                type="button"
                                className="chat-ayuda-header-boton"
                                onClick={solicitarNivelAyuda}
                                disabled={cargando || finalizando}
                            >

                                <span className="chat-ayuda-header-icono">
                                    {nivelAyuda === 1
                                        ? "💡"
                                        : nivelAyuda === 2
                                            ? "📖"
                                            : "🧭"}
                                </span>

                                <span className="chat-ayuda-header-texto">

                                    <strong>
                                        {siguienteNivel.titulo}
                                    </strong>

                                    <small>
                                        {siguienteNivel.descripcion}
                                    </small>

                                </span>

                                <span className="chat-ayuda-header-flecha">
                                    →
                                </span>

                            </button>

                        ) : (

                            <div className="chat-ayuda-header-activa">

                                <span>✦</span>

                                <div>

                                    <strong>
                                        {retoFinalizado
                                            ? "Evaluación completada"
                                            : "Nivel 4 activo"}
                                    </strong>

                                    <small>
                                        {retoFinalizado
                                            ? "Resultados disponibles"
                                            : "Acompañamiento guiado"}
                                    </small>

                                </div>

                            </div>

                        )}

                    </div>

                    <button
                        type="button"
                        className="chat-cambiar-reto"
                        onClick={onCambiarReto}
                        disabled={cargando || finalizando}
                    >
                        ← Cambiar de reto
                    </button>

                </div>

            </div>

            <div className="chat-reto">

                <div className="chat-reto-cabecera">

                    <div className="chat-reto-icono">
                        📖
                    </div>

                    <div className="chat-reto-identificacion">

                        <span className="chat-reto-etiqueta">
                            TU RETO ACTUAL
                        </span>

                        <h3 className="chat-reto-titulo">
                            {retoTitulo}
                        </h3>

                    </div>

                </div>

                {retoDescripcion && (

                    <div className="chat-reto-lectura">

                        <span className="chat-reto-instruccion">
                            LEE CON ATENCIÓN
                        </span>

                        <div className="chat-reto-descripcion-contenedor">

                            <p className="chat-reto-descripcion">
                                {retoDescripcion}
                            </p>

                        </div>

                    </div>

                )}

            </div>

            <div className="chat-mensajes">

                <div className="chat-mensajes-intro">

                    <span>✦</span>

                    <div>

                        <strong>Diálogo socrático</strong>

                        <p>
                            Reflexiona, analiza y construye tus propias respuestas.
                        </p>

                    </div>

                </div>

                {(dimensionesObservadas.length > 0 ||
                    evidencias.length > 0 ||
                    puedeFinalizar) && (

                    <div className="chat-progreso">

                        <div className="chat-progreso-cabecera">

                            <span>✦</span>

                            <div>

                                <strong>
                                    Progreso de tu razonamiento
                                </strong>

                                <p>
                                    Sócrates IA está identificando las evidencias
                                    de tu pensamiento crítico.
                                </p>

                            </div>

                        </div>

                        {dimensionesObservadas.length > 0 && (

                            <div className="chat-progreso-dimensiones">

                                <strong>
                                    Dimensiones observadas
                                </strong>

                                <div className="chat-progreso-etiquetas">

                                    {dimensionesObservadas.map(
                                        (dimension, index) => (

                                            <span key={`${dimension}-${index}`}>
                                                {dimension}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                        {evidencias.length > 0 && (

                            <div className="chat-progreso-evidencias">

                                <strong>
                                    Evidencias identificadas
                                </strong>

                                <ul>

                                    {evidencias.map((evidencia, index) => (

                                        <li key={index}>
                                            {evidencia}
                                        </li>

                                    ))}

                                </ul>

                            </div>

                        )}

                        {puedeFinalizar && !retoFinalizado && (

                            <div className="chat-progreso-listo">

                                <span>✓</span>

                                <p>

                                    <strong>
                                        Has demostrado avances suficientes.
                                    </strong>

                                    <br />

                                    Ya puedes finalizar el reto y obtener tu evaluación.

                                </p>

                            </div>

                        )}

                    </div>

                )}

                {mensajes.map(m => (

                    <div
                        key={m.id}
                        className={`chat-fila ${
                            m.remitente === "ESTUDIANTE"
                                ? "es-usuario"
                                : "es-ia"
                        }`}
                    >

                        {m.remitente === "IA" && (

                            <div className="chat-avatar">
                                ✦
                            </div>

                        )}

                        <div className="chat-burbuja">
                            {m.contenido}
                        </div>

                    </div>

                ))}

                {cargando && (

                    <div className="chat-fila es-ia">

                        <div className="chat-avatar">
                            ✦
                        </div>

                        <div className="chat-burbuja chat-escribiendo">
                            <span />
                            <span />
                            <span />
                        </div>

                    </div>

                )}

                {finalizando && (

                    <div className="chat-fila es-ia">

                        <div className="chat-avatar">
                            ✦
                        </div>

                        <div className="chat-burbuja">
                            Sócrates IA está evaluando tu razonamiento...
                        </div>

                    </div>

                )}

                <div ref={finRef} />

            </div>

            {!retoFinalizado && (

                <div className="chat-entrada">

                    {puedeFinalizar && (

                        <button
                            type="button"
                            className="chat-finalizar-reto"
                            onClick={manejarFinalizacion}
                            disabled={cargando || finalizando}
                        >

                            {finalizando
                                ? "Evaluando tu razonamiento..."
                                : "✓ Finalizar reto"}

                        </button>

                    )}

                    <div className="chat-caja">

                        <textarea
                            ref={textareaRef}
                            value={mensaje}
                            onChange={e => setMensaje(e.target.value)}
                            onKeyDown={manejarTecla}
                            placeholder="Escribe tu reflexión o respuesta..."
                            rows={1}
                            disabled={cargando || finalizando}
                        />

                        <button
                            type="button"
                            onClick={enviarMensaje}
                            disabled={
                                cargando ||
                                finalizando ||
                                !mensaje.trim()
                            }
                            aria-label="Enviar mensaje"
                        >
                            ↑
                        </button>

                    </div>

                    <p className="chat-ayuda">
                        Enter para enviar · Shift + Enter para nueva línea
                    </p>

                </div>

            )}

        </section>

    );

}
