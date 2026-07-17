import React, { useState } from "react";
import { Company } from "../data/companies";
import { 
  Sparkles, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  Loader2,
  Globe,
  Gauge
} from "lucide-react";

interface AIEnricherProps {
  onAddCompany: (c: Company) => void;
}

export default function AIEnricher({ onAddCompany }: AIEnricherProps) {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [enrichedData, setEnrichedData] = useState<Company | null>(null);
  const [isRealAI, setIsRealAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calming messages during server-side Google Grounded Search Crawl
  const loadingMessages = [
    "Contacting SectorScout AI Agent...",
    "Querying public CC0 open data records...",
    "Launching Google Search Grounding to locate official contact pages...",
    "Inspecting public DOM tree for role email and general phone tags...",
    "Applying GDPR compliance gate to strip private employee names...",
    "Calculating contact confidence metrics... Done!"
  ];

  const handleEnrich = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domainInput.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!cleanDomain) return;

    setLoading(true);
    setError(null);
    setEnrichedData(null);
    setLoadingStep(0);

    // Increment loading step messages for premium feel
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact the server-side scraper. Make sure your API key is configured.");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setEnrichedData(result.data);
        setIsRealAI(!!result.isRealAI);
      } else {
        throw new Error(result.error || "Could not find any public contacts for this domain.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during live crawling.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleAddToWorkspace = () => {
    if (enrichedData) {
      onAddCompany(enrichedData);
      setEnrichedData(null);
      setDomainInput("");
      // Show success popup or feedback
      alert(`Success! "${enrichedData.name}" has been appended to your active research database.`);
    }
  };

  return (
    <div id="ai-enricher-section" className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8">
      <div className="max-w-2xl">
        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 w-fit mb-3">
          <Sparkles className="w-3 h-3 text-emerald-600" /> AI-Powered Live Discovery
        </span>
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          SectorScout Live Scraper Sandbox
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter any corporate domain to crawl and extract public role-based emails, telephones, and audit source URLs in real-time. No private personal emails are collected.
        </p>

        <form onSubmit={handleEnrich} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              id="ai-enrich-domain-input"
              type="text"
              placeholder="e.g. insu.io, colendi.com, getir.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all placeholder:text-slate-400 min-h-[44px]"
              required
            />
          </div>
          <button
            id="btn-enrich-submit"
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Crawling...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Enrich Domain
              </>
            )}
          </button>
        </form>

        {/* Loading Feedback Panel */}
        {loading && (
          <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center animate-pulse">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <div className="text-sm font-semibold text-slate-800 font-mono">
              {loadingMessages[loadingStep]}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              We leverage Gemini search grounding to guarantee accuracy and compliance before returning the records. This takes about 3-7 seconds.
            </p>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="mt-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0 mt-0.5">
              ⚠️
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-800">Crawl Pipeline Throttled</h4>
              <p className="text-xs text-rose-600/90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Enriched Result Bento Card */}
        {enrichedData && !loading && (
          <div className="mt-6 bg-white p-5 rounded-3xl border border-slate-150 shadow-md animate-in fade-in slide-in-from-bottom-3 duration-200">
            
            {/* Sandbox Mode Alert Indicator */}
            {!isRealAI && (
              <div className="mb-4 bg-amber-50/80 border border-amber-200/60 text-amber-800 px-4 py-3 rounded-2xl text-xs flex items-start gap-2.5">
                <span className="text-sm">💡</span>
                <div className="space-y-0.5">
                  <p className="font-bold">Heuristic Sandbox Fallback Mode Active</p>
                  <p className="text-amber-700/90 leading-normal">
                    This sandbox applet is currently simulating live extraction. To crawl <strong>any actual live domain on the internet in real-time</strong>, go to your AI Studio <strong>Settings &gt; Secrets</strong> panel and add your <strong>GEMINI_API_KEY</strong>. The server will automatically connect to our real search-grounding crawl pipeline.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md uppercase">
                    {enrichedData.sector}
                  </span>
                  {isRealAI ? (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md uppercase">
                      ✓ LIVE GROUNDED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md uppercase">
                      ⚠ SANDBOX PREVIEW
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mt-1.5">{enrichedData.name}</h3>
                <a 
                  href={enrichedData.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5 mt-0.5 font-medium"
                >
                  {enrichedData.website} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Scout Score</span>
                  <span className="font-bold text-slate-800">{enrichedData.confidence}% Confidence</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 my-1 border-b border-slate-100">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Discovered Public Email</span>
                  <span className="text-sm font-semibold text-slate-800 font-mono flex items-center gap-1.5 mt-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {enrichedData.email || "No public email found"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Classification</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase inline-block mt-1">
                    {enrichedData.emailType}-based priority
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Public Corporate Phone</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {enrichedData.phone || "No public phone found"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Hub City</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {enrichedData.city || "Not recorded"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> GDPR Compliant, last checked: {enrichedData.lastChecked}
              </div>
              <button
                onClick={handleAddToWorkspace}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" /> Add to Active List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
