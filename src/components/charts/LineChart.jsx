import { T } from "../../theme/theme";

const LineChart = ({ data }) => {
    if (!data.length) return (
        <div style={{ padding: "30px 0", textAlign: "center", color: T.dim, fontSize: 11 }}>
            Atualize piquetes para ver a evolucao
        </div>
    );
    const W = 340, H = 100, maxV = Math.max(...data.map(d => d.v), 1);
    const px = (i) => 16 + (i / Math.max(data.length - 1, 1)) * (W - 32);
    const py = (v) => H - 16 - ((v / maxV) * (H - 28));
    const pts = data.map((d, i) => [px(i), py(d.v)]);
    const linePts = pts.map(p => p.join(",")).join(" ");
    const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length - 1][0]},${H} Z`;
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.red} stopOpacity=".35" />
                    <stop offset="100%" stopColor={T.red} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#areaFill)" />
            <polyline points={linePts} fill="none" stroke={T.red} strokeWidth="2" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r="3.5" fill={T.red} stroke={T.surface} strokeWidth="1.5" />
                    <text x={p[0]} y={p[1] - 8} textAnchor="middle" fill={T.sub} fontSize="8" fontFamily="monospace">{data[i].v}</text>
                    {data.length <= 8 && <text x={p[0]} y={H - 2} textAnchor="middle" fill={T.dim} fontSize="7">{data[i].d.slice(0, 5)}</text>}
                </g>
            ))}
            <line x1="16" y1={H - 14} x2={W - 16} y2={H - 14} stroke={T.border} strokeWidth="1" />
        </svg>
    );
};

export default LineChart;
