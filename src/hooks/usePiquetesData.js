import { useState, useEffect, useCallback } from "react";
import { read, utils } from "xlsx";
import { PIQUETES_DATA } from "../data/piquetesData";

export default function usePiquetesData() {
    const [updates, setUpdates] = useState({});
    const [history, setHistory] = useState([]);
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
                    const b = await window.storage.get("piq_history"); if (b) setHistory(JSON.parse(b.value));
                    const dyn = await window.storage.get("piq_dyn"); if (dyn) setDynData(JSON.parse(dyn.value));
                }
            } catch { }
        };
        load();
    }, []);

    const persist = useCallback((u, h) => {
        setUpdates(u);
        if (h !== undefined) setHistory(h);
        try {
            if (window.storage) {
                window.storage.set("piq_updates", JSON.stringify(u));
                if (h !== undefined) window.storage.set("piq_history", JSON.stringify(h));
            }
        } catch { }
    }, []);

    const activeData = dynData || PIQUETES_DATA;

    // ─── IMPORTAR EXCEL OU CSV ───────────────────────────────────────────────────────
    const processFile = useCallback((file) => {
        setImportStatus({ type: "info", msg: "Lendo arquivo..." });
        const reader = new FileReader();
        const ext = file.name.toLowerCase().split('.').pop();

        if (ext === 'csv') {
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split(/\r?\n/).filter(l => l.trim());
                    const header = lines[0].split(';').map(h => h.replace(/"/g, '').trim());
                    const idx = {
                        plano: header.indexOf('Plano GAL'),
                        ct: header.indexOf('Contrato'),
                        piquete: header.indexOf('Piquete'),
                        descr: header.indexOf('Descrição Embalagem'),
                        peso: header.indexOf('Peso Piquete'),
                        situacao: header.indexOf('Situação Piquete'),
                        status_op: header.indexOf('Status OP'),
                        dt: header.indexOf('Data Contratual'),
                        ov: header.indexOf('Ordem Venda'),
                        cod_comp: header.indexOf('Cód. Componente'),
                        desc_comp: header.indexOf('Descrição Componente'),
                        qtd: header.indexOf('Qtde Necessária'),
                        peso_comp: header.indexOf('Peso OP Componente'),
                        etapa: header.indexOf('Etapa Atual'),
                    };

                    const piqMap = {};
                    for (let i = 1; i < lines.length; i++) {
                        const cols = lines[i].split(';').map(c => c.replace(/^"|"$/g, '').trim());
                        const piq = cols[idx.piquete];
                        if (!piq) continue;
                        if (!piqMap[piq]) {
                            piqMap[piq] = {
                                id: Object.keys(piqMap).length + 1,
                                plano: cols[idx.plano] || '-',
                                ct: cols[idx.ct] || '-',
                                piquete: piq,
                                descr: cols[idx.descr] || '',
                                peso_kg: parseFloat(cols[idx.peso]?.replace(',', '.')) || 0,
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
                        if (cols[idx.cod_comp]) {
                            piqMap[piq].itens.push({
                                cod: cols[idx.cod_comp],
                                desc: cols[idx.desc_comp] || '',
                                qtd: parseInt(cols[idx.qtd]) || 0,
                                peso: parseFloat(cols[idx.peso_comp]?.replace(',', '.')) || 0,
                                etapa,
                            });
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
                    setImportStatus({ type: "err", msg: "Erro ao ler CSV: " + err.message });
                }
            };
            reader.readAsText(file, 'UTF-8');
        } else if (ext === 'xlsx' || ext === 'xls') {
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = utils.sheet_to_json(sheet, { header: 1 });

                    if (!json || json.length < 2) throw new Error("Planilha vazia ou inválida.");

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
                                gIdx = { ov: -1, cod_comp: -1, peso_comp: -1, maq: -1, etapa: -1, qtd: -1 };
                                row.forEach((c, i) => {
                                    if (typeof c === 'string') {
                                        const upper = c.trim().toUpperCase();
                                        if (upper === 'MÁQ' || upper === 'MAQ') gIdx.maq = i;
                                        if (upper === 'PENDÊNCIA' || upper === 'PENDENCIA') gIdx.etapa = i;
                                        if (upper === 'COMP') gIdx.cod_comp = i;
                                        if (upper === 'PESO') gIdx.peso_comp = i;
                                        if (upper === 'OV') gIdx.ov = i;
                                        if (upper === 'QTD') gIdx.qtd = i;
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
                        const idx = {
                            plano: header.indexOf('Plano GAL'),
                            ct: header.indexOf('Contrato'),
                            piquete: header.indexOf('Piquete'),
                            descr: header.indexOf('Descrição Embalagem'),
                            peso: header.indexOf('Peso Piquete'),
                            situacao: header.indexOf('Situação Piquete'),
                            status_op: header.indexOf('Status OP'),
                            dt: header.indexOf('Data Contratual'),
                            ov: header.indexOf('Ordem Venda'),
                            cod_comp: header.indexOf('Cód. Componente'),
                            desc_comp: header.indexOf('Descrição Componente'),
                            qtd: header.indexOf('Qtde Necessária'),
                            peso_comp: header.indexOf('Peso OP Componente'),
                            etapa: header.indexOf('Etapa Atual'),
                        };

                        if (idx.piquete === -1) throw new Error("Formato de planilha não reconhecido.");

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
                            if (cols[idx.cod_comp]) {
                                piqMap[piq].itens.push({
                                    cod: cols[idx.cod_comp],
                                    desc: cols[idx.desc_comp] || '',
                                    qtd: parseInt(cols[idx.qtd]) || 0,
                                    peso: parseFloat(String(cols[idx.peso_comp] || 0).replace(',', '.')) || 0,
                                    etapa,
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
                    setImportStatus({ type: "err", msg: "Erro ao ler Excel: " + err.message });
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setImportStatus({ type: "err", msg: "Para importar: selecione um arquivo válido (.csv, .xls, .xlsx)." });
        }
    }, []);

    const confirmImport = useCallback(async (setView) => {
        setDynData(importedData);
        try {
            if (window.storage) await window.storage.set("piq_dyn", JSON.stringify(importedData));
        } catch { }
        setImportStatus({ type: "ok", msg: `✓ ${importedData.length} piquetes carregados no dashboard!` });
        setTimeout(() => setView("dash"), 1200);
    }, [importedData]);

    return {
        updates, history, activeData, today, timeStr, now,
        importedData, importStatus, importDragging, setImportDragging,
        persist, processFile, confirmImport,
    };
}
