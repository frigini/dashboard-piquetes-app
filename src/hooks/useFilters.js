import { useState, useMemo } from "react";

export default function useFilters(activeData) {
    const [sheetF, setSheetF] = useState("TODOS");
    const [pendF, setPendF] = useState("TODAS");
    const [maqF, setMaqF] = useState("TODAS");
    const [search, setSearch] = useState("");
    const [actPend, setActPend] = useState(null);
    const [actMaq, setActMaq] = useState(null);

    const sheets = useMemo(() => ["TODOS", ...new Set(activeData.map(p => p.sheet || p.situacao || "TODOS"))], [activeData]);
    const allPends = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.pendencias || []).forEach(x => s.add(x))); return [...s].sort(); }, [activeData]);
    const allMaqs = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.maquinas || []).forEach(m => s.add(m))); return [...s].sort(); }, [activeData]);

    const pendSum = useMemo(() => {
        const c = {};
        activeData.forEach(p => {
            (p.items || p.itens || []).forEach(i => {
                if (i.pendencia) c[i.pendencia] = (c[i.pendencia] || 0) + 1;
            });
        });
        return c;
    }, [activeData]);

    const filtered = useMemo(() => activeData.filter(p => {
        if (sheetF !== "TODOS" && (p.sheet || p.situacao || "TODOS") !== sheetF) return false;
        if (pendF !== "TODAS" && !(p.pendencias || []).includes(pendF)) return false;
        if (maqF !== "TODAS" && !(p.maquinas || []).includes(maqF)) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!p.piquete.toLowerCase().includes(q) && !p.ct.includes(q) &&
                !((p.items || p.itens) || []).some(i => (i.material || i.desc || "").toLowerCase().includes(q))) return false;
        }
        return true;
    }), [activeData, sheetF, pendF, maqF, search]);

    return {
        sheetF, setSheetF, pendF, setPendF, maqF, setMaqF,
        search, setSearch, actPend, setActPend, actMaq, setActMaq,
        sheets, allPends, allMaqs, pendSum, filtered,
    };
}
