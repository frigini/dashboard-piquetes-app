import { useMemo } from "react";

export default function useAnalytics(filtered, updates, history, pendF, maqF) {
    return useMemo(() => {
        const baseDateString = (d) => {
            if (!d) return null;
            if (d.includes('/')) return d.substring(0, 10);
            return new Date(d).toLocaleDateString("pt-BR");
        };

        const calcStatus = (p) => {
            if (updates[p.id]?.status) return updates[p.id].status;
            const op = (p.status_op || "").toUpperCase();
            const sit = (p.situacao || "").toUpperCase();
            if (op === "ENCERRADO" || sit === "FINALIZADO" || sit === "ENCER") return "CONCLUÍDO";
            if (p.pendencias && p.pendencias.length > 0) return "EM PROGRESSO";
            return "AGUARDANDO";
        };

        const all = filtered;
        const mapped = all.map(p => ({ ...p, calcSt: calcStatus(p) }));

        const conclArr = mapped.filter(p => p.calcSt === "CONCLUÍDO");
        const progArr = mapped.filter(p => p.calcSt === "EM PROGRESSO");
        const bloqArr = mapped.filter(p => p.calcSt === "BLOQUEADO");
        const aguaArr = mapped.filter(p => p.calcSt === "AGUARDANDO");
        const concl = conclArr.length;
        const prog = progArr.length;
        const bloq = bloqArr.length;
        const agua = aguaArr.length;
        const open = mapped.filter(p => p.calcSt !== "CONCLUÍDO");

        // Peso por status
        const pesoPorStatus = (arr) => arr.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
        const conclPeso = pesoPorStatus(conclArr);
        const progPeso = pesoPorStatus(progArr);
        const bloqPeso = pesoPorStatus(bloqArr);
        const aguaPeso = pesoPorStatus(aguaArr);

        const pendC = {}, pendW = {}, maqC = {};
        let pendPeso = 0;
        let pendPos = 0;

        open.forEach(p => {
            const pWeight = (p.peso_apto_kg || p.peso_kg || 0);
            const items = p.items || p.itens || [];

            // Check if piquete matches filters
            const matchesAba = !pendF || pendF === "TODAS" || p.pendencias.includes(pendF); // Note: ABA is already handled by 'filtered' prop
            const matchesPend = !pendF || pendF === "TODAS" || p.pendencias.includes(pendF);
            const matchesMaq = !maqF || maqF === "TODAS" || p.maquinas.includes(maqF);

            if (matchesPend && matchesMaq) {
                pendPeso += pWeight;
                pendPos += Math.max(items.length, p.pendencias.length, 1);
            }

            // Distribute stats for charts
            // 1. Count unique piquetes per pendencia and maquina
            p.pendencias.forEach(x => {
                if (!pendF || pendF === "TODAS" || x === pendF) {
                    pendC[x] = (pendC[x] || 0) + 1;
                }
            });
            p.maquinas.forEach(m => {
                if (!maqF || maqF === "TODAS" || m === maqF) {
                    maqC[m] = (maqC[m] || 0) + 1;
                }
            });

            // 2. Accurately distribute weights based on items
            if (items.length === 0) {
                p.pendencias.forEach(x => {
                    if (!pendF || pendF === "TODAS" || x === pendF) {
                        pendW[x] = (pendW[x] || 0) + pWeight;
                    }
                });
            } else {
                items.forEach(i => {
                    if (!pendF || pendF === "TODAS" || i.pendencia === pendF) {
                        if (i.pendencia) {
                            const iWeight = i.peso > 0 ? (i.peso / 1000) : (pWeight / items.length);
                            pendW[i.pendencia] = (pendW[i.pendencia] || 0) + iWeight;
                        }
                    }
                });
            }
        });

        const gPend = Object.entries(pendC).sort((a, b) => b[1] - a[1]);
        const gMaq = Object.entries(maqC).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const esforco = open.map(p => ({ ...p, score: (p.peso_apto_kg || p.peso_kg || 0) / Math.max((p.items || p.itens || []).length, 1), pos: (p.items || p.itens || []).length })).sort((a, b) => b.score - a.score).slice(0, 10);
        const topPeso = [...open].sort((a, b) => (b.peso_apto_kg || b.peso_kg || 0) - (a.peso_apto_kg || a.peso_kg || 0)).slice(0, 10);

        // Evolução de Conclusões: Cruza Data Contratual (quando aplicável) e as Atualizações
        const dayMap = {};
        mapped.forEach(p => {
            if (p.calcSt === "CONCLUÍDO") {
                // Se foi atualizado no history do usuário, usa essa data, senão usa a contratual ou 'Anterior'
                const userHist = history.slice().reverse().find(e => e.id === p.id && e.changes?.status === "CONCLUÍDO");
                if (userHist) {
                    dayMap[userHist.date] = (dayMap[userHist.date] || 0) + 1;
                } else if (p.dt_contrat) {
                    const d = baseDateString(p.dt_contrat);
                    if (d) dayMap[d] = (dayMap[d] || 0) + 1;
                } else {
                    dayMap["Anterior"] = (dayMap["Anterior"] || 0) + 1;
                }
            }
        });

        let evoKeys = Object.keys(dayMap).sort((a, b) => {
            if (a === "Anterior") return -1;
            if (b === "Anterior") return 1;
            const pa = a.split("/"); const pb = b.split("/");
            return new Date(`${pa[2]}-${pa[1]}-${pa[0]}`) - new Date(`${pb[2]}-${pb[1]}-${pb[0]}`);
        });

        let cum = 0;
        const evo = evoKeys.map(d => { cum += dayMap[d]; return { d, v: cum }; });

        const totalPeso = all.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
        return { total: all.length, concl, prog, bloq, agua, conclPeso, progPeso, bloqPeso, aguaPeso, open, pendC, pendW, gPend, gMaq, esforco, topPeso, evo, totalPeso, pendPeso, pendPos };
    }, [updates, history, filtered, pendF, maqF]);
}
