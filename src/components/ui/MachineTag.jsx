const MachineTag = ({ label }) => (
    <span style={{
        background: "#111", color: "#555", border: "1px solid #222",
        borderRadius: 3, padding: "2px 6px", fontSize: 9, fontFamily: "monospace"
    }}>
        {label}
    </span>
);

export default MachineTag;
