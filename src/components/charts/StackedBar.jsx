import { T } from "../../theme/theme";

const StackedBar = ({ segments, total, h = 10 }) => (
    <div style={{ display: "flex", height: h, borderRadius: h, overflow: "hidden", background: T.muted, gap: 1 }}>
        {segments.map(({ pct, color }, i) => (
            <div key={i} style={{ width: `${pct}%`, background: color, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
        ))}
    </div>
);

export default StackedBar;
