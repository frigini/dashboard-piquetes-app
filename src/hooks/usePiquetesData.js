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

                    const result = Object.values(piqMap).map(p => ({ ...p, pendencias: [...p.pendencias] }));
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

                    const piqMap = {};
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

                    const result = Object.values(piqMap).map(p => ({ ...p, pendencias: [...p.pendencias] }));
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
