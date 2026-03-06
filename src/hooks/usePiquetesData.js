import { useState, useEffect, useCallback } from "react";
import { read, utils } from "xlsx";
import { PIQUETES_DATA } from "../data/piquetesData";

export default function usePiquetesData() {
    const [updates, setUpdates] = useState({});
    const [importedData, setImportedData] = useState([]);
    const [importStatus, setImportStatus] = useState(null);
    const [importDragging, setImportDragging] = useState(false);
    const [dynData, setDynData] = useState(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const today = now.toLocaleDateString("pt-BR");
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        const load = async () => {
            try {
                if (window.storage) {
                    const a = await window.storage.get("piq_updates"); if (a) setUpdates(JSON.parse(a.value));
                    const dyn = await window.storage.get("piq_dyn"); if (dyn) setDynData(JSON.parse(dyn.value));
                } else {
                    // Fallback para o localStorage nativo do navegador
                    const a = localStorage.getItem("piq_updates"); if (a) setUpdates(JSON.parse(a));
                    const dyn = localStorage.getItem("piq_dyn"); if (dyn) setDynData(JSON.parse(dyn));
                }
            } catch { }
        };
        load();
    }, []);

    const persist = useCallback((u) => {
        setUpdates(u);
        try {
            if (window.storage) {
                window.storage.set("piq_updates", JSON.stringify(u));
            } else {
                // Fallback para o localStorage nativo do navegador
                localStorage.setItem("piq_updates", JSON.stringify(u));
            }
        } catch { }
    }, []);

    const activeData = dynData || PIQUETES_DATA;

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
                        if (json[r].some(c => typeof c === 'string' && c.startsWith('CT '))) {
                            isGroupFormat = true;
                            break;
                        }
                    }

                    if (isGroupFormat) {
                        let currentPiqObj = null;
                        let gIdx = null;

                        for (let r = 0; r < json.length; r++) {
                            const row = json[r] || [];

                            const titleCell = row.find(c => typeof c === 'string' && c.startsWith('CT '));
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
                                        peso_kg: pesoM ? parseFloat(pesoM[1].replace(',', '.')) || 0 : 0,
                                        situacao: 'Aberto',
                                        status_op: 'Aberto',
                                        dt_contrat: '',
                                        ov: '',
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
                                gIdx = { ov: -1, cod_comp: -1, peso_comp: -1, maq: -1, etapa: -1, qtd: -1, prio: -1, op: -1, posicao: -1, material: -1 };
                                row.forEach((c, i) => {
                                    if (typeof c === 'string') {
                                        const upper = c.trim().toUpperCase();
                                        if (upper === 'MÁQ' || upper === 'MAQ') gIdx.maq = i;
                                        if (upper === 'PENDÊNCIA' || upper === 'PENDENCIA') gIdx.etapa = i;
                                        if (upper === 'COMP') gIdx.cod_comp = i;
                                        if (upper === 'PESO') gIdx.peso_comp = i;
                                        if (upper === 'OV') gIdx.ov = i;
                                        if (upper === 'QTD') gIdx.qtd = i;
                                        if (upper === 'PRIORIDADE' || upper === 'PRIO' || upper === 'PRIORI') gIdx.prio = i;
                                        if (upper === 'OP') gIdx.op = i;
                                        if (upper === 'POSIÇÃO' || upper === 'POSICAO' || upper === 'POS') gIdx.posicao = i;
                                        if (upper === 'DESCRIÇÃO' || upper === 'DESCRICAO' || upper === 'MATERIAL' || upper === 'DESC' || upper.includes('DESCRI')) gIdx.material = i;
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
                                    peso: gIdx.peso_comp >= 0 ? parseFloat(String(row[gIdx.peso_comp] || 0).replace(',', '.')) || 0 : 0,
                                    etapa: etapa,
                                    maq: maq
                                });
                            }
                        }
                    } else {
                        const header = json[0].map(h => typeof h === 'string' ? h.trim() : h);
                        const findIdx = (regexes) => header.findIndex(h => typeof h === 'string' && regexes.some(r => r.test(h)));
                        const idx = {
                            plano: findIdx([/Plano GAL/i]),
                            ct: findIdx([/Contrato/i, /^CT$/i]),
                            piquete: findIdx([/Piquete/i]),
                            descr: findIdx([/Descrição Embalagem/i, /Descr/i]),
                            peso: findIdx([/Peso Piquete/i]),
                            situacao: findIdx([/Situação Piquete/i, /Situacao/i]),
                            status_op: findIdx([/Status OP/i]),
                            dt: findIdx([/Data Contratual/i]),
                            ov: findIdx([/Ordem Venda/i, /^OV$/i]),
                            cod_comp: findIdx([/Cód\. Componente/i, /^COMP/i]),
                            desc_comp: findIdx([/Descrição Componente/i, /Material/i, /Desc/i]),
                            qtd: findIdx([/Qtde Necessária/i, /^QTD/i]),
                            peso_comp: findIdx([/Peso OP Componente/i, /^PESO$/i]),
                            etapa: findIdx([/Etapa Atual/i, /Pend/i]),
                            prio: findIdx([/Prioridade/i, /^PRIO/i]),
                            op: findIdx([/^OP$/i, /Ordem Produ/i]),
                            posicao: findIdx([/Posi/i, /^POS/i]),
                            maq: findIdx([/M.quina/i, /^MAQ/i])
                        };

                        if (idx.piquete === -1) throw new Error("Formato tabular não reconhecido. Cabeçalho 'Piquete' ausente.");

                        for (let i = 1; i < json.length; i++) {
                            const cols = json[i];
                            if (!cols || cols.length === 0) continue;

                            const piq = cols[idx.piquete];
                            if (!piq) continue;
                            if (!piqMap[piq]) {
                                piqMap[piq] = {
                                    id: Object.keys(piqMap).length + 1,
                                    plano: cols[idx.plano] || '-',
                                    ct: cols[idx.ct] || '-',
                                    piquete: piq,
                                    descr: cols[idx.descr] || '',
                                    peso_kg: parseFloat(String(cols[idx.peso] || 0).replace(',', '.')) || 0,
                                    situacao: cols[idx.situacao] || '',
                                    status_op: cols[idx.status_op] || '',
                                    dt_contrat: cols[idx.dt] || '',
                                    ov: cols[idx.ov] || '',
                                    pendencias: new Set(),
                                    maquinas: new Set(),
                                    itens: [],
                                };
                            }
                            const etapa = cols[idx.etapa] || '-';
                            if (etapa && etapa !== 'Finalizado' && etapa !== '-') piqMap[piq].pendencias.add(etapa);

                            const maq = idx.maq >= 0 ? (cols[idx.maq] || '-') : '-';
                            if (maq && maq !== '-') piqMap[piq].maquinas.add(maq);

                            if (cols[idx.cod_comp]) {
                                piqMap[piq].itens.push({
                                    prio: idx.prio >= 0 ? String(cols[idx.prio] || "") : "",
                                    ov: idx.ov >= 0 ? String(cols[idx.ov] || "") : "",
                                    op: idx.op >= 0 ? String(cols[idx.op] || "") : "",
                                    posicao: idx.posicao >= 0 ? String(cols[idx.posicao] || "") : "",
                                    material: idx.desc_comp >= 0 ? String(cols[idx.desc_comp] || "") : "",
                                    cod: cols[idx.cod_comp],
                                    desc: idx.desc_comp >= 0 ? String(cols[idx.desc_comp] || "") : "",
                                    qtd: parseInt(cols[idx.qtd]) || 0,
                                    peso: parseFloat(String(cols[idx.peso_comp] || 0).replace(',', '.')) || 0,
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
            if (window.storage) {
                await window.storage.set("piq_dyn", JSON.stringify(mergedData));
            } else {
                // Fallback para o localStorage nativo do navegador
                localStorage.setItem("piq_dyn", JSON.stringify(mergedData));
            }
        } catch { }

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
