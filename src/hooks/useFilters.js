import { useState, useMemo } from "react";

export default function useFilters(activeData) {
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

    // 1o Filtro: PENDENCIA
    const pendFiltered = useMemo(() =>
        pendF === "TODAS"
            ? activeData
            : activeData.filter(p => (p.pendencias || []).includes(pendF)),
        [activeData, pendF]
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
    const setPendFCascade = val => { setPendF(val); setMaqF("TODAS"); };

    return {
        pendF, setPendF: setPendFCascade, maqF, setMaqF,
        search, setSearch, actPend, setActPend, actMaq, setActMaq,
        allPends, allMaqs, pendSum, filtered,
    };
}
