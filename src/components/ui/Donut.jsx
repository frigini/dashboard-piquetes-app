import { T } from "../../theme/theme";

const Donut = ({ data = [], size = 80, stroke = 7, bg = "#1A1A1A" }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;

    let currentPct = 0;

    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
            {data.map((item, i) => {
                const dash = (item.pct / 100) * circ;
                const offset = -(currentPct / 100) * circ;
                currentPct += item.pct;

                return item.pct > 0 ? (
                    <circle
                        key={i}
                        cx={size / 2} cy={size / 2} r={r}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={stroke}
                        strokeDasharray={`${dash} ${circ}`}
                        strokeDashoffset={offset}
                        strokeLinecap="butt"
                        style={{ transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1), stroke-dashoffset .8s calc" }}
                    />
                ) : null;
            })}
        </svg>
    );
};

export default Donut;
