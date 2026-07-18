"use client";

import { useEffect, useMemo, useState } from "react";

type Company = {
  id: number;
  name: string;
  domain: string;
  location: string;
  employees: number;
  industry: string;
  stage: string;
  stack: string[];
  signals: string[];
  evidence: { label: string; value: string; source: string }[];
  risks: string[];
  summary: string;
  angle: string;
  draft: string;
};

type ICPConfig = { minEmployees: number; maxEmployees: number; focus: "software" | "saas" | "all" };

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "Northstar Support",
    domain: "northstar.example",
    location: "Boston, MA",
    employees: 84,
    industry: "B2B SaaS",
    stage: "Series A",
    stack: ["HubSpot", "Intercom", "Slack"],
    signals: ["Hiring 4 support roles", "Launched enterprise plan", "Pricing page updated"],
    evidence: [
      { label: "Team size", value: "84 employees", source: "Company profile · Demo snapshot" },
      { label: "Growth signal", value: "4 open customer-support roles", source: "Careers page · Demo snapshot" },
      { label: "GTM stack", value: "HubSpot + Intercom", source: "Technology profile · Demo snapshot" },
    ],
    risks: ["No verified product-usage signal", "Buyer identity not confirmed"],
    summary: "Growing support software company moving upmarket. Hiring and an enterprise launch suggest increasing account complexity and pressure on response consistency.",
    angle: "Lead with workflow consistency during the shift to enterprise customers.",
    draft: "Hi Northstar team — I noticed the enterprise launch and the four open support roles. Teams at that stage often add headcount before fixing the handoffs between inbound interest, qualification, and follow-up. I mapped a lightweight workflow that could help your team keep those steps visible in HubSpot without adding another sending tool. Worth sharing the one-page outline?",
  },
  {
    id: 2,
    name: "ParcelPilot",
    domain: "parcelpilot.example",
    location: "Austin, TX",
    employees: 146,
    industry: "Logistics SaaS",
    stage: "Series B",
    stack: ["Salesforce", "Segment", "Zendesk"],
    signals: ["Expanded to Canada", "New VP Sales", "Partner program launched"],
    evidence: [
      { label: "Team size", value: "146 employees", source: "Company profile · Demo snapshot" },
      { label: "Leadership", value: "VP Sales joined recently", source: "Newsroom · Demo snapshot" },
      { label: "Expansion", value: "Canadian market launch", source: "Company blog · Demo snapshot" },
    ],
    risks: ["May already have mature RevOps coverage"],
    summary: "Logistics platform with multiple live expansion signals. Salesforce and Segment indicate a mature data environment but also increase orchestration complexity.",
    angle: "Focus on signal routing and clean ownership during geographic expansion.",
    draft: "Hi ParcelPilot team — the Canadian expansion, new sales leadership, and partner launch create three new sources of account signals at once. I put together a transparent scoring workflow that separates verified evidence from inference and routes only review-ready accounts into Salesforce. Would a short walkthrough be useful?",
  },
  {
    id: 3,
    name: "JuniperDesk",
    domain: "juniperdesk.example",
    location: "Denver, CO",
    employees: 38,
    industry: "B2B SaaS",
    stage: "Seed",
    stack: ["Pipedrive", "Crisp"],
    signals: ["Founder-led sales", "First sales hire", "New integrations page"],
    evidence: [
      { label: "Team size", value: "38 employees", source: "Company profile · Demo snapshot" },
      { label: "Sales motion", value: "First account executive role", source: "Careers page · Demo snapshot" },
      { label: "Product signal", value: "Integrations directory added", source: "Website change · Demo snapshot" },
    ],
    risks: ["Budget may be limited", "No funding event in demo evidence"],
    summary: "Early-stage SaaS company transitioning from founder-led selling to a repeatable motion. Simple stack and first sales hire make workflow design timely.",
    angle: "Offer a lightweight qualification playbook before process debt accumulates.",
    draft: "Hi JuniperDesk team — hiring the first AE is usually when founder context starts getting lost between research, qualification, and follow-up. I built a small account-review workflow for that exact handoff: every score is explained, every claim has a source, and nothing sends automatically. Open to seeing the demo?",
  },
  {
    id: 4,
    name: "Cedar Health Ops",
    domain: "cedarhealth.example",
    location: "Chicago, IL",
    employees: 310,
    industry: "Healthtech",
    stage: "Series C",
    stack: ["Salesforce", "Marketo", "Gainsight"],
    signals: ["Compliance certification renewed", "Enterprise webinar series"],
    evidence: [
      { label: "Team size", value: "310 employees", source: "Company profile · Demo snapshot" },
      { label: "Stack", value: "Salesforce + Marketo + Gainsight", source: "Technology profile · Demo snapshot" },
    ],
    risks: ["Outside target employee range", "Regulated buying process", "Likely enterprise procurement"],
    summary: "Established healthtech company with an enterprise stack. Relevant use case, but scale and procurement complexity place it outside the initial ICP.",
    angle: "Deprioritize unless an explicit first-party intent signal appears.",
    draft: "Hold — this account is outside the current ICP. Review only if a verified first-party signal or warm introduction appears.",
  },
  {
    id: 5,
    name: "Fieldnote AI",
    domain: "fieldnote.example",
    location: "New York, NY",
    employees: 61,
    industry: "AI SaaS",
    stage: "Series A",
    stack: ["HubSpot", "PostHog", "Slack"],
    signals: ["Raised Series A", "SOC 2 announced", "Hiring RevOps lead"],
    evidence: [
      { label: "Funding", value: "Series A announced", source: "Newsroom · Demo snapshot" },
      { label: "Operations", value: "RevOps lead role open", source: "Careers page · Demo snapshot" },
      { label: "Readiness", value: "SOC 2 announced", source: "Trust center · Demo snapshot" },
    ],
    risks: ["RevOps hire may own build internally"],
    summary: "AI workflow company formalizing go-to-market operations after funding. Strong timing signals and a lightweight HubSpot-centered stack.",
    angle: "Position as a fast prototype the incoming RevOps lead can inspect and adapt.",
    draft: "Hi Fieldnote team — the Series A, SOC 2 milestone, and open RevOps role suggest you’re formalizing the revenue system now. I built a source-grounded account qualification prototype that runs before outreach and makes every scoring decision reviewable. Could it be useful as a reference architecture for the new RevOps owner?",
  },
  {
    id: 6,
    name: "OrbitLedger",
    domain: "orbitledger.example",
    location: "Toronto, CA",
    employees: 22,
    industry: "Fintech",
    stage: "Seed",
    stack: ["Notion", "Google Sheets"],
    signals: ["Beta product", "Two founders", "No sales roles"],
    evidence: [
      { label: "Team size", value: "22 employees", source: "Company profile · Demo snapshot" },
      { label: "Stage", value: "Private beta", source: "Product page · Demo snapshot" },
    ],
    risks: ["Below target size", "No repeatable sales motion", "Limited tooling maturity"],
    summary: "Promising fintech but too early for the current ICP. There is not enough evidence of a repeatable commercial workflow yet.",
    angle: "Archive and revisit after a sales hire or public launch.",
    draft: "Hold — insufficient evidence of GTM readiness. Revisit after a sales hire, public launch, or verified demand signal.",
  },
];

function scoreCompany(c: Company, config: ICPConfig) {
  const inRange = c.employees >= config.minEmployees && c.employees <= config.maxEmployees;
  const softwareFit = c.industry.includes("SaaS") || c.industry.includes("AI") || c.industry.includes("Logistics");
  const focusFit = config.focus === "all" || (config.focus === "software" && softwareFit) || (config.focus === "saas" && c.industry.includes("SaaS"));
  const breakdown = [
    { label: "Company size", points: inRange ? 20 : c.employees <= config.maxEmployees + 100 ? 5 : 0 },
    { label: "Market fit", points: focusFit ? (c.industry.includes("SaaS") ? 20 : 14) : 6 },
    { label: "Growth stage", points: ["Series A", "Series B"].includes(c.stage) ? 15 : c.stage === "Seed" ? 7 : 5 },
    { label: "GTM signals", points: Math.min(c.signals.length * 5, 15) },
    { label: "Readiness", points: c.stack.some((x) => ["HubSpot", "Salesforce", "Pipedrive"].includes(x)) ? 6 : 2 },
    { label: "Evidence quality", points: Math.min(c.evidence.length * 2, 6) },
    { label: "Risk penalty", points: c.risks.length * -5 },
  ];
  return { total: Math.max(0, Math.min(100, breakdown.reduce((sum, item) => sum + item.points, 0))), breakdown };
}

const scoreTone = (score: number) => (score >= 80 ? "high" : score >= 60 ? "medium" : "low");

export default function Home() {
  const [companyData, setCompanyData] = useState(initialCompanies);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(60);
  const [config, setConfig] = useState<ICPConfig>({ minEmployees: 30, maxEmployees: 200, focus: "software" });
  const [showConfig, setShowConfig] = useState(false);
  const [csvPreview, setCsvPreview] = useState<Company[]>([]);
  const [csvError, setCsvError] = useState("");
  const [reviewed, setReviewed] = useState<Record<number, "approved" | "hold">>({});
  const [copied, setCopied] = useState(false);
  const selected = companyData.find((c) => c.id === selectedId) ?? companyData[0];
  const selectedScore = scoreCompany(selected, config);

  const filtered = useMemo(
    () => companyData.filter((c) => `${c.name} ${c.industry} ${c.location}`.toLowerCase().includes(query.toLowerCase()) && scoreCompany(c, config).total >= threshold),
    [companyData, config, query, threshold],
  );

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((company) => company.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const qualified = companyData.filter((c) => scoreCompany(c, config).total >= 60).length;

  function exportCsv() {
    const rows = [["company", "domain", "score", "status", "industry", "stage", "angle"], ...companyData.map((c) => [c.name, c.domain, scoreCompany(c, config).total, reviewed[c.id] ?? "unreviewed", c.industry, c.stage, c.angle])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "gtm-account-review.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(selected.draft); setCopied(true); window.setTimeout(() => setCopied(false), 1500);
  }

  async function previewCsv(file?: File) {
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    const headers = lines[0]?.split(",").map((value) => value.trim().toLowerCase().replaceAll('"', "")) ?? [];
    const required = ["name", "domain", "industry", "employees", "stage", "location"];
    if (!required.every((header) => headers.includes(header))) {
      setCsvError(`Required columns: ${required.join(", ")}`); setCsvPreview([]); return;
    }
    const parsed = lines.slice(1, 11).map((line, index) => {
      const values = line.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
      const row = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
      const employees = Number.parseInt(row.employees, 10);
      return {
        id: 100 + index,
        name: row.name,
        domain: row.domain,
        location: row.location,
        employees: Number.isFinite(employees) ? employees : 0,
        industry: row.industry,
        stage: row.stage,
        stack: ["Imported data"],
        signals: ["CSV import", "Awaiting enrichment"],
        evidence: [
          { label: "Imported company", value: row.name, source: "Uploaded CSV" },
          { label: "Reported size", value: `${employees || 0} employees`, source: "Uploaded CSV" },
        ],
        risks: ["Unverified imported fields", "No external enrichment in demo mode"],
        summary: `${row.name} was imported from CSV. Its score uses only the supplied company attributes; external facts are intentionally not inferred in demo mode.`,
        angle: "Verify the imported fields before preparing outreach.",
        draft: `Hold for research — verify ${row.name}'s company profile and buying signals before drafting a message.`,
      } satisfies Company;
    }).filter((row) => row.name && row.domain);
    setCsvError(parsed.length ? "" : "No valid data rows found."); setCsvPreview(parsed);
  }

  function confirmImport() {
    if (!csvPreview.length) return;
    setCompanyData([...initialCompanies, ...csvPreview]); setSelectedId(csvPreview[0].id); setThreshold(0); setCsvPreview([]);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brandmark">A</span><div><strong>Account Lens</strong><small>Evidence-first GTM copilot</small></div></div>
        <div className="top-actions"><span className="demo-pill">Demo mode · no API</span><label className="secondary upload">Import CSV<input type="file" accept=".csv,text/csv" onChange={(event) => previewCsv(event.target.files?.[0])} /></label><button className="secondary" onClick={exportCsv}>Export CSV</button></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">RESEARCH → SCORE → REVIEW</p><h1>Turn a company list into a defensible shortlist.</h1><p>Every recommendation shows its evidence, scoring logic, uncertainty, and next best action. Nothing sends automatically.</p></div>
        <div className="hero-metrics"><div><strong>{companyData.length}</strong><span>accounts</span></div><div><strong>{qualified}</strong><span>qualified</span></div><div><strong>{Object.keys(reviewed).length}</strong><span>reviewed</span></div></div>
      </section>

      <section className="icp-shell">
        <div className="icp-summary"><div><p className="eyebrow">ACTIVE ICP</p><strong>{config.focus === "saas" ? "B2B SaaS" : config.focus === "software" ? "B2B software" : "All industries"}</strong><span>{config.minEmployees}–{config.maxEmployees} employees · qualification at 60+ points</span></div><button className="secondary" onClick={() => setShowConfig(!showConfig)}>{showConfig ? "Close settings" : "Configure ICP"}</button></div>
        {showConfig && <div className="icp-config"><label>Minimum employees<input type="number" min="1" value={config.minEmployees} onChange={(e) => setConfig({ ...config, minEmployees: Number(e.target.value) })} /></label><label>Maximum employees<input type="number" min="1" value={config.maxEmployees} onChange={(e) => setConfig({ ...config, maxEmployees: Number(e.target.value) })} /></label><label>Market focus<select value={config.focus} onChange={(e) => setConfig({ ...config, focus: e.target.value as ICPConfig["focus"] })}><option value="software">B2B software</option><option value="saas">B2B SaaS only</option><option value="all">All industries</option></select></label><div className="config-note"><strong>Scoring recalculates instantly.</strong><span>Size and market-fit points reflect this ICP; risk penalties remain visible.</span></div></div>}
      </section>

      <section className="workspace">
        <aside className="accounts-panel">
          <div className="panel-head"><div><p className="eyebrow">ACCOUNT QUEUE</p><h2>Research results</h2></div><span>{filtered.length} shown</span></div>
          <label className="search"><span>⌕</span><input aria-label="Search accounts" placeholder="Search company, market…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <div className="threshold"><span>Minimum score</span><div><button className={threshold === 0 ? "active" : ""} onClick={() => setThreshold(0)}>All</button><button className={threshold === 60 ? "active" : ""} onClick={() => setThreshold(60)}>60+</button><button className={threshold === 80 ? "active" : ""} onClick={() => setThreshold(80)}>80+</button></div></div>
          <div className="account-list">
            {filtered.map((c) => { const s = scoreCompany(c, config).total; return <button key={c.id} className={`account-card ${selected.id === c.id ? "selected" : ""}`} onClick={() => setSelectedId(c.id)}>
              <div className="company-avatar">{c.name.split(" ").map((x) => x[0]).join("").slice(0,2)}</div>
              <div className="account-main"><div><strong>{c.name}</strong><span className={`score ${scoreTone(s)}`}>{s}</span></div><p>{c.industry} · {c.employees} employees</p><small>{c.signals[0]}</small></div>
            </button>; })}
            {filtered.length === 0 && <div className="empty">No accounts match this view.</div>}
          </div>
        </aside>

        <article className="detail-panel">
          <div className="detail-head"><div><p className="eyebrow">ACCOUNT BRIEF</p><h2>{selected.name}</h2><p>{selected.domain} · {selected.location}</p></div><div className={`score-ring ${scoreTone(selectedScore.total)}`}><strong>{selectedScore.total}</strong><span>ICP score</span></div></div>

          <div className="tag-row">{[selected.industry, selected.stage, `${selected.employees} employees`, ...selected.stack].map((tag) => <span key={tag}>{tag}</span>)}</div>

          <section className="brief-block"><h3>Executive brief</h3><p>{selected.summary}</p><div className="recommendation"><span>Recommended angle</span><strong>{selected.angle}</strong></div></section>

          <div className="two-col">
            <section className="brief-block"><div className="section-title"><h3>Verified evidence</h3><span className="verified">{selected.evidence.length} sources</span></div><div className="evidence-list">{selected.evidence.map((e) => <div key={e.label}><span className="check">✓</span><div><strong>{e.label}: {e.value}</strong><small>{e.source}</small></div></div>)}</div></section>
            <section className="brief-block"><h3>Score breakdown</h3><div className="breakdown">{selectedScore.breakdown.map((b) => <div key={b.label}><span>{b.label}</span><div className={`bar ${b.points < 0 ? "penalty" : ""}`}><i style={{ width: `${Math.max(0, Math.min(Math.abs(b.points) / 25 * 100, 100))}%` }} /></div><strong>{b.points > 0 ? `+${b.points}` : b.points}</strong></div>)}</div></section>
          </div>

          <section className="brief-block risk-block"><h3>Uncertainty & review flags</h3>{selected.risks.map((risk) => <span key={risk}>! {risk}</span>)}</section>

          <section className="brief-block draft-block"><div className="section-title"><div><p className="eyebrow">HUMAN REVIEW REQUIRED</p><h3>Suggested first message</h3></div><button className="secondary" onClick={copyDraft}>{copied ? "Copied" : "Copy draft"}</button></div><p>{selected.draft}</p></section>

          <footer className="review-bar"><div><span>Review decision</span><small>Approval is stored only for this browser session.</small></div><div><button className={`hold ${reviewed[selected.id] === "hold" ? "active" : ""}`} onClick={() => setReviewed({ ...reviewed, [selected.id]: "hold" })}>Hold</button><button className={`approve ${reviewed[selected.id] === "approved" ? "active" : ""}`} onClick={() => setReviewed({ ...reviewed, [selected.id]: "approved" })}>Approve account</button></div></footer>
        </article>
      </section>

      <section className="method-section">
        <div><p className="eyebrow">HOW IT WORKS</p><h2>A reviewable decision pipeline.</h2><p>Account Lens uses deterministic rules in demo mode, so every outcome can be inspected and challenged.</p></div>
        <div className="method-flow">{[["01","Company data","Demo records or validated CSV fields"],["02","Scoring","Positive fit points plus explicit risk penalties"],["03","Evidence","Facts, sources, unknowns, and interpretation"],["04","Human review","Approve, hold, then export to the next system"]].map(([number,title,body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        <div className="evaluation"><div><p className="eyebrow">EVALUATION NOTES</p><h3>What the prototype proves—and what it does not.</h3></div><div><strong>Verified</strong><p>Filtering, configurable scoring, evidence display, review-state updates, CSV import preview, and export.</p></div><div><strong>Not claimed</strong><p>Predictive conversion accuracy, live enrichment, verified contacts, or automated sending.</p></div></div>
      </section>

      {(csvPreview.length > 0 || csvError) && <div className="modal-backdrop" role="presentation"><section className="csv-modal" role="dialog" aria-modal="true" aria-label="CSV import preview"><p className="eyebrow">CSV IMPORT PREVIEW</p><h2>{csvError || `${csvPreview.length} accounts ready`}</h2>{csvError ? <p className="modal-error">{csvError}</p> : <div className="preview-list">{csvPreview.map((company) => <div key={company.id}><strong>{company.name}</strong><span>{company.industry} · {company.employees} employees · {company.stage}</span></div>)}</div>}<div className="modal-actions"><button className="secondary" onClick={() => { setCsvPreview([]); setCsvError(""); }}>Cancel</button>{csvPreview.length > 0 && <button className="approve" onClick={confirmImport}>Import accounts</button>}</div></section></div>}

      <footer className="page-footer"><span>Portfolio prototype by Artur Rakhimullin</span><span>All companies and signals are fictional demo data.</span></footer>
    </main>
  );
}
