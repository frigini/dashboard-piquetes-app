import { useState, useMemo } from "react";

export default function useFilters(activeData) {
    const [sheetF, setSheetF] = useState("TODOS");
    const [pendF, setPendF] = useState("TODAS");
    const [maqF, setMaqF] = useState("TODAS");
    const [search, setSearch] = useState("");
    const [actPend, setActPend] = useState(null);
    const [actMaq, setActMaq] = useState(null);

    // ── All sheets (always from full data) ──
    const sheets = useMemo(() => ["TODOS", ...new Set(activeData.map(p => p.sheet || p.situacao || "TODOS"))], [activeData]);

    // ── 1° Filtro: ABA (maior precedência) ──
    const sheetFiltered = useMemo(() =>
        sheetF === "TODOS"
            ? activeData
            : activeData.filter(p => (p.sheet || p.situacao || "TODOS") === sheetF),
        [activeData, sheetF]
    );

    // Pendências e contagem de itens calculadas SOBRE o resultado da ABA
    const allPends = useMemo(() => { const s = new Set(); sheetFiltered.forEach(p => (p.pendencias || []).forEach(x => s.add(x))); return [...s].sort(); }, [sheetFiltered]);
    const pendSum = useMemo(() => {
        const c = {};
        sheetFiltered.forEach(p => {
            (p.items || p.itens || []).forEach(i => {
                if (i.pendencia) c[i.pendencia] = (c[i.pendencia] || 0) + 1;
            });
        });
        return c;
    }, [sheetFiltered]);

    // ── 2° Filtro: PENDÊNCIA (sobre o resultado da ABA) ──
    const pendFiltered = useMemo(() =>
        pendF === "TODAS"
            ? sheetFiltered
            : sheetFiltered.filter(p => (p.pendencias || []).includes(pendF)),
        [sheetFiltered, pendF]
    );

    // Máquinas calculadas SOBRE o resultado da ABA + PENDÊNCIA
    const allMaqs = useMemo(() => { const s = new Set(); pendFiltered.forEach(p => (p.maquinas || []).forEach(m => s.add(m))); return [...s].sort(); }, [pendFiltered]);

    // ── 3° Filtro: MÁQUINA + Busca (sobre o resultado da PENDÊNCIA) ──
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
    const setSheetFCascade = val => { setSheetF(val); setPendF("TODAS"); setMaqF("TODAS"); };
    const setPendFCascade = val => { setPendF(val); setMaqF("TODAS"); };

    return {
        sheetF, setSheetF: setSheetFCascade, pendF, setPendF: setPendFCascade, maqF, setMaqF,
        search, setSearch, actPend, setActPend, actMaq, setActMaq,
        sheets, allPends, allMaqs, pendSum, filtered,
    };
}
