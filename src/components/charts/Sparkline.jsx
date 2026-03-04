import { T } from "../../theme/theme";

const Sparkline = ({ data, color = T.red, h = 40, w = 120 }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => `${(i / (Math.max(data.length - 1, 1))) * (w - 4) + 2},${h - 2 - ((v / max) * (h - 4))}`).join(" ");
    return (
        <svg width={w} height={h} style={{ overflow: "visible" }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            {data.map((v, i) => {
                const x = (i / (Math.max(data.length - 1, 1))) * (w - 4) + 2;
                const y = h - 2 - ((v / max) * (h - 4));
                return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
            })}
        </svg>
    );
};

export default Sparkline;
