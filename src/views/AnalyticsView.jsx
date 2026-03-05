import { useState } from "react";
import { T, PEND, DP, MAQ_COLORS } from "../theme/theme";
import { Tag, Ring, Donut } from "../components/ui";
import { HBar, LineChart } from "../components/charts";
import { exportAnalyticsPDF } from "../utils/exportPiquete";

const AnalyticsView = ({ analytics, updates, pct, actPend, setActPend, actMaq, setActMaq, setStatusF, setPendF, setMaqF, setView, fmtW, unitLabel }) => {
    const [expRows, setExpRows] = useState({});
    const toggleRow = id => setExpRows(e => ({ ...e, [id]: !e[id] }));
    return (
        <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4 }}>ANALISE OPERACIONAL</div>
                <button onClick={() => exportAnalyticsPDF(analytics, pct, unitLabel, fmtW)} style={{
                    background: "#1A0808", border: `1px solid ${T.red}`,
                    color: "#ff8080", borderRadius: 8, padding: "8px 16px", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 6
                }}>📄 Exportar PDF</button>
            </div>

            {/* Status Cards — CONCLUIDOS e EM PROGRESSO */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                    { l: "TOTAL PIQUETES", v: analytics.total, c: T.text, bg: T.card, st: "TODOS" },
                    { l: "CONCLUIDOS", v: analytics.concl, c: "#22C55E", bg: "#0A1F0F", st: "CONCLUÍDO" },
                    { l: "EM PROGRESSO", v: analytics.prog, c: "#3B82F6", bg: "#0A1628", st: "EM PROGRESSO" },
                    { l: "AVANCO GERAL", v: `${pct}%`, c: "#22C55E", bg: T.card, st: null },
                ].map(({ l, v, c, bg, st }) => {
                    const p2 = typeof v === "number" && analytics.total > 0 ? Math.round(v / analytics.total * 100) : 0;
                    const isClickable = st !== null;
                    return (
                        <div key={l}
                            onClick={() => { if (isClickable) { setStatusF(st); setView("dash"); } }}
                            style={{
                                background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 16px", position: "relative", overflow: "hidden",
                                cursor: isClickable ? "pointer" : "default", opacity: isClickable ? 1 : 0.9, transition: "all 0.2s",
                                ":hover": isClickable ? { borderColor: c, boxShadow: `0 0 10px ${c}33` } : {}
                            }}
                            className={isClickable ? "pcard" : ""}
                        >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c }} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ fontSize: 9, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>{l}</div>
                                    <div style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                                    {typeof v === "number" && <div style={{ fontSize: 10, color: T.dim, marginTop: 6 }}>{p2}% do total</div>}
                                </div>
                                {typeof v === "number" && v !== analytics.total && (
                                    <div style={{ position: "relative", flexShrink: 0 }}>
                                        <Ring pct={p2} size={56} stroke={5} color={c} bg={bg} />
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: c }}>{p2}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Metricas pendentes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                    { l: "PESO PENDENTE", v: fmtW(analytics.pendPeso, 1), sub: `de ${fmtW(analytics.totalPeso, 0)}`, c: "#F97316", pct: analytics.totalPeso > 0 ? Math.round(analytics.pendPeso / analytics.totalPeso * 100) : 0 },
                    { l: "POSICOES ABERTAS", v: analytics.pendPos, sub: `em ${analytics.open.length} piquetes`, c: "#3B82F6", pct: 0 },
                    { l: "PESO CONCLUIDO", v: fmtW(analytics.conclPeso, 1), sub: `de ${fmtW(analytics.totalPeso, 0)}`, c: "#22C55E", pct: analytics.totalPeso > 0 ? Math.round(analytics.conclPeso / analytics.totalPeso * 100) : 0 },
                ].map(({ l, v, sub, c, pct: p2 }) => (
                    <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 16px" }}>
                        <div style={{ fontSize: 9, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>{l}</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                        <div style={{ fontSize: 10, color: T.dim, marginTop: 6, marginBottom: 10 }}>{sub}</div>
                        {p2 > 0 && <div style={{ height: 4, background: T.muted, borderRadius: 4 }}><div style={{ height: "100%", width: `${p2}%`, background: c, borderRadius: 4, transition: "width .6s" }} /></div>}
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 12, marginBottom: 20 }}>
                {/* Donut status */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 16 }}>DISTRIBUICAO STATUS</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <Donut
                                data={[
                                    { pct: analytics.total > 0 ? (analytics.concl / analytics.total * 100) : 0, color: "#22C55E" },
                                    { pct: analytics.total > 0 ? (analytics.prog / analytics.total * 100) : 0, color: "#3B82F6" },
                                ]}
                                size={120}
                                stroke={14}
                                bg={T.muted}
                            />
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{analytics.total}</div>
                                <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>{fmtW(analytics.totalPeso, 0)}</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { l: "Concluido", v: analytics.concl, w: analytics.conclPeso, c: "#22C55E" },
                                { l: "Em Progresso", v: analytics.prog, w: analytics.progPeso, c: "#3B82F6" },
                            ].map(st => (
                                <div key={st.l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: st.c }} />
                                        <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{st.l}</div>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{st.v} - {fmtW(st.w, 1)} <span style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>({analytics.total > 0 ? Math.round(st.v / analytics.total * 100) : 0}%)</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Evolucao */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3 }}>EVOLUCAO DE CONCLUSOES</div>
                        {analytics.evo.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>{analytics.evo[analytics.evo.length - 1].v} concluidos</div>}
                    </div>
                    <LineChart data={analytics.evo} />
                </div>
            </div>

            {/* Gargalos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {/* Por pendencia */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>GARGALOS POR PENDENCIA</div>
                    <div style={{ fontSize: 10, color: T.dim, marginBottom: 14 }}>Clique para filtrar o dashboard</div>
                    {analytics.gPend.map(([k, v]) => {
                        const c = PEND[k] || DP; const maxV = analytics.gPend[0][1];
                        const active = actPend === k;
                        return (
                            <div key={k} onClick={() => { setActPend(active ? null : k); setPendF(active ? "TODAS" : k); setView("dash"); }}
                                style={{
                                    cursor: "pointer", padding: "8px 10px", borderRadius: 8, marginBottom: 6,
                                    background: active ? c.bg : "transparent", border: `1px solid ${active ? c.bd : "transparent"}`,
                                    transition: "all .2s"
                                }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                    <Tag label={k} />
                                    <span style={{ marginLeft: "auto", fontSize: 9, color: T.sub }}>{v} piquetes · {fmtW(analytics.pendW[k] || 0, 1)}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ flex: 1, height: 6, background: T.muted, borderRadius: 6, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${maxV > 0 ? (v / maxV) * 100 : 0}%`, background: c.bd, borderRadius: 6, transition: "width .6s" }} />
                                    </div>
                                    <span style={{ fontSize: 10, color: c.fg, fontWeight: 700, width: 32, textAlign: "right" }}>{analytics.open.length > 0 ? Math.round(v / analytics.open.length * 100) : 0}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Por maquina */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>GARGALOS POR MAQUINA</div>
                    <div style={{ fontSize: 10, color: T.dim, marginBottom: 14 }}>Clique para filtrar o dashboard</div>
                    {analytics.gMaq.map(([k, v], i) => {
                        const c = MAQ_COLORS[i % MAQ_COLORS.length]; const maxV = analytics.gMaq[0][1];
                        const active = actMaq === k;
                        return (
                            <HBar key={k} label={k} value={v} max={maxV} color={c}
                                sub={`piquetes`} active={active}
                                onClick={() => { setActMaq(active ? null : k); setMaqF(active ? "TODAS" : k); setView("dash"); }} />
                        );
                    })}
                </div>
            </div>

            {/* Menor esforco */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>MENOR ESFORCO / MAIOR RETORNO</div>
                <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Razao peso / posicoes — priorize para maximo impacto com menor trabalho</div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["", "CT", "PIQUETE", "POS", `PESO ${unitLabel}`, `ROI ${unitLabel}/pos`, "MAQUINAS", "PENDENCIAS"].map(h => (
                                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.esforco.map((p, i) => {
                                const items = p.items || p.itens || [];
                                const isExp = expRows[p.id];
                                return [
                                    <tr key={p.id} className="row" onClick={() => toggleRow(p.id)} style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                                        <td style={{ padding: "9px 12px", fontSize: i < 3 ? 16 : 11, color: T.dim }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                                        <td style={{ padding: "9px 12px", color: T.red, fontWeight: 800, fontSize: 12 }}>{p.ct}</td>
                                        <td style={{ padding: "9px 12px", color: T.sub, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{p.piquete?.slice(0, 38)}</td>
                                        <td style={{ padding: "9px 12px", color: T.text, textAlign: "center", fontWeight: 700 }}>
                                            <span style={{ cursor: "pointer" }}>{isExp ? "▲" : "▼"} {p.pos}</span>
                                        </td>
                                        <td style={{ padding: "9px 12px", color: "#A78BFA", fontWeight: 700 }}>{fmtW(p.peso_apto_kg || p.peso_kg || 0, 2)}</td>
                                        <td style={{ padding: "9px 12px" }}>
                                            <span style={{ background: i === 0 ? "#0A1F0F" : i === 1 ? "#0A1628" : "#111", color: i === 0 ? "#22C55E" : i === 1 ? "#3B82F6" : T.sub, border: `1px solid ${i === 0 ? "#166534" : i === 1 ? "#1E40AF" : T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{p.score.toFixed(2)}</span>
                                        </td>
                                        <td style={{ padding: "9px 12px", color: T.dim, fontSize: 9 }}>{p.maquinas?.join(", ")}</td>
                                        <td style={{ padding: "9px 12px" }}>{p.pendencias && p.pendencias.length > 0 ? <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.pendencias.map(pd => <Tag key={pd} label={pd} />)}</span> : <span style={{ color: T.dim, fontSize: 9 }}>—</span>}</td>
                                    </tr>,
                                    isExp && items.length > 0 && (
                                        <tr key={p.id + "_items"}>
                                            <td colSpan={8} style={{ padding: 0, background: "#0A0A0A" }}>
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead>
                                                        <tr style={{ background: "#111" }}>
                                                            {["PRIO", "OV", "OP", "POSICAO", "MATERIAL", "QTD", `PESO ${unitLabel}`, "MAQ", "PENDENCIA"].map(h => (
                                                                <th key={h} style={{ padding: "5px 10px", textAlign: "left", fontSize: 8, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, fontWeight: 600 }}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((it, idx) => (
                                                            <tr key={idx} style={{ borderBottom: `1px solid #151515` }}>
                                                                <td style={{ padding: "5px 10px", color: T.red, fontWeight: 800, fontSize: 10 }}>{it.prio}</td>
                                                                <td style={{ padding: "5px 10px", color: T.sub, fontSize: 9 }}>{it.ov}</td>
                                                                <td style={{ padding: "5px 10px", color: T.dim, fontFamily: "monospace", fontSize: 8 }}>{it.op}</td>
                                                                <td style={{ padding: "5px 10px", color: T.text, fontSize: 9 }}>{it.posicao}</td>
                                                                <td style={{ padding: "5px 10px", color: T.sub, fontSize: 9, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.material || it.desc}</td>
                                                                <td style={{ padding: "5px 10px", color: T.text, textAlign: "right", fontWeight: 600, fontSize: 10 }}>{it.qtd}</td>
                                                                <td style={{ padding: "5px 10px", color: "#A78BFA", textAlign: "right", fontWeight: 600, fontFamily: "monospace", fontSize: 9 }}>{fmtW(it.peso || 0, 3)}</td>
                                                                <td style={{ padding: "5px 10px" }}>
                                                                    <span style={{ color: "#38BDF8", background: "#071420", border: "1px solid #0369A1", borderRadius: 4, padding: "1px 6px", fontFamily: "monospace", fontSize: 8 }}>{it.maq}</span>
                                                                </td>
                                                                <td style={{ padding: "5px 10px" }}>{(it.pendencia || it.etapa) && (it.pendencia || it.etapa) !== "Finalizado" && (it.pendencia || it.etapa) !== "-" && <Tag label={it.pendencia || it.etapa} />}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    ),
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top peso */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>TOP PESO PENDENTE</div>
                <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Maior peso em aberto — priorize para volume de entrega</div>
                {analytics.topPeso.map((p, i) => {
                    const maxW = analytics.topPeso[0]?.peso_apto_kg || analytics.topPeso[0]?.peso_kg || 1;
                    const c = i === 0 ? T.red : i === 1 ? "#F97316" : i === 2 ? "#F59E0B" : T.muted;
                    return (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, marginBottom: 6, background: i === 0 ? "#1A0808" : "transparent", border: `1px solid ${i === 0 ? T.red : T.border}`, transition: "all .2s" }}>
                            <div style={{ fontSize: i < 3 ? 16 : 10, width: 24, textAlign: "center", flexShrink: 0 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                            <div style={{ width: 40, fontSize: 11, color: T.red, fontWeight: 800, flexShrink: 0 }}>CT {p.ct}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                                    <div style={{ flex: 1, height: 8, background: T.muted, borderRadius: 4, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${((p.peso_apto_kg || p.peso_kg || 0) / maxW) * 100}%`, background: c, borderRadius: 4, transition: "width .6s", boxShadow: i === 0 ? `0 0 8px ${T.red}66` : "none" }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? T.red : "#A78BFA", flexShrink: 0 }}>{fmtW(p.peso_apto_kg || p.peso_kg || 0, 1)}</span>
                                </div>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.pendencias.map(pd => <Tag key={pd} label={pd} />)}</div>
                            </div>
                            <div style={{ flexShrink: 0, textAlign: "right" }}>
                                <div style={{ fontSize: 9, color: T.dim }}>{(p.items || p.itens || []).length} pos</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalyticsView;
