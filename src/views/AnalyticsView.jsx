import { T, PEND, DP, MAQ_COLORS } from "../theme/theme";
import { Badge, Tag, Ring, Donut } from "../components/ui";
import { HBar, LineChart } from "../components/charts";

const AnalyticsView = ({ analytics, updates, pct, actPend, setActPend, actMaq, setActMaq, setPendF, setMaqF, setView }) => (
    <div style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>ANALISE OPERACIONAL</div>

        {/* Status Cards com Ring */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[
                { l: "CONCLUIDOS", v: analytics.concl, c: "#22C55E", bg: "#0A1F0F" },
                { l: "EM PROGRESSO", v: analytics.prog, c: "#3B82F6", bg: "#0A1628" },
                { l: "BLOQUEADOS", v: analytics.bloq, c: T.red, bg: "#1A0808" },
                { l: "AGUARDANDO", v: analytics.agua, c: "#F59E0B", bg: "#1A1400" },
            ].map(({ l, v, c, bg }) => {
                const p2 = analytics.total > 0 ? Math.round(v / analytics.total * 100) : 0;
                return (
                    <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: 9, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>{l}</div>
                                <div style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                                <div style={{ fontSize: 10, color: T.dim, marginTop: 6 }}>{p2}% do total</div>
                            </div>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <Ring pct={p2} size={56} stroke={5} color={c} bg={bg} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: c }}>{p2}%</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Metricas pendentes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
                { l: "PESO PENDENTE", v: `${analytics.pendPeso.toFixed(1)}t`, sub: `de ${analytics.totalPeso.toFixed(0)}t`, c: "#F97316", pct: analytics.totalPeso > 0 ? Math.round(analytics.pendPeso / analytics.totalPeso * 100) : 0 },
                { l: "POSICOES ABERTAS", v: analytics.pendPos, sub: `em ${analytics.open.length} piquetes`, c: "#3B82F6", pct: 0 },
                { l: "AVANCO GERAL", v: `${pct}%`, sub: "concluido", c: "#22C55E", pct },
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
                                { pct: analytics.total > 0 ? (analytics.bloq / analytics.total * 100) : 0, color: T.red },
                                { pct: analytics.total > 0 ? (analytics.agua / analytics.total * 100) : 0, color: "#F59E0B" },
                            ]}
                            size={120}
                            stroke={14}
                            bg={T.muted}
                        />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{analytics.total}</div>
                            <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>{analytics.totalPeso.toFixed(0)}t</div>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            { l: "Concluido", v: analytics.concl, w: analytics.conclPeso, c: "#22C55E" },
                            { l: "Em Progresso", v: analytics.prog, w: analytics.progPeso, c: "#3B82F6" },
                            { l: "Bloqueado", v: analytics.bloq, w: analytics.bloqPeso, c: T.red },
                            { l: "Aguardando", v: analytics.agua, w: analytics.aguaPeso, c: "#F59E0B" }
                        ].map(st => (
                            <div key={st.l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.c }} />
                                    <div style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>{st.l}</div>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{st.v} - {st.w.toFixed(1)}t <span style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>({analytics.total > 0 ? Math.round(st.v / analytics.total * 100) : 0}%)</span></div>
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
                                <span style={{ marginLeft: "auto", fontSize: 9, color: T.sub }}>{v} piquetes · {analytics.pendW[k]?.toFixed(1)}t</span>
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
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Razao tonelagem / posicoes — priorize para maximo impacto com menor trabalho</div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["", "CT", "PIQUETE", "POS", "PESO", "ROI t/pos", "MAQUINAS", "STATUS"].map(h => (
                                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.esforco.map((p, i) => {
                            const u = updates[p.id] || {};
                            return (
                                <tr key={p.id} className="row" style={{ borderBottom: `1px solid ${T.border}`, cursor: "default" }}>
                                    <td style={{ padding: "9px 12px", fontSize: i < 3 ? 16 : 11, color: T.dim }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                                    <td style={{ padding: "9px 12px", color: T.red, fontWeight: 800, fontSize: 12 }}>{p.ct}</td>
                                    <td style={{ padding: "9px 12px", color: T.sub, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{p.piquete?.slice(0, 38)}</td>
                                    <td style={{ padding: "9px 12px", color: T.text, textAlign: "center", fontWeight: 700 }}>{p.pos}</td>
                                    <td style={{ padding: "9px 12px", color: "#A78BFA", fontWeight: 700 }}>{(p.peso_apto_kg || p.peso_kg || 0).toFixed(2)}t</td>
                                    <td style={{ padding: "9px 12px" }}>
                                        <span style={{ background: i === 0 ? "#0A1F0F" : i === 1 ? "#0A1628" : "#111", color: i === 0 ? "#22C55E" : i === 1 ? "#3B82F6" : T.sub, border: `1px solid ${i === 0 ? "#166534" : i === 1 ? "#1E40AF" : T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{p.score.toFixed(2)}</span>
                                    </td>
                                    <td style={{ padding: "9px 12px", color: T.dim, fontSize: 9 }}>{p.maquinas?.join(", ")}</td>
                                    <td style={{ padding: "9px 12px" }}>{u.status ? <Badge label={u.status} /> : <span style={{ color: T.dim, fontSize: 9 }}>—</span>}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Top peso */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>TOP PESO PENDENTE</div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Maior tonelagem em aberto — priorize para volume de entrega</div>
            {analytics.topPeso.map((p, i) => {
                const u = updates[p.id] || {}; const maxW = analytics.topPeso[0]?.peso_apto_kg || analytics.topPeso[0]?.peso_kg || 1;
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
                                <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? T.red : "#A78BFA", flexShrink: 0 }}>{(p.peso_apto_kg || p.peso_kg || 0).toFixed(1)}t</span>
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.pendencias.map(pd => <Tag key={pd} label={pd} />)}</div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: "right" }}>
                            {u.status ? <Badge label={u.status} /> : <span style={{ color: T.dim, fontSize: 9 }}>—</span>}
                            <div style={{ fontSize: 9, color: T.dim, marginTop: 3 }}>{(p.items || p.itens || []).length} pos</div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default AnalyticsView;
