import { PEND, DP } from "../../theme/theme";

const Tag = ({ label }) => {
    const c = PEND[label] || DP;
    return (
        <span style={{
            background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
            borderRadius: 3, padding: "2px 7px", fontSize: 9, fontWeight: 700, letterSpacing: .5
        }}>
            {label}
        </span>
    );
};

export default Tag;
