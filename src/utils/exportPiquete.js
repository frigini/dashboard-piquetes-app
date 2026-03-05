import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

/**
 * Exporta toda a Analise Operacional para PDF.
 * Inclui: resumo de status, metricas de peso, gargalos, rankings.
 */
export function exportAnalyticsPDF(analytics, pct) {
    try {
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        let y = 14;

        const checkPage = (needed) => {
            if (y + needed > pageH - 10) { doc.addPage(); y = 14; }
        };

        // ─── TITULO ───
        doc.setFillColor(232, 0, 29);
        doc.rect(0, 0, pageW, 20, "F");
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("BRAMETAL - ANALISE OPERACIONAL", 14, 13);
        doc.setFontSize(9);
        doc.text(new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), pageW - 14, 13, { align: "right" });
        y = 28;

        // ─── RESUMO DE STATUS ───
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("RESUMO GERAL", 14, y); y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const resumo = [
            ["Total de Piquetes", String(analytics.total)],
            ["Concluidos", `${analytics.concl} (${pct}%)`],
            ["Em Progresso", String(analytics.prog)],
            ["Peso Total", `${analytics.totalPeso.toFixed(1)} t`],
            ["Peso Concluido", `${analytics.conclPeso.toFixed(1)} t`],
            ["Peso Em Progresso", `${analytics.progPeso.toFixed(1)} t`],
            ["Peso Pendente", `${analytics.pendPeso.toFixed(1)} t`],
            ["Posicoes Abertas", `${analytics.pendPos} em ${analytics.open.length} piquetes`],
            ["Avanco Geral", `${pct}%`],
        ];

        // Tabela resumo
        const colW1 = 70, colW2 = 80;
        doc.setFillColor(240, 240, 240);
        resumo.forEach((row, i) => {
            if (i % 2 === 0) doc.rect(14, y - 4, colW1 + colW2, 6, "F");
            doc.setFont("helvetica", "bold");
            doc.text(row[0], 16, y);
            doc.setFont("helvetica", "normal");
            doc.text(row[1], 16 + colW1, y);
            y += 6;
        });
        y += 6;

        // ─── GARGALOS POR PENDENCIA ───
        checkPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("GARGALOS POR PENDENCIA", 14, y); y += 8;

        const pendHeaders = ["PENDENCIA", "PIQUETES", "PESO (t)", "%"];
        const pendColW = [60, 25, 30, 20];
        doc.setFillColor(232, 0, 29);
        doc.rect(14, y - 4, pendColW.reduce((a, b) => a + b, 0), 6, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        let x = 14;
        pendHeaders.forEach((h, i) => { doc.text(h, x + 1, y); x += pendColW[i]; });
        y += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        analytics.gPend.forEach(([k, v], idx) => {
            checkPage(6);
            if (idx % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(14, y - 4, pendColW.reduce((a, b) => a + b, 0), 6, "F");
            }
            x = 14;
            doc.text(String(k), x + 1, y); x += pendColW[0];
            doc.text(String(v), x + 1, y); x += pendColW[1];
            doc.text((analytics.pendW[k] || 0).toFixed(1), x + 1, y); x += pendColW[2];
            doc.text(`${analytics.open.length > 0 ? Math.round(v / analytics.open.length * 100) : 0}%`, x + 1, y);
            y += 6;
        });
        y += 6;

        // ─── GARGALOS POR MAQUINA ───
        checkPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("GARGALOS POR MAQUINA", 14, y); y += 8;

        const maqHeaders = ["MAQUINA", "PIQUETES"];
        const maqColW = [60, 25];
        doc.setFillColor(232, 0, 29);
        doc.rect(14, y - 4, maqColW.reduce((a, b) => a + b, 0), 6, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        x = 14;
        maqHeaders.forEach((h, i) => { doc.text(h, x + 1, y); x += maqColW[i]; });
        y += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        analytics.gMaq.forEach(([k, v], idx) => {
            checkPage(6);
            if (idx % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(14, y - 4, maqColW.reduce((a, b) => a + b, 0), 6, "F");
            }
            x = 14;
            doc.text(String(k), x + 1, y); x += maqColW[0];
            doc.text(String(v), x + 1, y);
            y += 6;
        });
        y += 6;

        // ─── MENOR ESFORCO / MAIOR RETORNO ───
        checkPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("MENOR ESFORCO / MAIOR RETORNO (Top 10)", 14, y); y += 8;

        const esfHeaders = ["#", "CT", "PIQUETE", "POS", "PESO (t)", "ROI t/pos", "PENDENCIAS"];
        const esfColW = [10, 18, 60, 15, 22, 22, 80];
        doc.setFillColor(232, 0, 29);
        doc.rect(14, y - 4, esfColW.reduce((a, b) => a + b, 0), 6, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        x = 14;
        esfHeaders.forEach((h, i) => { doc.text(h, x + 1, y); x += esfColW[i]; });
        y += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        analytics.esforco.forEach((p, i) => {
            checkPage(6);
            if (i % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(14, y - 4, esfColW.reduce((a, b) => a + b, 0), 6, "F");
            }
            x = 14;
            const row = [
                `${i + 1}`,
                String(p.ct || ""),
                String(p.piquete || "").slice(0, 35),
                String(p.pos || 0),
                (p.peso_apto_kg || p.peso_kg || 0).toFixed(2),
                p.score.toFixed(2),
                (p.pendencias || []).join(", "),
            ];
            row.forEach((cell, ci) => {
                doc.text(String(cell).slice(0, 45), x + 1, y);
                x += esfColW[ci];
            });
            y += 6;
        });
        y += 6;

        // ─── TOP PESO PENDENTE ───
        checkPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("TOP PESO PENDENTE (Top 10)", 14, y); y += 8;

        const topHeaders = ["#", "CT", "PESO (t)", "POSICOES", "PENDENCIAS"];
        const topColW = [10, 18, 25, 20, 100];
        doc.setFillColor(232, 0, 29);
        doc.rect(14, y - 4, topColW.reduce((a, b) => a + b, 0), 6, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        x = 14;
        topHeaders.forEach((h, i) => { doc.text(h, x + 1, y); x += topColW[i]; });
        y += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        analytics.topPeso.forEach((p, i) => {
            checkPage(6);
            if (i % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(14, y - 4, topColW.reduce((a, b) => a + b, 0), 6, "F");
            }
            x = 14;
            const row = [
                `${i + 1}`,
                String(p.ct || ""),
                (p.peso_apto_kg || p.peso_kg || 0).toFixed(2),
                String((p.items || p.itens || []).length),
                (p.pendencias || []).join(", "),
            ];
            row.forEach((cell, ci) => {
                doc.text(String(cell).slice(0, 55), x + 1, y);
                x += topColW[ci];
            });
            y += 6;
        });

        // Rodape
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text(`Brametal - Analise Operacional - Pagina ${i}/${totalPages}`, pageW / 2, pageH - 5, { align: "center" });
        }

        doc.save("Analise_Operacional_" + new Date().toISOString().slice(0, 10) + ".pdf");
    } catch (err) {
        console.error("Erro ao exportar Analise PDF:", err);
        alert("Erro ao gerar PDF: " + err.message);
    }
}


/**
 * Exporta os dados de um piquete individual para PDF.
 * Gera um arquivo com cabecalho, resumo e tabela de itens.
 * Desenha a tabela manualmente sem dependencia de jspdf-autotable.
 */
export function exportPiquetePDF(p, updates) {
    try {
        const u = (updates || {})[p.id] || {};
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
        ];

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
        const u = (updates || {})[p.id] || {};
        const items = p.items || p.itens || [];
        const wb = XLSX.utils.book_new();

        // Aba Resumo
        const resumo = [
            ["CT", p.ct],
            ["Piquete", p.piquete || ""],
            ["Peso (t)", (p.peso_apto_kg || p.peso_kg || 0).toFixed(2)],
            ["Pendencias", p.pendencias && p.pendencias.length > 0 ? p.pendencias.join(", ") : "-"],
            ["Maquinas", p.maquinas && p.maquinas.length > 0 ? p.maquinas.join(", ") : "-"],
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
