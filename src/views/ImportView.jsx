import { T } from "../theme/theme";
import { Tag } from "../components/ui";

const ImportView = ({ importedData, importStatus, importDragging, setImportDragging, processFile, confirmImport, cancelImport, setView }) => (
    <div style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>IMPORTAR PLANILHA</div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Como importar sua planilha</div>
            <div style={{ fontSize: 11, color: T.sub, lineHeight: 1.7, marginBottom: 20 }}>
                Selecione o arquivo <b style={{ color: T.text }}>piquetes.xlsx</b> — o sistema vai ler automaticamente e montar os piquetes com suas etapas, pesos e itens.
            </div>

            <div style={{ background: "#0F0F0F", border: `2px dashed ${importDragging ? T.red : T.border}`, borderRadius: 10, padding: "32px", textAlign: "center", marginBottom: 16, transition: "border-color .2s", cursor: "pointer" }}
                onDragOver={e => { e.preventDefault(); setImportDragging(true); }}
                onDragLeave={() => setImportDragging(false)}
                onDrop={e => { e.preventDefault(); setImportDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
                onClick={() => document.getElementById('xlsxInput').click()}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 13, color: T.sub, marginBottom: 6 }}>Arraste o arquivo aqui ou clique para selecionar</div>
                <div style={{ fontSize: 10, color: T.dim }}>Aceita .xlsx e .xls</div>
                <input id="xlsxInput" type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }} />
            </div>

            {importStatus && (
                <div style={{ padding: "12px 16px", borderRadius: 8, background: importStatus.type === "ok" ? "#0A1F0F" : importStatus.type === "err" ? "#1A0808" : "#0A1628", border: `1px solid ${importStatus.type === "ok" ? "#166534" : importStatus.type === "err" ? T.red : "#1E40AF"}`, color: importStatus.type === "ok" ? "#22C55E" : importStatus.type === "err" ? "#EF4444" : "#3B82F6", fontSize: 12 }}>
                    {importStatus.msg}
                </div>
            )}
        </div>

        {importedData.length > 0 && (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{importedData.length} piquetes lidos</div>
                        <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{importedData.filter(p => p.pendencias?.length > 0).length} com pendencias · {importedData.reduce((a, p) => a + p.peso_kg, 0).toFixed(1)}t total</div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={cancelImport} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, borderRadius: 8, padding: "10px 16px", fontSize: 12, fontWeight: 600 }}>
                            DESCARTAR
                        </button>
                        <button onClick={() => confirmImport(setView)} style={{ background: T.red, border: "none", color: "#fff", borderRadius: 8, padding: "10px 24px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                            ✓ USAR ESSES DADOS NO DASHBOARD
                        </button>
                    </div>
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                        <thead><tr style={{ background: "#0F0F0F", position: "sticky", top: 0 }}>
                            {["CT", "PIQUETE", "PESO (t)", "PENDENCIAS", "STATUS OP", "DT CONTRATUAL"].map(h => (
                                <th key={h} style={{ padding: "7px 12px", textAlign: "left", color: T.dim, fontSize: 9, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {importedData.slice(0, 50).map((p, i) => (
                                <tr key={i} className="row" style={{ borderBottom: `1px solid #151515` }}>
                                    <td style={{ padding: "6px 12px", color: T.red, fontWeight: 700 }}>{p.ct}</td>
                                    <td style={{ padding: "6px 12px", color: T.sub, fontFamily: "monospace", fontSize: 9, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.piquete}</td>
                                    <td style={{ padding: "6px 12px", color: "#A78BFA", fontWeight: 700 }}>{p.peso_kg.toFixed(1)}</td>
                                    <td style={{ padding: "6px 12px" }}><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{p.pendencias?.map(pd => <Tag key={pd} label={pd} />)}</div></td>
                                    <td style={{ padding: "6px 12px", color: p.status_op === "Aberto" ? "#F59E0B" : "#22C55E", fontSize: 9, fontWeight: 600 }}>{p.status_op}</td>
                                    <td style={{ padding: "6px 12px", color: T.dim, fontSize: 9 }}>{p.dt_contrat}</td>
                                </tr>
                            ))}
                            {importedData.length > 50 && <tr><td colSpan={6} style={{ padding: "8px 12px", color: T.dim, fontSize: 10, textAlign: "center" }}>... e mais {importedData.length - 50} piquetes</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

export default ImportView;
