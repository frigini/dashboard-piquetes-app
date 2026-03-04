import { T } from "../../theme/theme";

const Ring = ({ pct, size = 80, stroke = 7, color = T.red, bg = "#1A1A1A" }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
    );
};

export default Ring;
