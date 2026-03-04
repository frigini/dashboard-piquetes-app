import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

/**
 * Exporta os dados de um piquete individual para PDF.
 * Gera um arquivo com cabecalho, resumo e tabela de itens.
 * Desenha a tabela manualmente sem dependencia de jspdf-autotable.
 */
export function exportPiquetePDF(p, updates) {
    try {
        const u = updates[p.id] || {};
        const items = p.items || p.itens || [];
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        // Titulo
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("CT " + p.ct + " - " + (p.piquete || ""), 14, 18);

        // Resumo
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const peso = (p.peso_apto_kg || p.peso_kg || 0).toFixed(2);
        const linhas = [
            "Peso: " + peso + " t",
            "Pendencias: " + (p.pendencias && p.pendencias.length > 0 ? p.pendencias.join(", ") : "-"),
            "Maquinas: " + (p.maquinas && p.maquinas.length > 0 ? p.maquinas.join(", ") : "-"),
            "Status: " + (u.status || "AGUARDANDO"),
        ];
        if (u.responsavel) linhas.push("Responsavel: " + u.responsavel);
        if (u.obs) linhas.push("Obs: " + u.obs);

        let y = 26;
        linhas.forEach(l => { doc.text(String(l), 14, y); y += 5; });
        y += 6;

        // Tabela de itens
        if (items.length > 0) {
            const headers = ["PRIO", "OV", "OP", "POSICAO", "MATERIAL", "QTD", "PESO kg", "MAQ", "PENDENCIA"];
            // Larguras das colunas (em mm) - total ~270mm para paisagem A4
            const colW = [15, 18, 28, 22, 55, 15, 22, 25, 40];
            const startX = 14;
            const rowH = 6;

            // Cabecalho da tabela
            doc.setFillColor(232, 0, 29);
            doc.rect(startX, y, colW.reduce((a, b) => a + b, 0), rowH, "F");
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            let x = startX;
            headers.forEach((h, i) => {
                doc.text(h, x + 1, y + 4);
                x += colW[i];
            });
            y += rowH;
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");

            // Linhas de dados
            items.forEach((it, idx) => {
                // Nova pagina se necessario
                if (y + rowH > pageH - 10) {
                    doc.addPage();
                    y = 14;
                }

                // Fundo alternado
                if (idx % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(startX, y, colW.reduce((a, b) => a + b, 0), rowH, "F");
                }

                const row = [
                    String(it.prio || ""),
                    String(it.ov || ""),
                    String(it.op || ""),
                    String(it.posicao || ""),
                    String(it.material || it.desc || "").slice(0, 30),
                    String(it.qtd != null ? it.qtd : ""),
                    String((it.peso || 0).toFixed(3)),
                    String(it.maq || ""),
                    String(it.pendencia || it.etapa || ""),
                ];

                x = startX;
                doc.setFontSize(7);
                row.forEach((cell, i) => {
                    doc.text(cell, x + 1, y + 4);
                    x += colW[i];
                });

                // Linha separadora
                doc.setDrawColor(200, 200, 200);
                doc.line(startX, y + rowH, startX + colW.reduce((a, b) => a + b, 0), y + rowH);
                y += rowH;
            });
        }

        const nomeArq = "CT_" + p.ct + "_" + (p.piquete || "piquete").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
        doc.save(nomeArq + ".pdf");
    } catch (err) {
        console.error("Erro ao exportar PDF:", err);
        alert("Erro ao gerar PDF: " + err.message);
    }
}

/**
 * Exporta os dados de um piquete individual para Excel (.xlsx).
 * Usa Blob + link para garantir download no navegador.
 */
export function exportPiqueteExcel(p, updates) {
    try {
        const u = updates[p.id] || {};
        const items = p.items || p.itens || [];
        const wb = XLSX.utils.book_new();

        // Aba Resumo
        const resumo = [
            ["CT", p.ct],
            ["Piquete", p.piquete || ""],
            ["Peso (t)", (p.peso_apto_kg || p.peso_kg || 0).toFixed(2)],
            ["Pendencias", p.pendencias && p.pendencias.length > 0 ? p.pendencias.join(", ") : "-"],
            ["Maquinas", p.maquinas && p.maquinas.length > 0 ? p.maquinas.join(", ") : "-"],
            ["Status", u.status || "AGUARDANDO"],
            ["Responsavel", u.responsavel || ""],
            ["Observacao", u.obs || ""],
        ];
        const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
        wsResumo["!cols"] = [{ wch: 14 }, { wch: 50 }];
        XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

        // Aba Itens
        if (items.length > 0) {
            const header = ["PRIO", "OV", "OP", "POSICAO", "MATERIAL", "QTD", "PESO (kg)", "MAQ", "PENDENCIA"];
            const rows = items.map(it => [
                it.prio || "",
                it.ov || "",
                it.op || "",
                it.posicao || "",
                it.material || it.desc || "",
                it.qtd != null ? it.qtd : "",
                it.peso || 0,
                it.maq || "",
                it.pendencia || it.etapa || "",
            ]);
            const wsItens = XLSX.utils.aoa_to_sheet([header, ...rows]);
            wsItens["!cols"] = header.map(() => ({ wch: 16 }));
            XLSX.utils.book_append_sheet(wb, wsItens, "Itens");
        }

        // Gerar arquivo via Blob e forcar download com link temporario
        const nomeArq = "CT_" + p.ct + "_" + (p.piquete || "piquete").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30) + ".xlsx";
        const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArq;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 200);
    } catch (err) {
        console.error("Erro ao exportar Excel:", err);
        alert("Erro ao gerar Excel: " + err.message);
    }
}
