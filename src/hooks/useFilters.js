import { useState, useMemo } from "react";

export default function useFilters(activeData, updates) {
    const [statusF, setStatusF] = useState("TODOS");
    const [pendF, setPendF] = useState("TODAS");
    const [maqF, setMaqF] = useState("TODAS");
    const [search, setSearch] = useState("");
    const [actPend, setActPend] = useState(null);
    const [actMaq, setActMaq] = useState(null);

    // Pendencias e contagem de itens calculadas sobre todos os dados
    const allPends = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.pendencias || []).forEach(x => s.add(x))); return [...s].sort(); }, [activeData]);
    const pendSum = useMemo(() => {
        const c = {};
        activeData.forEach(p => {
            (p.items || p.itens || []).forEach(i => {
                if (i.pendencia) c[i.pendencia] = (c[i.pendencia] || 0) + 1;
            });
        });
        return c;
    }, [activeData]);

    // Helper para determinar o status real no momento da filtragem
    const calcStatus = (p) => {
        if (updates && updates[p.id]?.status) return updates[p.id].status;
        const op = (p.status_op || "").toUpperCase();
        const sit = (p.situacao || "").toUpperCase();
        if (op === "ENCERRADO" || sit === "FINALIZADO" || sit === "ENCER") return "CONCLUÍDO";
        if (p.pendencias && p.pendencias.length > 0) return "EM PROGRESSO";
        return "EM PROGRESSO";
    };

    // 1o Filtro: STATUS
    const statusFiltered = useMemo(() =>
        statusF === "TODOS"
            ? activeData
            : activeData.filter(p => calcStatus(p) === statusF),
        [activeData, statusF, updates]
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
    const setStatusFCascade = val => { setStatusF(val); setPendF("TODAS"); setMaqF("TODAS"); };
    const setPendFCascade = val => { setPendF(val); setMaqF("TODAS"); };

    return {
        statusF, setStatusF: setStatusFCascade,
        pendF, setPendF: setPendFCascade, maqF, setMaqF,
        search, setSearch, actPend, setActPend, actMaq, setActMaq,
        allPends, allMaqs, pendSum, filtered,
    };
}
