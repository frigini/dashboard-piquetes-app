import { useMemo } from "react";

export default function useAnalytics(data, updates, pendF, maqF) {
    return useMemo(() => {
        const baseDateString = (d) => {
            if (!d) return null;
            if (typeof d === "string") {
                if (d.includes('/')) return d.substring(0, 10);
                return new Date(d).toLocaleDateString("pt-BR");
            }
            if (typeof d === "number") {
                // Conversão de data serial do Excel para JS (considerando base 1900)
                const jsDate = new Date((d - 25569) * 86400 * 1000);
                return jsDate.toLocaleDateString("pt-BR");
            }
            return new Date(d).toLocaleDateString("pt-BR");
        };

        const calcStatus = (p) => {
            if (updates && updates[p.id]?.status) return updates[p.id].status;
            
            const sit = (p.situacao || "").toUpperCase();
            if (sit === "FINALIZADO") return "CONCLUÍDO";

            const items = p.items || p.itens || [];
            if (items.length > 0) {
                const allFinished = items.every(i => {
                    const et = String(i.etapa || "").trim().toUpperCase();
                    return et === "FINALIZADO" || et === "CONCLUÍDO";
                });
                return allFinished ? "CONCLUÍDO" : "EM PROGRESSO";
            }

            const op = (p.status_op || "").toUpperCase();
            if (op === "ENCERRADO" || sit === "ENCER") return "CONCLUÍDO";

            const hasPend = p.pendencias && p.pendencias.length > 0 &&
                p.pendencias.some(x => x && x.trim() !== "" && x !== "-" && x !== "—" && x.toUpperCase() !== "FINALIZADO");

            return hasPend ? "EM PROGRESSO" : "CONCLUÍDO";
        };

        const all = data;
        const mapped = all.map(p => ({ ...p, calcSt: calcStatus(p) }));

        const conclArr = mapped.filter(p => p.calcSt === "CONCLUÍDO");
        const progArr = mapped.filter(p => p.calcSt === "EM PROGRESSO");
        const concl = conclArr.length;
        const prog = progArr.length;
        const open = mapped.filter(p => p.calcSt !== "CONCLUÍDO");

        // Peso por status
        const pesoPorStatus = (arr) => arr.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
        const conclPeso = pesoPorStatus(conclArr);
        const progPeso = pesoPorStatus(progArr);

        const pendC = {}, pendW = {}, maqC = {};
        let pendPeso = 0;
        let pendPos = 0;

        open.forEach(p => {
            const pWeight = (p.peso_apto_kg || p.peso_kg || 0);
            const items = p.items || p.itens || [];

            const matchesPend = !pendF || pendF === "TODAS" || p.pendencias.includes(pendF);
            const matchesMaq = !maqF || maqF === "TODAS" || p.maquinas.includes(maqF);

            if (matchesPend && matchesMaq) {
                pendPeso += pWeight;
                pendPos += Math.max(items.length, p.pendencias.length, 1);
            }

            // Count unique piquetes per pendencia and maquina
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

            // Distribute weights based on items
            if (items.length === 0) {
                p.pendencias.forEach(x => {
                    if (!pendF || pendF === "TODAS" || x === pendF) {
                        pendW[x] = (pendW[x] || 0) + pWeight;
                    }
                });
            } else {
                items.forEach(i => {
                    const iPend = i.pendencia || i.etapa;
                    if (iPend) {
                        if (!pendF || pendF === "TODAS" || iPend === pendF) {
                            const iWeight = i.peso > 0 ? i.peso : (pWeight / items.length);
                            pendW[iPend] = (pendW[iPend] || 0) + iWeight;
                        }
                    }
                });
            }
        });

        const gPend = Object.entries(pendC).sort((a, b) => b[1] - a[1]);
        const gMaq = Object.entries(maqC).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const esforco = open.map(p => ({ ...p, score: (p.peso_apto_kg || p.peso_kg || 0) / Math.max((p.items || p.itens || []).length, 1), pos: (p.items || p.itens || []).length })).sort((a, b) => b.score - a.score).slice(0, 10);
        const topPeso = [...open].sort((a, b) => (b.peso_apto_kg || b.peso_kg || 0) - (a.peso_apto_kg || a.peso_kg || 0)).slice(0, 10);

        // Evolução de Conclusões (Simplified since history is removed)
        const dayMap = {};
        mapped.forEach(p => {
            if (p.calcSt === "CONCLUÍDO") {
                if (p.dt_contrat) {
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

        const evo = [];
        let cum = 0;
        for (const d of evoKeys) {
            cum += dayMap[d];
            evo.push({ d, v: cum });
        }

        const totalPeso = all.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
        return { total: all.length, concl, prog, conclPeso, progPeso, open, pendC, pendW, gPend, gMaq, esforco, topPeso, evo, totalPeso, pendPeso, pendPos };
    }, [updates, data, pendF, maqF]);
}
