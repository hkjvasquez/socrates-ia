
import { useMemo, useState } from 'react';

type Estudiante = {
    id: string;
    nombre: string;
    iniciales: string;
    sesiones: number;
    retos: number;
    indice: number;
    nivel: string;
    dimensiones: number[];
    evolucion: number[];
};

const dimensiones = [
    'Interpretación',
    'Análisis',
    'Evaluación',
    'Inferencia',
    'Explicación',
    'Autorregulación'
];

const estudiantes: Estudiante[] = [
    {
        id: 'EST-001',
        nombre: 'María Fernanda López',
        iniciales: 'ML',
        sesiones: 18,
        retos: 12,
        indice: 88,
        nivel: 'Avanzado',
        dimensiones: [92, 88, 84, 90, 86, 88],
        evolucion: [62, 68, 71, 76, 82, 88]
    },
    {
        id: 'EST-002',
        nombre: 'José Alejandro García',
        iniciales: 'JG',
        sesiones: 15,
        retos: 10,
        indice: 78,
        nivel: 'Satisfactorio',
        dimensiones: [82, 76, 72, 80, 78, 80],
        evolucion: [58, 61, 65, 69, 73, 78]
    },
    {
        id: 'EST-003',
        nombre: 'Ana Lucía Hernández',
        iniciales: 'AH',
        sesiones: 21,
        retos: 14,
        indice: 91,
        nivel: 'Avanzado',
        dimensiones: [94, 91, 88, 93, 90, 90],
        evolucion: [64, 69, 75, 80, 86, 91]
    },
    {
        id: 'EST-004',
        nombre: 'Carlos Eduardo Ramírez',
        iniciales: 'CR',
        sesiones: 12,
        retos: 8,
        indice: 69,
        nivel: 'En desarrollo',
        dimensiones: [72, 68, 64, 70, 66, 74],
        evolucion: [55, 58, 60, 63, 66, 69]
    },
    {
        id: 'EST-005',
        nombre: 'Daniela Sofía Martínez',
        iniciales: 'DM',
        sesiones: 17,
        retos: 11,
        indice: 84,
        nivel: 'Satisfactorio',
        dimensiones: [88, 82, 80, 86, 83, 85],
        evolucion: [60, 65, 70, 74, 79, 84]
    }
];

const retos = [
    {
        titulo: '¿Qué distancia recorre un automóvil?',
        materia: 'Matemática',
        tema: 'Proporcionalidad directa',
        sesiones: 24,
        resultado: 86,
        nivel: 'Alto'
    },
    {
        titulo: 'Interpretación de un problema matemático',
        materia: 'Matemática',
        tema: 'Razonamiento lógico',
        sesiones: 18,
        resultado: 78,
        nivel: 'Medio'
    },
    {
        titulo: 'Análisis de información y evidencias',
        materia: 'Comunicación y Lenguaje',
        tema: 'Comprensión lectora',
        sesiones: 16,
        resultado: 91,
        nivel: 'Alto'
    }
];

const estilos = `
.cog-dashboard {
    --cog-navy: #101b32;
    --cog-navy-2: #172640;
    --cog-gold: #c5a15a;
    --cog-text: #202b3c;
    --cog-muted: #8490a3;
    --cog-line: #e9edf3;
    --cog-bg: #f4f6fa;
    color: var(--cog-text);
    width: 100%;
    min-height: 100%;
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    padding: 28px;
    background: var(--cog-bg);
    box-sizing: border-box;
}
.cog-dashboard * { box-sizing: border-box; }
.cog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 25px;
}
.cog-eyebrow {
    color: #a27c37;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 9px;
}
.cog-title {
    color: var(--cog-navy);
    font-size: clamp(23px, 3vw, 31px);
    font-weight: 800;
    letter-spacing: -1px;
    margin: 0;
}
.cog-subtitle {
    color: var(--cog-muted);
    font-size: 13px;
    margin: 8px 0 0;
}
.cog-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.cog-demo {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid #eadfc8;
    background: #fbf7ed;
    color: #92702f;
    border-radius: 30px;
    padding: 9px 13px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .7px;
}
.cog-demo-dot {
    width: 7px;
    height: 7px;
    background: #c5a15a;
    border-radius: 50%;
}
.cog-filter {
    border: 1px solid #e1e6ee;
    background: white;
    color: #43516a;
    padding: 10px 13px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 700;
}
.cog-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 15px;
    margin-bottom: 19px;
}
.cog-card {
    background: white;
    border: 1px solid #e9edf3;
    border-radius: 13px;
    padding: 19px;
    min-width: 0;
    box-shadow: 0 3px 12px rgba(16, 27, 50, .025);
}
.cog-kpi {
    position: relative;
    overflow: hidden;
}
.cog-kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.cog-kpi-label {
    color: #7d899b;
    font-size: 11px;
    font-weight: 700;
}
.cog-kpi-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #f0f3f8;
    color: #9a783d;
    font-size: 16px;
}
.cog-kpi-value {
    color: var(--cog-navy);
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
    margin-top: 16px;
    letter-spacing: -1px;
}
.cog-kpi-foot {
    color: #96a0ae;
    font-size: 10px;
    margin-top: 9px;
}
.cog-kpi-foot strong { color: #258b79; }
.cog-grid-main {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, .85fr);
    gap: 17px;
    margin-bottom: 18px;
}
.cog-card-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
}
.cog-card-title {
    color: var(--cog-navy);
    font-size: 14px;
    font-weight: 800;
    margin: 0;
}
.cog-card-description {
    color: #99a2af;
    font-size: 10px;
    margin-top: 5px;
}
.cog-mini-tag {
    color: #9b793e;
    background: #faf5e9;
    padding: 6px 9px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 800;
    white-space: nowrap;
}
.cog-radar-layout {
    display: grid;
    grid-template-columns: minmax(180px, 1fr) minmax(150px, .8fr);
    gap: 10px;
    align-items: center;
}
.cog-radar {
    width: 100%;
    max-width: 300px;
    margin: auto;
    overflow: visible;
}
.cog-dimension-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
}
.cog-dimension-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: #657187;
    font-size: 10px;
    margin-bottom: 6px;
}
.cog-dimension-row strong {
    color: var(--cog-navy);
    font-size: 11px;
}
.cog-progress {
    width: 100%;
    height: 5px;
    border-radius: 10px;
    background: #edf0f5;
    overflow: hidden;
}
.cog-progress-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, #b28d4b, #d5b978);
}
.cog-student-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.cog-student {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    padding: 12px 7px;
    border: 0;
    border-bottom: 1px solid #f0f2f6;
    background: transparent;
    cursor: pointer;
    border-radius: 7px;
    color: inherit;
}
.cog-student:last-child { border-bottom: 0; }
.cog-student:hover, .cog-student.active { background: #f5f7fa; }
.cog-avatar {
    width: 35px;
    height: 35px;
    flex: 0 0 35px;
    border-radius: 10px;
    background: #e9edf5;
    color: #263b5d;
    display: grid;
    place-items: center;
    font-size: 10px;
    font-weight: 800;
}
.cog-student-info { min-width: 0; flex: 1; }
.cog-student-name {
    color: #354258;
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.cog-student-id {
    color: #a0a8b5;
    font-size: 9px;
    margin-top: 4px;
}
.cog-student-score {
    color: var(--cog-navy);
    font-size: 14px;
    font-weight: 800;
}
.cog-level {
    display: inline-block;
    padding: 4px 7px;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 800;
    white-space: nowrap;
}
.cog-level.alto { color: #21836e; background: #e9f5f1; }
.cog-level.medio { color: #a17b34; background: #faf3e4; }
.cog-level.bajo { color: #b66b4e; background: #fbefeb; }
.cog-grid-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(260px, .75fr);
    gap: 17px;
    margin-bottom: 18px;
}
.cog-chart {
    width: 100%;
    height: 180px;
    display: block;
}
.cog-chart-labels {
    display: flex;
    justify-content: space-between;
    color: #9ba5b3;
    font-size: 9px;
    padding: 0 4px;
}
.cog-legend {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    color: #8b96a6;
    font-size: 10px;
    margin-top: 10px;
}
.cog-legend span { display: flex; align-items: center; gap: 6px; }
.cog-legend i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c5a15a;
}
.cog-distribution {
    display: flex;
    flex-direction: column;
    gap: 17px;
    margin-top: 24px;
}
.cog-dist-row {
    display: grid;
    grid-template-columns: 95px 1fr 25px;
    align-items: center;
    gap: 10px;
    color: #69768b;
    font-size: 10px;
}
.cog-dist-bar {
    height: 8px;
    border-radius: 20px;
    background: #eff1f5;
    overflow: hidden;
}
.cog-dist-fill { height: 100%; border-radius: 20px; }
.cog-table-wrap { overflow-x: auto; }
.cog-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 590px;
}
.cog-table th {
    text-align: left;
    color: #98a2b0;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .7px;
    padding: 11px 10px;
    background: #fafbfd;
}
.cog-table td {
    padding: 13px 10px;
    border-bottom: 1px solid #f0f2f5;
    color: #536075;
    font-size: 10px;
}
.cog-table tr:last-child td { border-bottom: 0; }
.cog-table strong { color: #253650; }
.cog-analysis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
    margin-top: 12px;
}
.cog-insight {
    border-radius: 9px;
    padding: 13px;
    background: #f5f8f7;
    border: 1px solid #e6efec;
}
.cog-insight.warning {
    background: #fbf7ef;
    border-color: #f0e8d7;
}
.cog-insight-title {
    color: #27836f;
    font-size: 10px;
    font-weight: 800;
    margin-bottom: 6px;
}
.cog-insight.warning .cog-insight-title { color: #a17b34; }
.cog-insight p {
    color: #758195;
    font-size: 10px;
    line-height: 1.6;
    margin: 0;
}
.cog-profile {
    background: var(--cog-navy);
    color: white;
    border-radius: 13px;
    padding: 20px;
    margin-bottom: 18px;
}
.cog-profile-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}
.cog-profile-person {
    display: flex;
    align-items: center;
    gap: 12px;
}
.cog-profile .cog-avatar {
    background: #283a58;
    color: #e4c681;
    width: 44px;
    height: 44px;
}
.cog-profile-name { font-size: 15px; font-weight: 800; }
.cog-profile-id { color: #aab6c8; font-size: 10px; margin-top: 4px; }
.cog-profile-stats {
    display: flex;
    gap: 25px;
    flex-wrap: wrap;
}
.cog-profile-stat small {
    display: block;
    color: #9eacc0;
    font-size: 9px;
    margin-bottom: 5px;
}
.cog-profile-stat strong { font-size: 17px; color: #e6c77f; }
.cog-select {
    border: 1px solid #dfe5ed;
    background: white;
    border-radius: 8px;
    padding: 9px 12px;
    color: #34445e;
    font-size: 11px;
    font-weight: 700;
    max-width: 100%;
}
.cog-footer {
    text-align: center;
    color: #a1aab7;
    font-size: 9px;
    padding: 8px 0 2px;
}
@media (max-width: 1050px) {
    .cog-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cog-grid-main, .cog-grid-bottom { grid-template-columns: 1fr; }
}
@media (max-width: 650px) {
    .cog-dashboard { padding: 15px; }
    .cog-header { flex-direction: column; }
    .cog-header-actions { width: 100%; }
    .cog-radar-layout { grid-template-columns: 1fr; }
    .cog-radar { max-width: 260px; }
    .cog-analysis { grid-template-columns: 1fr; }
    .cog-profile-stats { gap: 15px; }
}
`;

function calcularPuntos(valores: number[], centro = 150, radio = 105) {
    return valores.map((valor, i) => {
        const angulo = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const distancia = (valor / 100) * radio;
        return `${centro + Math.cos(angulo) * distancia},${centro + Math.sin(angulo) * distancia}`;
    }).join(' ');
}

function GraficaRadar({ valores }: { valores: number[] }) {
    const etiquetas = [
        { texto: 'Interpretación', x: 150, y: 12, anchor: 'middle' },
        { texto: 'Análisis', x: 278, y: 88, anchor: 'start' },
        { texto: 'Evaluación', x: 278, y: 220, anchor: 'start' },
        { texto: 'Inferencia', x: 150, y: 294, anchor: 'middle' },
        { texto: 'Explicación', x: 22, y: 220, anchor: 'end' },
        { texto: 'Autorregulación', x: 22, y: 88, anchor: 'end' }
    ];

    return (
        <svg className="cog-radar" viewBox="0 0 300 305" role="img" aria-label="Gráfico radar de las seis dimensiones de Facione">
            {[25, 50, 75, 100].map(n => (
                <polygon
                    key={n}
                    points={calcularPuntos(Array(6).fill(n))}
                    fill="none"
                    stroke="#e9edf3"
                    strokeWidth="1"
                />
            ))}
            {Array.from({ length: 6 }).map((_, i) => {
                const angulo = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                return (
                    <line
                        key={i}
                        x1="150"
                        y1="150"
                        x2={150 + Math.cos(angulo) * 105}
                        y2={150 + Math.sin(angulo) * 105}
                        stroke="#e9edf3"
                    />
                );
            })}
            <polygon
                points={calcularPuntos(valores)}
                fill="rgba(197,161,90,.20)"
                stroke="#b28d4b"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {valores.map((valor, i) => {
                const angulo = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                const distancia = (valor / 100) * 105;
                return (
                    <circle
                        key={i}
                        cx={150 + Math.cos(angulo) * distancia}
                        cy={150 + Math.sin(angulo) * distancia}
                        r="4"
                        fill="#b28d4b"
                        stroke="white"
                        strokeWidth="2"
                    />
                );
            })}
            {etiquetas.map((etiqueta, i) => (
                <text
                    key={i}
                    x={etiqueta.x}
                    y={etiqueta.y}
                    textAnchor={etiqueta.anchor as 'start' | 'middle' | 'end'}
                    fill="#8994a5"
                    fontSize="9"
                    fontWeight="600"
                >
                    {etiqueta.texto}
                </text>
            ))}
        </svg>
    );
}

function GraficaEvolucion({ valores }: { valores: number[] }) {
    const puntos = valores.map((valor, i) => {
        const x = 15 + i * 70;
        const y = 155 - (valor - 50) * 3;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="cog-chart" viewBox="0 0 450 180" preserveAspectRatio="none">
            {[50, 60, 70, 80, 90, 100].map(valor => {
                const y = 155 - (valor - 50) * 3;
                return (
                    <g key={valor}>
                        <line x1="15" y1={y} x2="435" y2={y} stroke="#edf0f4" strokeDasharray="3 4" />
                        <text x="2" y={y + 3} fill="#a0a9b5" fontSize="8">{valor}</text>
                    </g>
                );
            })}
            <polyline
                points={puntos}
                fill="none"
                stroke="#b28d4b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {valores.map((valor, i) => {
                const x = 15 + i * 70;
                const y = 155 - (valor - 50) * 3;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="#b28d4b" stroke="white" strokeWidth="2" />
                    </g>
                );
            })}
        </svg>
    );
}

export default function EvaluacionCognitiva() {
    const [estudianteId, setEstudianteId] = useState('EST-001');
    const [vista, setVista] = useState<'general' | 'individual'>('general');

    const estudiante = useMemo(
        () => estudiantes.find(e => e.id === estudianteId) ?? estudiantes[0],
        [estudianteId]
    );

    const promedio = Math.round(
        estudiantes.reduce((total, e) => total + e.indice, 0) / estudiantes.length
    );

    const promedioDimensiones = dimensiones.map((_, i) =>
        Math.round(estudiantes.reduce((total, e) => total + e.dimensiones[i], 0) / estudiantes.length)
    );

    const promedioSesiones = estudiantes.reduce((total, e) => total + e.sesiones, 0);
    const promedioRetos = estudiantes.reduce((total, e) => total + e.retos, 0);

    const fortalezas = dimensiones
        .map((nombre, i) => ({ nombre, valor: estudiante.dimensiones[i] }))
        .sort((a, b) => b.valor - a.valor);

    const nivelClase = (nivel: string) =>
        nivel === 'Avanzado' ? 'alto' : nivel === 'Satisfactorio' ? 'medio' : 'bajo';

    return (
        <div className="cog-dashboard">
            <style>{estilos}</style>

            <header className="cog-header">
                <div>
                    <div className="cog-eyebrow">SÓCRATES IA / ANALÍTICA EDUCATIVA</div>
                    <h1 className="cog-title">Centro de Inteligencia Cognitiva</h1>
                    <p className="cog-subtitle">
                        Monitoreo del pensamiento crítico y razonamiento · Modelo de evaluación de Facione
                    </p>
                </div>

                <div className="cog-header-actions">
                    <span className="cog-demo">
                        <span className="cog-demo-dot" />
                        ENTORNO DEMOSTRATIVO
                    </span>
                    <button className="cog-filter" onClick={() => setVista('general')}>
                        Vista ejecutiva
                    </button>
                </div>
            </header>

            {vista === 'individual' && (
                <section className="cog-profile">
                    <div className="cog-profile-top">
                        <div className="cog-profile-person">
                            <div className="cog-avatar">{estudiante.iniciales}</div>
                            <div>
                                <div className="cog-profile-name">{estudiante.nombre}</div>
                                <div className="cog-profile-id">{estudiante.id} · Expediente cognitivo</div>
                            </div>
                        </div>
                        <div className="cog-profile-stats">
                            <div className="cog-profile-stat">
                                <small>Índice cognitivo</small>
                                <strong>{estudiante.indice}%</strong>
                            </div>
                            <div className="cog-profile-stat">
                                <small>Sesiones</small>
                                <strong>{estudiante.sesiones}</strong>
                            </div>
                            <div className="cog-profile-stat">
                                <small>Retos</small>
                                <strong>{estudiante.retos}</strong>
                            </div>
                        </div>
                        <button className="cog-filter" onClick={() => setVista('general')}>
                            Volver al resumen
                        </button>
                    </div>
                </section>
            )}

            <section className="cog-kpis">
                <div className="cog-card cog-kpi">
                    <div className="cog-kpi-top">
                        <span className="cog-kpi-label">Estudiantes evaluados</span>
                        <span className="cog-kpi-icon">♙</span>
                    </div>
                    <div className="cog-kpi-value">05</div>
                    <div className="cog-kpi-foot">Grupo de referencia · demostrativo</div>
                </div>

                <div className="cog-card cog-kpi">
                    <div className="cog-kpi-top">
                        <span className="cog-kpi-label">Sesiones de tutoría</span>
                        <span className="cog-kpi-icon">◷</span>
                    </div>
                    <div className="cog-kpi-value">{promedioSesiones}</div>
                    <div className="cog-kpi-foot">Interacciones de aprendizaje simuladas</div>
                </div>

                <div className="cog-card cog-kpi">
                    <div className="cog-kpi-top">
                        <span className="cog-kpi-label">Retos completados</span>
                        <span className="cog-kpi-icon">✓</span>
                    </div>
                    <div className="cog-kpi-value">{promedioRetos}</div>
                    <div className="cog-kpi-foot">Actividades de referencia</div>
                </div>

                <div className="cog-card cog-kpi">
                    <div className="cog-kpi-top">
                        <span className="cog-kpi-label">Índice cognitivo grupal</span>
                        <span className="cog-kpi-icon">◎</span>
                    </div>
                    <div className="cog-kpi-value">{promedio}%</div>
                    <div className="cog-kpi-foot"><strong>Promedio demostrativo</strong> · escala 0–100</div>
                </div>
            </section>

            <section className="cog-grid-main">
                <div className="cog-card">
                    <div className="cog-card-heading">
                        <div>
                            <h2 className="cog-card-title">Perfil de pensamiento crítico</h2>
                            <div className="cog-card-description">
                                Evaluación basada en las seis dimensiones del modelo de Facione
                            </div>
                        </div>
                        <span className="cog-mini-tag">
                            {vista === 'individual' ? 'PERFIL INDIVIDUAL' : 'PROMEDIO GRUPAL'}
                        </span>
                    </div>

                    <div className="cog-radar-layout">
                        <GraficaRadar valores={vista === 'individual' ? estudiante.dimensiones : promedioDimensiones} />

                        <div className="cog-dimension-list">
                            {(vista === 'individual' ? estudiante.dimensiones : promedioDimensiones).map((valor, i) => (
                                <div key={dimensiones[i]}>
                                    <div className="cog-dimension-row">
                                        <span>{dimensiones[i]}</span>
                                        <strong>{valor}%</strong>
                                    </div>
                                    <div className="cog-progress">
                                        <div className="cog-progress-fill" style={{ width: `${valor}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cog-card">
                    <div className="cog-card-heading">
                        <div>
                            <h2 className="cog-card-title">Estudiantes de referencia</h2>
                            <div className="cog-card-description">Selecciona un estudiante para consultar su perfil</div>
                        </div>
                        <span className="cog-mini-tag">5 REGISTROS</span>
                    </div>

                    <div className="cog-student-list">
                        {estudiantes.map(e => (
                            <button
                                type="button"
                                key={e.id}
                                className={`cog-student ${estudianteId === e.id ? 'active' : ''}`}
                                onClick={() => {
                                    setEstudianteId(e.id);
                                    setVista('individual');
                                }}
                            >
                                <span className="cog-avatar">{e.iniciales}</span>
                                <span className="cog-student-info">
                                    <span className="cog-student-name">{e.nombre}</span>
                                    <span className="cog-student-id">{e.id} · {e.nivel}</span>
                                </span>
                                <span className="cog-student-score">{e.indice}%</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cog-grid-bottom">
                <div className="cog-card">
                    <div className="cog-card-heading">
                        <div>
                            <h2 className="cog-card-title">
                                Evolución del pensamiento crítico
                            </h2>
                            <div className="cog-card-description">
                                Progresión ilustrativa del índice cognitivo a través de seis momentos de evaluación
                            </div>
                        </div>
                        <span className="cog-mini-tag">TENDENCIA</span>
                    </div>

                    <GraficaEvolucion valores={vista === 'individual' ? estudiante.evolucion : [60, 64, 68, 72, 77, promedio]} />

                    <div className="cog-chart-labels">
                        {['Inicio', 'Etapa 2', 'Etapa 3', 'Etapa 4', 'Etapa 5', 'Actual'].map(label => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>

                    <div className="cog-legend">
                        <span><i /> {vista === 'individual' ? estudiante.nombre : 'Promedio del grupo'}</span>
                    </div>
                </div>

                <div className="cog-card">
                    <div className="cog-card-heading">
                        <div>
                            <h2 className="cog-card-title">Distribución por nivel</h2>
                            <div className="cog-card-description">Clasificación de los estudiantes</div>
                        </div>
                    </div>

                    <div className="cog-distribution">
                        {[
                            {
                                nombre: 'Avanzado',
                                cantidad: estudiantes.filter(e => e.nivel === 'Avanzado').length,
                                color: '#258b79'
                            },
                            {
                                nombre: 'Satisfactorio',
                                cantidad: estudiantes.filter(e => e.nivel === 'Satisfactorio').length,
                                color: '#c5a15a'
                            },
                            {
                                nombre: 'En desarrollo',
                                cantidad: estudiantes.filter(e => e.nivel === 'En desarrollo').length,
                                color: '#d18b68'
                            }
                        ].map(item => (
                            <div className="cog-dist-row" key={item.nombre}>
                                <span>{item.nombre}</span>
                                <div className="cog-dist-bar">
                                    <div
                                        className="cog-dist-fill"
                                        style={{
                                            width: `${(item.cantidad / estudiantes.length) * 100}%`,
                                            background: item.color
                                        }}
                                    />
                                </div>
                                <strong>{item.cantidad}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="cog-analysis">
                        <div className="cog-insight">
                            <div className="cog-insight-title">Fortaleza grupal</div>
                            <p>
                                {dimensiones[promedioDimensiones.indexOf(Math.max(...promedioDimensiones))]} presenta el promedio más alto.
                            </p>
                        </div>
                        <div className="cog-insight warning">
                            <div className="cog-insight-title">Área de atención</div>
                            <p>
                                {dimensiones[promedioDimensiones.indexOf(Math.min(...promedioDimensiones))]} requiere mayor refuerzo pedagógico.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {vista === 'individual' && (
                <section className="cog-card" style={{ marginBottom: 18 }}>
                    <div className="cog-card-heading">
                        <div>
                            <h2 className="cog-card-title">Diagnóstico cognitivo individual</h2>
                            <div className="cog-card-description">
                                Lectura descriptiva del perfil seleccionado
                            </div>
                        </div>
                        <span className={`cog-level ${nivelClase(estudiante.nivel)}`}>
                            {estudiante.nivel}
                        </span>
                    </div>

                    <div className="cog-analysis">
                        <div className="cog-insight">
                            <div className="cog-insight-title">Principal fortaleza</div>
                            <p>
                                {fortalezas[0].nombre} · {fortalezas[0].valor}%. Es la dimensión con mayor puntuación en el perfil demostrativo.
                            </p>
                        </div>
                        <div className="cog-insight warning">
                            <div className="cog-insight-title">Oportunidad de mejora</div>
                            <p>
                                {fortalezas[fortalezas.length - 1].nombre} · {fortalezas[fortalezas.length - 1].valor}%. Se recomienda diseñar actividades de refuerzo.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="cog-card">
                <div className="cog-card-heading">
                    <div>
                        <h2 className="cog-card-title">Análisis del desempeño por reto</h2>
                        <div className="cog-card-description">
                            Resultados ilustrativos de actividades de tutoría socrática
                        </div>
                    </div>
                    <span className="cog-mini-tag">ANÁLISIS ACADÉMICO</span>
                </div>

                <div className="cog-table-wrap">
                    <table className="cog-table">
                        <thead>
                            <tr>
                                <th>Reto de aprendizaje</th>
                                <th>Materia</th>
                                <th>Tema</th>
                                <th>Sesiones</th>
                                <th>Resultado</th>
                                <th>Nivel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retos.map(reto => (
                                <tr key={reto.titulo}>
                                    <td><strong>{reto.titulo}</strong></td>
                                    <td>{reto.materia}</td>
                                    <td>{reto.tema}</td>
                                    <td>{reto.sesiones}</td>
                                    <td><strong>{reto.resultado}%</strong></td>
                                    <td>
                                        <span className={`cog-level ${reto.nivel === 'Alto' ? 'alto' : 'medio'}`}>
                                            {reto.nivel}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="cog-footer">
                SÓCRATES IA · CENTRO DE INTELIGENCIA COGNITIVA · DATOS FICTICIOS PARA DEMOSTRACIÓN DE INTERFAZ
            </footer>
        </div>
    );
}
