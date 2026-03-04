import { T, PEND, DP } from "../../theme/theme";

const Sidebar = ({
    view, setView, activeData, filtered,
    sheetF, setSheetF, sheets,
    pendF, setPendF, allPends, pendSum,
    maqF, setMaqF, allMaqs,
}) => {
    const SideBtn = ({ label, k, icon }) => (
        <button onClick={() => setView(k)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 14px", borderRadius: 7, marginBottom: 3, cursor: "pointer",
            background: view === k ? T.redDark + "33" : "transparent",
            border: `1px solid ${view === k ? T.red : "transparent"}`,
            color: view === k ? "#fff" : T.sub, fontSize: 11, fontWeight: view === k ? 700 : 400,
            transition: "all .15s", textAlign: "left"
        }}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icon}</span>
            <span>{label}</span>
            {view === k && <span style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: T.red }} />}
        </button>
    );

    return (
        <aside style={{ width: 210, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 10px" }}>

                <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>NAVEGACAO</div>
                <SideBtn label="Dashboard" k="dash" icon="◈" />
                <SideBtn label="Analise" k="analytics" icon="▲" />
                <SideBtn label="Historico" k="history" icon="≡" />
                <SideBtn label="Importar" k="import" icon="↑" />

                <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
                <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>ABA</div>
                {sheets.map(sh => {
                    const active = sheetF === sh;
                    const cnt = sh === "TODOS" ? activeData.length : activeData.filter(p => (p.sheet || p.situacao || "TODOS") === sh).length;
                    return (
                        <button key={sh} onClick={() => setSheetF(sh)} className="hbtn" style={{
                            width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 7, marginBottom: 3,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: active ? T.redDark + "33" : "transparent",
                            border: `1px solid ${active ? T.red : "transparent"}`,
                            color: active ? "#fff" : T.sub, fontSize: 10, fontWeight: active ? 700 : 400
                        }}>
                            <span>{sh === "TODOS" ? "Todos" : sh === "PIQUETES BRASA" ? "Piq. Brasa" : "Proximos"}</span>
                            <span style={{ background: active ? T.red : "#1E1E1E", color: active ? "#fff" : T.dim, borderRadius: 10, padding: "1px 8px", fontSize: 9, fontWeight: 700 }}>{cnt}</span>
                        </button>
                    );
                })}

                <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
                <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>PENDENCIA</div>
                <button onClick={() => setPendF("TODAS")} className="hbtn" style={{ width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, background: pendF === "TODAS" ? T.redDark + "33" : "transparent", border: `1px solid ${pendF === "TODAS" ? T.red : "transparent"}`, color: pendF === "TODAS" ? "#fff" : T.sub, fontSize: 10 }}>Todas as pendencias</button>
                {allPends.map(p => {
                    const c = PEND[p] || DP; const active = pendF === p;
                    return (
                        <button key={p} onClick={() => setPendF(active ? "TODAS" : p)} className="hbtn" style={{
                            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "6px 10px", borderRadius: 6, marginBottom: 3, fontSize: 10,
                            background: active ? c.bg : "transparent", border: `1px solid ${active ? c.bd : "transparent"}`,
                            color: active ? c.fg : T.sub
                        }}>
                            <span style={{ fontWeight: active ? 700 : 400 }}>{p}</span>
                            <span style={{ fontSize: 9, opacity: .8, background: active ? c.bd + "44" : "#1E1E1E", padding: "1px 6px", borderRadius: 8 }}>{pendSum[p] || 0}</span>
                        </button>
                    );
                })}

                <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
                <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>MAQUINA</div>
                <button onClick={() => setMaqF("TODAS")} className="hbtn" style={{ width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, background: maqF === "TODAS" ? T.redDark + "33" : "transparent", border: `1px solid ${maqF === "TODAS" ? T.red : "transparent"}`, color: maqF === "TODAS" ? "#fff" : T.sub, fontSize: 10 }}>Todas as maquinas</button>
                {allMaqs.map(m => {
                    const active = maqF === m;
                    return (
                        <button key={m} onClick={() => setMaqF(active ? "TODAS" : m)} className="hbtn" style={{
                            width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, fontSize: 10,
                            background: active ? T.redDark + "33" : "transparent", border: `1px solid ${active ? T.red : "transparent"}`,
                            color: active ? "#fff" : T.sub, fontWeight: active ? 700 : 400
                        }}>{m}</button>
                    );
                })}
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 16px", fontSize: 9, color: T.dim, textAlign: "center" }}>
                {filtered.length} / {activeData.length} piquetes
            </div>
        </aside>
    );
};

export default Sidebar;
