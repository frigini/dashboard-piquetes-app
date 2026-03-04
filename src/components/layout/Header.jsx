import { T, LOGO_SRC } from "../../theme/theme";

const Header = ({ analytics, pct, today, timeStr }) => (
    <header style={{
        background: `linear-gradient(135deg, ${T.redDark} 0%, ${T.red} 55%, ${T.redDark} 100%)`,
        padding: "0 28px", height: 70, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
        boxShadow: "0 4px 32px #00000088, inset 0 1px 0 rgba(255,255,255,.1)"
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
                <img src={LOGO_SRC} alt="Brametal" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", boxShadow: "0 0 24px #00000088", display: "block" }} />
                <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)" }} />
            </div>
            <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: 4, lineHeight: 1, textShadow: "0 2px 12px #00000066" }}>BRAMETAL</div>
                <div style={{ fontSize: 9, color: "rgba(255,220,220,.8)", letterSpacing: 5, marginTop: 3, fontWeight: 500 }}>CONTROLE DE PIQUETES</div>
            </div>
        </div>

        <div style={{ display: "flex", gap: 0, alignItems: "stretch", background: "rgba(0,0,0,.2)", borderRadius: 10, padding: 2, border: "1px solid rgba(255,255,255,.1)" }}>
            {[
                { l: "PIQUETES", v: analytics.total },
                { l: "CONCLUIDOS", v: analytics.concl },
                { l: "PROGRESSO", v: analytics.prog },
                { l: "PESO TOTAL", v: `${analytics.totalPeso.toFixed(0)}t` },
            ].map(({ l, v }, i, arr) => (
                <div key={l} style={{ padding: "8px 18px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,.1)" : "none" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,200,200,.7)", letterSpacing: 2, marginTop: 3 }}>{l}</div>
                </div>
            ))}
            <div style={{ padding: "8px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: 8, color: "rgba(255,200,200,.7)", letterSpacing: 2, marginTop: 3 }}>AVANCO</div>
            </div>
        </div>

        <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,200,200,.6)", letterSpacing: 2, marginBottom: 3 }}>ATUALIZACAO</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{today} {timeStr}</div>
        </div>
    </header>
);

export default Header;
