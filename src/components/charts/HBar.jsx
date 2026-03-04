import { T } from "../../theme/theme";

const HBar = ({ label, value, max, color, sub, onClick, active }) => (
    <div onClick={onClick} style={{
        cursor: onClick ? "pointer" : "default",
        padding: "8px 10px", borderRadius: 7, marginBottom: 4,
        background: active ? "#1E1E1E" : "transparent",
        border: `1px solid ${active ? color : "transparent"}`,
        transition: "all .2s"
    }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: active ? color : T.sub, fontWeight: active ? 700 : 400 }}>{label}</span>
            <span style={{ fontSize: 10, color: T.text, fontWeight: 700 }}>{value}<span style={{ color: T.dim, marginLeft: 4, fontWeight: 400 }}>{sub}</span></span>
        </div>
        <div style={{ height: 6, background: T.muted, borderRadius: 6, overflow: "hidden" }}>
            <div style={{
                height: "100%", width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color,
                borderRadius: 6, transition: "width .6s cubic-bezier(.4,0,.2,1)",
                boxShadow: active ? `0 0 8px ${color}66` : "none"
            }} />
        </div>
    </div>
);

export default HBar;
