import { useState } from "react";
import { T } from "./theme/theme";
import usePiquetesData from "./hooks/usePiquetesData";
import useFilters from "./hooks/useFilters";
import useAnalytics from "./hooks/useAnalytics";
import { Header, Sidebar } from "./components/layout";
import DashboardView from "./views/DashboardView";
import AnalyticsView from "./views/AnalyticsView";
import ImportView from "./views/ImportView";

export default function App() {
  const [view, setView] = useState("dash");
  const [unit, setUnit] = useState("kg");
  const data = usePiquetesData();
  const filters = useFilters(data.activeData, data.updates);
  const analytics = useAnalytics(filters.filtered, data.updates, filters.pendF, filters.maqF);
  const pct = analytics.total > 0 ? Math.round(analytics.concl / analytics.total * 100) : 0;

  // Formata peso conforme a unidade selecionada (Kg ou Tonelada)
  const fmtW = (valorKg, decimals = 1) => {
    if (unit === "ton") {
      const tonVal = Math.ceil((valorKg / 1000) * 100) / 100;
      return `${tonVal.toFixed(2)}t`;
    }
    return `${valorKg.toFixed(decimals)} Kg`;
  };

  // Label da unidade atual
  const unitLabel = unit === "ton" ? "t" : "Kg";

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: T.black, minHeight: "100vh", color: T.text, display: "flex", flexDirection: "column", fontSize: 13 }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#111}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#3a3a3a}
        input,select{font-family:inherit;background:#1A1A1A;color:#F0F0F0;border:1px solid #2A2A2A;border-radius:7px;padding:8px 12px;font-size:12px;outline:none;transition:border-color .15s,box-shadow .15s}
        input:focus,select:focus{border-color:${T.red};box-shadow:0 0 0 2px ${T.redGlow}}
        button{font-family:inherit;cursor:pointer;transition:all .15s}
        .pcard{transition:all .2s}
        .pcard:hover{transform:translateY(-1px);box-shadow:0 6px 24px #00000066}
        .hbtn:hover{background:#1E1E1E!important;color:#F0F0F0!important}
        .row:hover{background:#1A1A1A!important}
      `}</style>

      <Header analytics={analytics} pct={pct} today={data.today} timeStr={data.timeStr} unit={unit} setUnit={setUnit} fmtW={fmtW} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          view={view} setView={setView}
          activeData={data.activeData} filtered={filters.filtered}
          statusF={filters.statusF} setStatusF={filters.setStatusF}
          pendF={filters.pendF} setPendF={filters.setPendF} allPends={filters.allPends} pendSum={filters.pendSum}
          maqF={filters.maqF} setMaqF={filters.setMaqF} allMaqs={filters.allMaqs}
        />

        <main style={{ flex: 1, overflowY: "auto", background: T.black }}>
          {view === "analytics" && (
            <AnalyticsView
              analytics={analytics} updates={data.updates} pct={pct}
              setStatusF={filters.setStatusF}
              actPend={filters.actPend} setActPend={filters.setActPend}
              actMaq={filters.actMaq} setActMaq={filters.setActMaq}
              setPendF={filters.setPendF} setMaqF={filters.setMaqF} setView={setView}
              fmtW={fmtW} unitLabel={unitLabel}
            />
          )}

          {view === "import" && (
            <ImportView
              importedData={data.importedData} importStatus={data.importStatus}
              importDragging={data.importDragging} setImportDragging={data.setImportDragging}
              processFile={data.processFile} confirmImport={data.confirmImport}
              cancelImport={data.cancelImport} setView={setView}
              fmtW={fmtW} unitLabel={unitLabel}
            />
          )}


          {view === "dash" && (
            <DashboardView
              filtered={filters.filtered} analytics={analytics}
              updates={data.updates} pct={pct} today={data.today}
              persist={data.persist} activeData={data.activeData}
              search={filters.search} setSearch={filters.setSearch}
              fmtW={fmtW} unitLabel={unitLabel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
