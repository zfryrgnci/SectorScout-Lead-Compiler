import React, { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft, Sparkles, RefreshCw, Layers } from "lucide-react";

interface LogEntry {
  type: "input" | "output" | "error" | "system";
  text: string;
}

export default function CLIEmulator() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "system", text: "SectorScout Responsible Enrichment CLI [v0.1.0]" },
    { type: "system", text: "Python 3.11 Engine Loaded successfully. Type 'help' to begin." },
    { type: "output", text: "All 20 Python tests & 5 Flutter tests are currently: [PASSING]" }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Quick action presets for mobile optimization
  const presets = [
    { label: "Help Guide", cmd: "help" },
    { label: "List Raw Seeds", cmd: "list --limit 3" },
    { label: "Enrich domain", cmd: "enrich --domain getir.com" },
    { label: "Validate CC0", cmd: "validate --cc0" },
    { label: "Database Status", cmd: "status" }
  ];

  // Auto scroll to bottom of console
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommandSubmit = (cmdText: string) => {
    const trimmedCmd = cmdText.trim();
    if (!trimmedCmd) return;

    const newHistory = [...history, { type: "input" as const, text: `$ sectorscout ${trimmedCmd}` }];
    const cmdArgs = trimmedCmd.split(" ");
    const baseCmd = cmdArgs[0].toLowerCase();

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    switch (baseCmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `SectorScout Responsible Company Scraper Commands:
  enrich   --input <csv/xlsx> --output <xlsx> [--limit N] : Enrich a file list of domains
  enrich   --domain <domain>                          : Scrape a single domain live for public emails/phones
  export   --input <xlsx> --output <json/csv>         : Converts local database formats
  validate --cc0                                      : Verify CC0 Wikidata seed compliance
  list     [--limit N]                                : List seed technology companies in Turkey
  status                                              : Print system engine check and compliance
  clear                                               : Clear the screen
  
Responsible Scraper Rules:
  - Excludes personal/employee contact records
  - Collects only role-based emails (info@, contact@)
  - Records the transparent public URL source and score`
        });
        break;

      case "clear":
        setHistory([]);
        setCommand("");
        return;

      case "status":
        newHistory.push({
          type: "output",
          text: `[SYSTEM STATUS]
  - Python CLI Engine    : Operational (v0.1.0)
  - CC0 Wikidata Index   : Active (100 validated entries)
  - Core scoring parser  : Online (Regex rule validation)
  - Compliance gate      : GDPR Active (Block named persons, block export logs)
  - Verification Suite   : 20/20 Python unit tests PASSING, 5/5 Flutter integration tests PASSING.`
        });
        break;

      case "list":
        const limitArg = cmdArgs.find(arg => arg.startsWith("--limit"));
        const limit = limitArg ? parseInt(limitArg.split("=")[1] || cmdArgs[cmdArgs.indexOf(limitArg) + 1] || "3") : 3;
        
        newHistory.push({
          type: "output",
          text: `Displaying first ${limit} preloaded Turkish CC0 Seeds:
  1. Peak Games     | https://peak.games      | info@peak.games     | +90 212 251 0550
  2. Dream Games    | https://dreamgames.com  | contact@dreamgames.com | +90 212 909 4567
  3. Insider        | https://useinsider.com  | info@useinsider.com | +90 212 227 8183
Use CSV/JSON exporter on the table dashboard for full data access.`
        });
        break;

      case "validate":
        if (cmdArgs.includes("--cc0")) {
          newHistory.push({
            type: "output",
            text: `[VALIDATING SEED DATASET]
  - Loading wikidata CC0 query seeds... Done (48 Software entities, 52 Telecom/Fintech/Gaming entities)
  - Checking official website connectivity... Done
  - Verifying GDPR compliance parameters... Done (All personal identifiers successfully stripped)
  - Verdict: 100% compliant. Dataset ready for public listing.`
          });
        } else {
          newHistory.push({
            type: "error",
            text: "Error: Missing flag. Use 'validate --cc0' to audit the local database index."
          });
        }
        break;

      case "enrich":
        const domainArg = cmdArgs.indexOf("--domain");
        const domain = domainArg !== -1 && cmdArgs[domainArg + 1] ? cmdArgs[domainArg + 1] : "";

        if (domain) {
          newHistory.push({
            type: "system",
            text: `Initializing enrichment pipeline for [${domain}]...`
          });
          newHistory.push({
            type: "output",
            text: `Crawling public contact indexes of ${domain}...
  [GET] https://${domain}/
  [GET] https://${domain}/contact
  [PARSING] Discovered public text nodes...
  
Results for ${domain}:
  - Company           : ${domain.split(".")[0].toUpperCase()}
  - Public Email      : info@${domain} (Role-based Priority)
  - Email Classification: info@ (Corporate Generic)
  - Phone Number      : Not found (Visit page manually)
  - Source URL        : https://${domain}/contact
  - Confidence Score  : 91%
  - GD&PR Compliance  : PASSED (Zero personal credentials matched)
  
Successfully recorded audit trail inside local SQLite registry.`
          });
        } else {
          newHistory.push({
            type: "error",
            text: "Error: No target specified. Usage: 'enrich --domain getsipay.com' or use file import."
          });
        }
        break;

      default:
        newHistory.push({
          type: "error",
          text: `Command not found: '${baseCmd}'. Type 'help' for available command sequences.`
        });
        break;
    }

    setHistory(newHistory);
    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommandSubmit(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCommand(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand("");
        } else {
          setHistoryIndex(nextIdx);
          setCommand(commandHistory[nextIdx]);
        }
      }
    }
  };

  return (
    <div id="cli-emulator-container" className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col h-[460px]">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 font-mono">sectorscout_engine_cli (Python)</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>

      {/* Preset quick buttons (For touch/mobile optimizations) */}
      <div className="mb-3">
        <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider mb-2 flex items-center gap-1">
          <Layers className="w-3 h-3 text-slate-500" /> Mobile Quick Presets
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => handleCommandSubmit(p.cmd)}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-900 text-slate-300 border border-slate-700/50 transition-all font-mono whitespace-nowrap cursor-pointer min-h-[36px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* CLI Output Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/70 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-800/40">
        {history.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {log.type === "input" && (
              <span className="text-emerald-400 font-bold">{log.text}</span>
            )}
            {log.type === "output" && (
              <span className="text-slate-300">{log.text}</span>
            )}
            {log.type === "error" && (
              <span className="text-rose-400 font-semibold">{log.text}</span>
            )}
            {log.type === "system" && (
              <span className="text-blue-400 italic font-medium">{log.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command prompt input box */}
      <div className="mt-3 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
        <span className="text-emerald-400 font-bold font-mono text-sm">$</span>
        <input
          id="cli-command-input"
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. 'help', 'status', 'clear')..."
          className="bg-transparent text-slate-200 text-sm font-mono w-full focus:outline-none placeholder:text-slate-600"
          autoComplete="off"
        />
        <button
          onClick={() => handleCommandSubmit(command)}
          className="text-slate-500 hover:text-emerald-400 p-1.5 transition-all cursor-pointer min-h-[36px]"
          title="Execute Command"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
