import { STATUS, DP } from "../../theme/theme";

const Badge = ({ label, style: s = {} }) => {
    const c = STATUS[label] || DP;
    return (
        <span style={{
            background: c.bg, color: c.fg, border: `1px solid ${c.border || c.bd}`,
            borderRadius: 4, padding: "2px 9px", fontSize: 9, fontWeight: 700,
            letterSpacing: .8, boxShadow: `0 0 8px ${c.glow || "transparent"}`, ...s
        }}>
            {label}
        </span>
    );
};

export default Badge;
