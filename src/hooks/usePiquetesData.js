import { useState, useEffect, useCallback, useMemo } from "react";
import { read, utils } from "xlsx";

const parseLocalNum = (v) => {
    if (typeof v === 'number') return v;
    let s = String(v || "").trim();
    if (!s) return 0;
    
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    
    // Formato BR: 1.234,56 ou 1234,56
    if (lastComma > lastDot) {
        s = s.replace(/\./g, '').replace(',', '.');
    } 
    // Formato US: 1,234.56 ou 1234.56
    else if (lastDot > lastComma) {
        s = s.replace(/,/g, '');
    }
    return parseFloat(s) || 0;
};

export default function usePiquetesData() {
    const [updates, setUpdates] = useState(() => {
        try {
            const a = localStorage.getItem("piq_updates");
            return a ? JSON.parse(a) : {};
        } catch { return {}; }
    });
    const [importedData, setImportedData] = useState([]);
    const [importStatus, setImportStatus] = useState(null);
    const [importDragging, setImportDragging] = useState(false);
    const [dynData, setDynData] = useState(() => {
        try {
            const dyn = localStorage.getItem("piq_dyn");
            return dyn ? JSON.parse(dyn) : null;
        } catch { return null; }
    });
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const today = now.toLocaleDateString("pt-BR");
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

    const persist = useCallback((u) => {
        setUpdates(u);
        try {
            localStorage.setItem("piq_updates", JSON.stringify(u));
        } catch (error) { 
            console.warn("Storage save error", error); 
        }
    }, []);

    const activeData = useMemo(() => dynData || [], [dynData]);

    // ─── IMPORTAR EXCEL OU CSV ───────────────────────────────────────────────────────
    const processFile = useCallback((file) => {
        setImportStatus({ type: "info", msg: "Lendo arquivo..." });
        const reader = new FileReader();
        const ext = file.name.toLowerCase().split('.').pop();

        if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
            reader.onload = (e) => {
                try {
                    let json = [];
                    if (ext === 'csv') {
                        const text = e.target.result;
                        const lines = text.split(/\r?\n/).filter(l => l.trim());
                        const sep = lines.length > 0 && lines[0].includes(';') ? ';' : ',';
                        json = lines.map(l => l.split(sep).map(c => c.replace(/^"|"$/g, '').trim()));
                    } else {
                        const data = new Uint8Array(e.target.result);
                        const workbook = read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        json = utils.sheet_to_json(sheet, { header: 1 });
                    }

                    if (!json || json.length < 2) throw new Error("Planilha/CSV vazio ou inválido.");

                    const piqMap = {};
                    let isGroupFormat = false;

                    for (let r = 0; r < Math.min(15, json.length); r++) {
                        if (json[r].some(c => typeof c === 'string' && c.includes('PIQUETE:') && c.includes('APTO:'))) {
                            isGroupFormat = true;
                            break;
                        }
                    }

                    if (isGroupFormat) {
                        // Keep old legacy group formatting fallback just in case, but probably unused now
                        let currentPiqObj = null;
                        let gIdx = null;

                        for (let r = 0; r < json.length; r++) {
                            const row = json[r] || [];

                            const titleCell = row.find(c => typeof c === 'string' && c.includes('PIQUETE:') && c.includes('APTO:'));
                            if (titleCell) {
                                const ctM = titleCell.match(/CT\s+(\w+)/);
                                const piqM = titleCell.match(/PIQUETE:\s+(.+?)(?:\s+-|$)/);
                                const pesoM = titleCell.match(/APTO:\s+([\d.,]+)Kg/i);

                                const piqueteName = piqM ? piqM[1].trim() : `PIQ-${r}`;
                                if (!piqMap[piqueteName]) {
                                    piqMap[piqueteName] = {
                                        id: Object.keys(piqMap).length + 1,
                                        plano: '-',
                                        ct: ctM ? ctM[1] : '-',
                                        piquete: piqueteName,
                                        descr: '',
                                        peso_kg: pesoM ? parseLocalNum(pesoM[1]) : 0,
                                        situacao: 'Aberto',
                                        status_op: 'Aberto',
                                        dt_contrat: '',
                                        ov: '',
                                        tipo_ov: '',
                                        pendencias: new Set(),
                                        maquinas: new Set(),
                                        itens: [],
                                    };
                                }
                                currentPiqObj = piqMap[piqueteName];
                                gIdx = null;
                                continue;
                            }

                            if (!currentPiqObj) continue;

                            const isHeader = row.some(c => typeof c === 'string' && c.trim().toUpperCase() === 'PENDÊNCIA');
                            if (isHeader) {
                                gIdx = { ov: -1, cod_comp: -1, peso_comp: -1, maq: -1, etapa: -1, qtd: -1, prio: -1, op: -1, posicao: -1, material: -1, tipo_ov: -1 };
                                row.forEach((c, i) => {
                                    if (typeof c === 'string') {
                                        const upper = c.trim().toUpperCase();
                                        if (upper === 'MÁQ' || upper === 'MAQ' || upper === 'RECURSO') gIdx.maq = i;
                                        if (upper === 'PENDÊNCIA' || upper === 'PENDENCIA' || upper === 'ETAPA ATUAL') gIdx.etapa = i;
                                        if (upper === 'COMP' || upper === 'COMPRIMENTO') gIdx.cod_comp = i;
                                        if (upper === 'PESO' || upper === 'PESO OP COMPONENTE') gIdx.peso_comp = i;
                                        if (upper === 'OV' || upper === 'ORDEM VENDA') gIdx.ov = i;
                                        if (upper === 'QTD' || upper === 'QTDE NECESSÁRIA' || upper === 'QTDE NECESSARIA') gIdx.qtd = i;
                                        if (upper === 'PRIORIDADE' || upper === 'PRIO' || upper === 'PLANO GAL') gIdx.prio = i;
                                        if (upper === 'OP' || upper === 'ORDEM') gIdx.op = i;
                                        if (upper === 'POSIÇÃO' || upper === 'POSICAO' || upper === 'DESCRIÇÃO COMPONENTE' || upper === 'DESCRICAO COMPONENTE') gIdx.posicao = i;
                                        if (upper === 'DESCRIÇÃO' || upper === 'DESCRICAO' || upper === 'MATERIAL' || upper === 'BITOLA') gIdx.material = i;
                                    }
                                });
                                continue;
                            }

                            if (gIdx && row[gIdx.cod_comp]) {
                                const comp = String(row[gIdx.cod_comp]).trim();
                                if (!comp || comp === 'undefined') continue;

                                const etapa = row[gIdx.etapa] ? String(row[gIdx.etapa]).trim() : '-';
                                const maq = row[gIdx.maq] ? String(row[gIdx.maq]).trim() : '-';

                                if (etapa && etapa !== '-' && etapa.toUpperCase() !== 'FINALIZADO') {
                                    currentPiqObj.pendencias.add(etapa);
                                }
                                if (maq && maq !== '-') {
                                    currentPiqObj.maquinas.add(maq);
                                }

                                const ov = row[gIdx.ov];
                                if (ov && !currentPiqObj.ov) currentPiqObj.ov = String(ov);

                                currentPiqObj.itens.push({
                                    prio: gIdx.prio >= 0 ? String(row[gIdx.prio] || "") : "",
                                    ov: gIdx.ov >= 0 ? String(row[gIdx.ov] || "") : "",
                                    op: gIdx.op >= 0 ? String(row[gIdx.op] || "") : "",
                                    posicao: gIdx.posicao >= 0 ? String(row[gIdx.posicao] || "") : "",
                                    material: gIdx.material >= 0 ? String(row[gIdx.material] || "") : "",
                                    cod: comp,
                                    desc: '',
                                    qtd: gIdx.qtd >= 0 ? parseInt(row[gIdx.qtd]) || 1 : 1,
                                    peso: gIdx.peso_comp >= 0 ? parseLocalNum(row[gIdx.peso_comp]) : 0,
                                    etapa: etapa,
                                    maq: maq
                                });
                            }
                        }
                    } else {
                        const header = json[0].map(h => typeof h === 'string' ? h.trim() : h);
                        const findIdx = (regexes) => header.findIndex(h => typeof h === 'string' && regexes.some(r => r.test(h)));
                        const idx = {
                            plano: findIdx([/^Plano GAL$/i]),
                            ct: findIdx([/^Contrato$/i]),
                            piquete: findIdx([/^Piquete$/i]),
                            situacao: findIdx([/^Situação Piquete$/i, /^Situacao Piquete$/i]),
                            tipo_ov: findIdx([/^Tipo de OV$/i]),
                            ov: findIdx([/^Ordem Venda$/i]),
                            posicao: findIdx([/^Descrição Componente$/i, /^Descricao Componente$/i]),
                            cod_comp: findIdx([/^Comprimento$/i]),
                            op: findIdx([/^Ordem$/i]),
                            desc_comp: findIdx([/^Bitola$/i]),
                            qtd: findIdx([/^Qtde Necessária$/i, /^Qtde Necess.ria$/i]),
                            peso_comp: findIdx([/^Peso OP Componente$/i]),
                            maq: findIdx([/^recurso$/i]),
                            etapa: findIdx([/^Etapa Atual$/i]),
                            // Ignore other columns entirely
                            descr: -1, status_op: -1, dt: -1
                        };

                        if (idx.piquete === -1) throw new Error("Formato tabular não reconhecido. Cabeçalho 'Piquete' ausente.");

                        for (let i = 1; i < json.length; i++) {
                            const cols = json[i];
                            if (!cols || cols.length === 0) continue;

                            const rawPiq = cols[idx.piquete];
                            if (!rawPiq) continue;

                            const situacao = idx.situacao >= 0 ? (cols[idx.situacao] || '') : '';
                            
                            // Agrupar apenas por Piquete para evitar duplicação em discrepâncias secundárias
                            const piqKey = String(rawPiq).trim();

                            if (!piqMap[piqKey]) {
                                piqMap[piqKey] = {
                                    id: Object.keys(piqMap).length + 1,
                                    plano: idx.plano >= 0 ? (cols[idx.plano] || '-') : '-',
                                    ct: idx.ct >= 0 ? (cols[idx.ct] || '-') : '-',
                                    piquete: rawPiq,
                                    descr: idx.descr >= 0 ? (cols[idx.descr] || '') : '',
                                    peso_kg: 0, // Será somado a cada comp 
                                    situacao: situacao,
                                    status_op: idx.status_op >= 0 ? (cols[idx.status_op] || '') : '',
                                    dt_contrat: idx.dt >= 0 ? (cols[idx.dt] || '') : '',
                                    ov: idx.ov >= 0 ? (cols[idx.ov] || '') : '',
                                    tipo_ov: idx.tipo_ov >= 0 ? (cols[idx.tipo_ov] || '') : '',
                                    pendencias: new Set(),
                                    maquinas: new Set(),
                                    itens: [],
                                };
                            }
                            
                            const etapa = idx.etapa >= 0 ? (cols[idx.etapa] || '-') : '-';
                            if (etapa && etapa !== 'Finalizado' && etapa !== '-') piqMap[piqKey].pendencias.add(etapa);

                            const maq = idx.maq >= 0 ? (cols[idx.maq] || '-') : '-';
                            if (maq && maq !== '-') piqMap[piqKey].maquinas.add(maq);

                            let pesoComp = 0;
                            if (idx.peso_comp >= 0) {
                                pesoComp = parseLocalNum(cols[idx.peso_comp]);
                            }
                            
                            // Soma o peso do componente no peso do piquete agrupado
                            piqMap[piqKey].peso_kg += pesoComp;

                            if (idx.cod_comp >= 0 && cols[idx.cod_comp]) {
                                piqMap[piqKey].itens.push({
                                    prio: idx.plano >= 0 ? String(cols[idx.plano] || "") : "",
                                    ov: idx.ov >= 0 ? String(cols[idx.ov] || "") : "",
                                    op: idx.op >= 0 ? String(cols[idx.op] || "") : "",
                                    posicao: idx.posicao >= 0 ? String(cols[idx.posicao] || "") : "",
                                    material: idx.desc_comp >= 0 ? String(cols[idx.desc_comp] || "") : "",
                                    cod: cols[idx.cod_comp],
                                    desc: idx.desc_comp >= 0 ? String(cols[idx.desc_comp] || "") : "",
                                    qtd: idx.qtd >= 0 ? (parseInt(cols[idx.qtd]) || 0) : 0,
                                    peso: pesoComp,
                                    etapa,
                                    maq: idx.maq >= 0 ? String(cols[idx.maq] || "") : ""
                                });
                            }
                        }
                    }

                    const result = Object.values(piqMap).map(p => ({
                        ...p,
                        pendencias: [...p.pendencias],
                        maquinas: [...p.maquinas]
                    }));
                    setImportedData(result);
                    setImportStatus({ type: "ok", msg: `✓ ${result.length} piquetes lidos com sucesso! Revise abaixo e clique em "USAR ESSES DADOS".` });
                } catch (err) {
                    setImportStatus({ type: "err", msg: "Erro ao ler arquivo: " + err.message });
                }
            };

            if (ext === 'csv') {
                reader.readAsText(file, 'UTF-8');
            } else {
                reader.readAsArrayBuffer(file);
            }
            setImportStatus({ type: "err", msg: "Para importar: selecione um arquivo válido (.csv, .xls, .xlsx)." });
        }
    }, []);

    const confirmImport = useCallback(async (setView) => {
        // Estratégia de mesclagem:
        // 1. Iniciar com os dados ativos (activeData)
        // 2. Qualquer item nos dados importados (importedData) atualiza/adiciona aos dados ativos
        // 3. Qualquer item nos dados ativos que NÃO estiver nos dados importados recebe o status "Finalizado" e tem as pendências limpas.

        const newMap = new Map(importedData.map(p => [p.piquete, p]));
        const mergedData = [];

        // Atualizar existentes ou marcar como finalizados
        activeData.forEach(p => {
            if (newMap.has(p.piquete)) {
                // Foi importado: substituir pelos novos dados
                mergedData.push(newMap.get(p.piquete));
                newMap.delete(p.piquete); // remover do mapa para sabermos o que é totalmente novo
            } else {
                // Não está nos dados importados: Finalizado
                mergedData.push({
                    ...p,
                    status_op: "Finalizado",
                    situacao: "Finalizado",
                    pendencias: [],
                    maquinas: [],
                });
            }
        });

        // Adicionar os totalmente novos
        newMap.forEach(p => mergedData.push(p));

        setDynData(mergedData);
        try {
            localStorage.setItem("piq_dyn", JSON.stringify(mergedData));
        } catch (error) { 
            console.warn("Storage update error", error); 
        }

        setImportStatus({ type: "ok", msg: `✓ Processamos ${mergedData.length} piquetes (${importedData.length} atualizados/novos no dashboard)!` });
        setTimeout(() => setView("dash"), 1200);
    }, [importedData, activeData]);

    const cancelImport = useCallback(() => {
        setImportedData([]);
        setImportStatus(null);
    }, []);

    return {
        updates, activeData, today, timeStr, now,
        importedData, importStatus, importDragging, setImportDragging,
        persist, processFile, confirmImport, cancelImport,
    };
}
