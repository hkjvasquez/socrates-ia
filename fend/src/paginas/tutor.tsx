
import { useEffect, useRef, useState } from "react";
import { preguntar } from "../servicios/servicioTutoria";

interface TutorProps {
    sesionId: string;
    retoTitulo: string;
    retoDescripcion?: string;
    onCambiarReto: () => void;
}

interface Mensaje {
    id: string;
    remitente: "ESTUDIANTE" | "IA";
    contenido: string;
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
    retoTitulo,
    retoDescripcion,
    onCambiarReto
}: TutorProps) {

    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const [nivelAyuda, setNivelAyuda] = useState(1);

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

    // Obtener información del siguiente nivel
    const siguienteNivel = nivelAyuda < 4
        ? nivelesAyuda[(nivelAyuda + 1) as 2 | 3 | 4]
        : null;

    // Scroll automático al último mensaje
    useEffect(() => {
        finRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [mensajes, cargando]);

    // Textarea que crece según el contenido
    useEffect(() => {
        const el = textareaRef.current;

        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;

    }, [mensaje]);

    // Enviar mensaje al tutor
    const enviarMensaje = async () => {

        if (!mensaje.trim() || cargando) return;

        const mensajeUsuario = mensaje.trim();

        setMensaje("");
        setCargando(true);

        setMensajes((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                remitente: "ESTUDIANTE",
                contenido: mensajeUsuario
            }
        ]);

        try {

            const respuesta = await preguntar({
                sesionId,
                mensaje: mensajeUsuario
            });

            setMensajes((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    remitente: "IA",
                    contenido:
                        typeof respuesta?.respuesta === "string" &&
                        respuesta.respuesta.trim()
                            ? respuesta.respuesta
                            : "No fue posible obtener una respuesta válida."
                }
            ]);

        } catch (error) {

            console.error("Error enviando mensaje:", error);

            setMensajes((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    remitente: "IA",
                    contenido:
                        "Ocurrió un error al comunicarse con Sócrates IA."
                }
            ]);

        } finally {

            setCargando(false);
            textareaRef.current?.focus();

        }
    };

    // Solicitar siguiente nivel de ayuda
    const solicitarNivelAyuda = async () => {

        if (cargando || nivelAyuda >= 4) return;

        const siguienteNumero = (nivelAyuda + 1) as 2 | 3 | 4;
        const solicitud = nivelesAyuda[siguienteNumero];

        setCargando(true);

        setMensajes((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                remitente: "ESTUDIANTE",
                contenido: solicitud.solicitud
            }
        ]);

        try {

            const respuesta = await preguntar({
                sesionId,
                mensaje: solicitud.solicitud
            });

            setMensajes((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    remitente: "IA",
                    contenido:
                        typeof respuesta?.respuesta === "string" &&
                        respuesta.respuesta.trim()
                            ? respuesta.respuesta
                            : "No fue posible obtener una respuesta válida."
                }
            ]);

            setNivelAyuda(siguienteNumero);

        } catch (error) {

            console.error("Error cambiando nivel de ayuda:", error);

            setMensajes((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    remitente: "IA",
                    contenido:
                        "No fue posible cambiar el nivel de ayuda. Inténtalo nuevamente."
                }
            ]);

        } finally {

            setCargando(false);

        }
    };

    // Enter para enviar y Shift + Enter para nueva línea
    const manejarTecla = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }

    };

    return (

        <section className="chat">

            {/* Cabecera */}
            <div className="chat-header">

                <div className="chat-header-avatar">
                    ✦
                </div>

                <div className="chat-header-identidad">
                    <h2>Sócrates IA</h2>

                    <span className="chat-estado">
                        <i /> En línea
                    </span>
                </div>

                {/* Control de nivel de ayuda */}
                <div className="chat-header-acciones">

                    <div className="chat-ayuda-header">

                        {siguienteNivel ? (

                            <button
                                type="button"
                                className="chat-ayuda-header-boton"
                                onClick={solicitarNivelAyuda}
                                disabled={cargando}
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
                                    <strong>Nivel 4 activo</strong>
                                    <small>Acompañamiento guiado</small>
                                </div>
                            </div>

                        )}

                    </div>

                    <button
                        type="button"
                        className="chat-cambiar-reto"
                        onClick={onCambiarReto}
                        disabled={cargando}
                    >
                        ← Cambiar de reto
                    </button>

                </div>

            </div>

            {/* Lectura del reto */}
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

            {/* Conversación */}
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

                {mensajes.map((m) => (

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

                <div ref={finRef} />

            </div>

            {/* Entrada de mensajes */}
            <div className="chat-entrada">

                <div className="chat-caja">

                    <textarea
                        ref={textareaRef}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        onKeyDown={manejarTecla}
                        placeholder="Escribe tu reflexión o respuesta..."
                        rows={1}
                        disabled={cargando}
                    />

                    <button
                        type="button"
                        onClick={enviarMensaje}
                        disabled={cargando || !mensaje.trim()}
                        aria-label="Enviar mensaje"
                    >
                        ↑
                    </button>

                </div>

                <p className="chat-ayuda">
                    Enter para enviar · Shift + Enter para nueva línea
                </p>

            </div>

        </section>

    );

}
