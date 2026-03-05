import { useState } from "react";
import { T, STATUS } from "../theme/theme";
import { Badge, Tag, MachineTag } from "../components/ui";
import { exportPiquetePDF, exportPiqueteExcel } from "../utils/exportPiquete";

const DashboardView = ({ filtered, analytics, updates, pct, today, persist, history, activeData, search, setSearch, fmtW, unitLabel }) => {
    const [expanded, setExpanded] = useState({});

    return (
        <div>
            {/* Strip de KPIs + barra empilhada */}
            <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>
                    {[
                        { l: "TOTAL", v: analytics.total, c: T.text },
                        { l: "CONCLUIDOS", v: analytics.concl, c: "#22C55E" },
                        { l: "EM PROGRESSO", v: analytics.prog, c: "#3B82F6" },
                        { l: "PESO TOTAL", v: fmtW(analytics.totalPeso || 0, 0), c: "#A78BFA" },
                        { l: "AVANCO", v: `${pct}%`, c: "#22C55E" },
                    ].map(({ l, v, c }) => (
                        <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }} />
                            <div style={{ fontSize: 8, color: T.dim, letterSpacing: 2, marginBottom: 5 }}>{l}</div>
                            <div style={{ fontSize: 24, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 9, color: T.dim, whiteSpace: "nowrap", letterSpacing: 1 }}>AVANCO</div>
                    <div style={{ flex: 1, height: 8, background: T.muted, borderRadius: 8, overflow: "hidden", display: "flex" }}>
                        {[
                            { v: analytics.concl, c: "#22C55E" },
                            { v: analytics.prog, c: "#3B82F6" },
                        ].map(({ v, c }, i) => (
                            <div key={i} style={{ width: `${analytics.total > 0 ? (v / analytics.total) * 100 : 0}%`, height: "100%", background: c, transition: "width .6s" }} />
                        ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 800, whiteSpace: "nowrap" }}>{pct}%</div>
                </div>
            </div>

            {/* Search bar */}
            <div style={{ padding: "12px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center", background: T.surface }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.dim, fontSize: 16, pointerEvents: "none" }}>⌕</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por piquete, CT ou material..." style={{ width: "100%", paddingLeft: 36 }} />
                </div>
                {search && <button onClick={() => setSearch("")} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.sub, borderRadius: 7, padding: "8px 12px", fontSize: 11 }}>✕</button>}
                <div style={{ fontSize: 11, color: T.dim, whiteSpace: "nowrap" }}>{filtered.length} / {activeData.length}</div>
            </div>

            {/* Piquete cards */}
            <div style={{ padding: "16px 28px" }}>
                {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: T.dim, fontSize: 12 }}>Nenhum piquete encontrado.</div>}
                {filtered.map(p => {
                    const u = updates[p.id] || {};
                    const isExp = expanded[p.id];

                    const st = STATUS[u.status];
                    const borderColor = st ? st.border : T.border;
                    const glowColor = st ? st.glow : "transparent";
                    const progPct = u.status === "CONCLUÍDO" ? 100 : u.status === "EM PROGRESSO" ? 50 : 0;
                    return (
                        <div key={p.id} className="pcard" style={{
                            background: T.card, border: `1px solid ${borderColor}`,
                            borderRadius: 12, marginBottom: 10, overflow: "hidden",
                            boxShadow: `0 2px 12px ${glowColor}`
                        }}>
                            {progPct > 0 && (
                                <div style={{ height: 3, background: T.muted }}>
                                    <div style={{ height: "100%", width: `${progPct}%`, background: st?.fg, transition: "width .4s" }} />
                                </div>
                            )}

                            <div style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                                        <span style={{ color: T.red, fontWeight: 900, fontSize: 14, letterSpacing: .5 }}>CT {p.ct}</span>
                                        <span style={{ color: T.border }}>│</span>
                                        <span style={{ color: T.dim, fontSize: 10 }}>{p.sheet === "PRÓXIMOS" ? "PROXIMOS" : "PIQ. BRASA"}</span>
                                        <span style={{ color: T.border }}>│</span>
                                        <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: 11 }}>{fmtW(p.peso_apto_kg || p.peso_kg || 0, 2)}</span>
                                        {u.status && <Badge label={u.status} />}
                                        <span style={{ marginLeft: "auto", fontSize: 9, color: T.dim }}>{u.updatedAt && `↻ ${u.updatedAt}`}</span>
                                    </div>

                                    <div style={{ color: T.sub, fontSize: 10, marginBottom: 8, fontFamily: "monospace", letterSpacing: .3, wordBreak: "break-all" }}>{p.piquete}</div>

                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                                        {p.pendencias.map(pd => <Tag key={pd} label={pd} />)}
                                        {p.pendencias.length > 0 && <span style={{ color: T.border, fontSize: 10 }}>·</span>}
                                        {p.maquinas.map(m => <MachineTag key={m} label={m} />)}
                                    </div>

                                    {(u.responsavel || u.obs) && (
                                        <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                                            {u.responsavel && <span style={{ color: T.sub, fontSize: 10 }}>👤 {u.responsavel}</span>}
                                            {u.obs && <span style={{ color: T.dim, fontSize: 10, fontStyle: "italic" }}>"{u.obs.slice(0, 80)}"</span>}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: 7, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    <button onClick={() => exportPiquetePDF(p, updates, unitLabel, fmtW)} title="Exportar PDF" style={{
                                        background: "#1A0808", border: `1px solid ${T.red}`,
                                        color: "#ff8080", borderRadius: 7, padding: "6px 10px", fontSize: 10, fontWeight: 700
                                    }}>📄 PDF</button>
                                    <button onClick={() => exportPiqueteExcel(p, updates, unitLabel, fmtW)} title="Exportar Excel" style={{
                                        background: "#0A1F0F", border: "1px solid #166534",
                                        color: "#22C55E", borderRadius: 7, padding: "6px 10px", fontSize: 10, fontWeight: 700
                                    }}>📊 Excel</button>

                                    <button onClick={() => setExpanded(e => ({ ...e, [p.id]: !e[p.id] }))} style={{
                                        background: T.card, border: `1px solid ${T.border}`,
                                        color: T.sub, borderRadius: 7, padding: "6px 10px", fontSize: 10
                                    }}>{isExp ? "▲" : "▼"} {(p.items || p.itens || []).length}</button>
                                </div>
                            </div>

                            {/* Items table */}
                            {isExp && (
                                <div style={{ borderTop: `1px solid ${T.border}`, overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ background: "#0F0F0F" }}>
                                                {["PRIO", "OV", "OP", "POSICAO", "MATERIAL", "QTD", `PESO ${unitLabel}`, "MAQ", "PENDENCIA"].map(h => (
                                                    <th key={h} style={{ padding: "7px 12px", textAlign: "left", fontSize: 9, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(p.items || p.itens || []).map((it, idx) => (
                                                <tr key={idx} className="row" style={{ borderBottom: `1px solid #151515` }}>
                                                    <td style={{ padding: "6px 12px", color: T.red, fontWeight: 800, fontSize: 11 }}>{it.prio}</td>
                                                    <td style={{ padding: "6px 12px", color: T.sub, fontSize: 10 }}>{it.ov}</td>
                                                    <td style={{ padding: "6px 12px", color: T.dim, fontFamily: "monospace", fontSize: 9 }}>{it.op}</td>
                                                    <td style={{ padding: "6px 12px", color: T.text, fontSize: 10 }}>{it.posicao}</td>
                                                    <td style={{ padding: "6px 12px", color: T.sub, fontSize: 10, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.material || it.desc}</td>
                                                    <td style={{ padding: "6px 12px", color: T.text, textAlign: "right", fontWeight: 600 }}>{it.qtd}</td>
                                                    <td style={{ padding: "6px 12px", color: "#A78BFA", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>{fmtW(it.peso || 0, 3)}</td>
                                                    <td style={{ padding: "6px 12px" }}>
                                                        <span style={{ color: "#38BDF8", background: "#071420", border: "1px solid #0369A1", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 9 }}>{it.maq}</span>
                                                    </td>
                                                    <td style={{ padding: "6px 12px" }}>{(it.pendencia || it.etapa) && (it.pendencia || it.etapa) !== "Finalizado" && (it.pendencia || it.etapa) !== "-" && <Tag label={it.pendencia || it.etapa} />}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardView;
