import { useMemo } from "react";

export default function useAnalytics(filtered, updates, history, pendF, maqF) {
    return useMemo(() => {
        const all = filtered;
        const concl = all.filter(p => updates[p.id]?.status === "CONCLUÍDO").length;
        const prog = all.filter(p => updates[p.id]?.status === "EM PROGRESSO").length;
        const bloq = all.filter(p => updates[p.id]?.status === "BLOQUEADO").length;
        const agua = all.length - concl - prog - bloq;
        const open = all.filter(p => updates[p.id]?.status !== "CONCLUÍDO");
        const pendC = {}, pendW = {}, maqC = {};
        let pendPeso = 0;
        let pendPos = 0;

        open.forEach(p => {
            let items = p.items || p.itens || [];
            if (items.length === 0) {
                const matchPend = !pendF || pendF === "TODAS" || p.pendencias.includes(pendF);
                const matchMaq = !maqF || maqF === "TODAS" || p.maquinas.includes(maqF);
                if (matchPend && matchMaq) {
                    pendPeso += (p.peso_apto_kg || p.peso_kg || 0);
                    pendPos += p.pendencias.length;
                }
                p.pendencias.forEach(x => {
                    if (!pendF || pendF === "TODAS" || x === pendF) {
                        pendC[x] = (pendC[x] || 0) + 1;
                        pendW[x] = (pendW[x] || 0) + (p.peso_apto_kg || p.peso_kg || 0);
                    }
                });
                p.maquinas.forEach(m => {
                    if (!maqF || maqF === "TODAS" || m === maqF) maqC[m] = (maqC[m] || 0) + 1;
                });
                return;
            }

            items.forEach(i => {
                const matchPend = !pendF || pendF === "TODAS" || i.pendencia === pendF;
                const matchMaq = !maqF || maqF === "TODAS" || i.maq === maqF;
                if (matchPend && matchMaq) {
                    pendPeso += (i.peso || 0);
                    pendPos += 1;
                    if (i.pendencia) {
                        pendC[i.pendencia] = (pendC[i.pendencia] || 0) + 1;
                        pendW[i.pendencia] = (pendW[i.pendencia] || 0) + (i.peso || 0);
                    }
                    if (i.maq) {
                        maqC[i.maq] = (maqC[i.maq] || 0) + 1;
                    }
                }
            });
        });

        const gPend = Object.entries(pendC).sort((a, b) => b[1] - a[1]);
        const gMaq = Object.entries(maqC).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const esforco = open.map(p => ({ ...p, score: (p.peso_apto_kg || p.peso_kg || 0) / Math.max((p.items || p.itens || []).length, 1), pos: (p.items || p.itens || []).length })).sort((a, b) => b.score - a.score).slice(0, 10);
        const topPeso = [...open].sort((a, b) => (b.peso_apto_kg || b.peso_kg || 0) - (a.peso_apto_kg || a.peso_kg || 0)).slice(0, 10);
        const dayMap = {};
        history.forEach(e => { if (e.changes?.status === "CONCLUÍDO") dayMap[e.date] = (dayMap[e.date] || 0) + 1; });
        const evoKeys = Object.keys(dayMap).sort((a, b) => { const pa = a.split("/"); const pb = b.split("/"); return new Date(`${pa[2]}-${pa[1]}-${pa[0]}`) - new Date(`${pb[2]}-${pb[1]}-${pb[0]}`); });
        let cum = 0; const evo = evoKeys.map(d => { cum += dayMap[d]; return { d, v: cum }; });
        const totalPeso = all.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
        return { total: all.length, concl, prog, bloq, agua, open, pendC, pendW, gPend, gMaq, esforco, topPeso, evo, totalPeso, pendPeso, pendPos };
    }, [updates, history, filtered, pendF, maqF]);
}
