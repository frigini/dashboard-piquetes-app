import { useState, useMemo, useCallback } from "react";

export default function useFilters(activeData, updates) {
    const [statusF, setStatusF] = useState("TODOS");
    const [pendF, setPendF] = useState("TODAS");
    const [maqF, setMaqF] = useState("TODAS");
    const [sitF, setSitF] = useState("TODAS");
    const [search, setSearch] = useState("");
    const [actPend, setActPend] = useState(null);
    const [actMaq, setActMaq] = useState(null);

    // Pendencias e contagem de itens calculadas sobre todos os dados
    const allPends = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.pendencias || []).forEach(x => s.add(x))); return [...s].sort(); }, [activeData]);
    const pendSum = useMemo(() => {
        const c = {};
        activeData.forEach(p => {
            (p.items || p.itens || []).forEach(i => {
                const pendName = i.etapa || i.pendencia;
                if (pendName && pendName !== "-" && pendName.toUpperCase() !== "FINALIZADO") {
                    c[pendName] = (c[pendName] || 0) + 1;
                }
            });
        });
        return c;
    }, [activeData]);

    // Helper para determinar o status real no momento da filtragem
    const calcStatus = useCallback((p) => {
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
    }, [updates]);

    // Filtro Situação (Apto / Não Apto)
    const sitFiltered = useMemo(() =>
        sitF === "TODAS"
            ? activeData
            : activeData.filter(p => {
                const s = (p.situacao || "").toUpperCase();
                if (sitF === "APTO") return s.includes("APTO") && !s.includes("NÃO APTO") && !s.includes("NAO APTO");
                if (sitF === "NÃO APTO") return s.includes("NÃO APTO") || s.includes("NAO APTO");
                return true;
            }),
        [activeData, sitF]
    );

    // 1o Filtro: STATUS
    const statusFiltered = useMemo(() =>
        statusF === "TODOS"
            ? sitFiltered
            : sitFiltered.filter(p => calcStatus(p) === statusF),
        [sitFiltered, statusF, calcStatus]
    );

    // 2o Filtro: PENDENCIA (sobre o resultado do STATUS)
    const pendFiltered = useMemo(() =>
        pendF === "TODAS"
            ? statusFiltered
            : statusFiltered.filter(p => (p.pendencias || []).includes(pendF)),
        [statusFiltered, pendF]
    );

    // Maquinas calculadas sobre o resultado da PENDENCIA
    const allMaqs = useMemo(() => { const s = new Set(); pendFiltered.forEach(p => (p.maquinas || []).forEach(m => s.add(m))); return [...s].sort(); }, [pendFiltered]);

    // 2o Filtro: MAQUINA + Busca (sobre o resultado da PENDENCIA)
    const filtered = useMemo(() => pendFiltered.filter(p => {
        if (maqF !== "TODAS" && !(p.maquinas || []).includes(maqF)) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!p.piquete.toLowerCase().includes(q) && !p.ct.includes(q) &&
                !((p.items || p.itens) || []).some(i => (i.material || i.desc || "").toLowerCase().includes(q))) return false;
        }
        return true;
    }), [pendFiltered, maqF, search]);

    // Reset filtros filhos quando o pai muda
    const setSitFCascade = val => { setSitF(val); setStatusF("TODOS"); setPendF("TODAS"); setMaqF("TODAS"); };
    const setStatusFCascade = val => { setStatusF(val); setPendF("TODAS"); setMaqF("TODAS"); };
    const setPendFCascade = val => { setPendF(val); setMaqF("TODAS"); };

    return {
        sitF, setSitF: setSitFCascade,
        statusF, setStatusF: setStatusFCascade,
        pendF, setPendF: setPendFCascade, maqF, setMaqF,
        search, setSearch, actPend, setActPend, actMaq, setActMaq,
        allPends, allMaqs, pendSum, filtered,
    };
}
