import { T } from "../theme/theme";
import { Badge } from "../components/ui";

const HistoryView = ({ history }) => (
    <div style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>HISTORICO DE ATUALIZACOES</div>
        {history.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: T.dim, fontSize: 12 }}>Nenhum registro ainda.<br />Atualize um piquete para comecar.</div>
        )}
        {history.map((e, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 70, textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: T.red, fontWeight: 700 }}>{e.date}</div>
                    <div style={{ fontSize: 9, color: T.dim }}>{e.time}</div>
                </div>
                <div style={{ width: 1, background: T.border, alignSelf: "stretch" }} />
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ color: T.red, fontSize: 12, fontWeight: 800 }}>CT {e.ct}</span>
                        <span style={{ color: T.dim, fontSize: 10 }}>{e.piquete?.slice(0, 50)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {e.changes?.status && <Badge label={e.changes.status} />}
                        {e.changes?.responsavel && <span style={{ color: T.sub, fontSize: 10 }}>👤 {e.changes.responsavel}</span>}
                        {e.changes?.pesoRealizado && <span style={{ color: "#A78BFA", fontSize: 10 }}>⚖ {e.changes.pesoRealizado}t</span>}
                        {e.changes?.obs && <span style={{ color: T.dim, fontSize: 10, fontStyle: "italic" }}>"{e.changes.obs.slice(0, 60)}"</span>}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default HistoryView;
