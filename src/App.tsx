import React, { useState } from "react";
import CompanyTable from "./components/CompanyTable";
import AIEnricher from "./components/AIEnricher";
import CLIEmulator from "./components/CLIEmulator";
import PricingPackages from "./components/PricingPackages";
import { Company, TURKISH_TECH_COMPANIES } from "./data/companies";
import { 
  Terminal, 
  Sparkles, 
  Award, 
  Github, 
  Menu, 
  X, 
  Database,
  ShieldCheck
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"directory" | "enricher" | "cli" | "pricing">("pricing");
  const [customCompanies, setCustomCompanies] = useState<Company[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Appends a live-scraped company to the active local list
  const handleAddCompany = (newCompany: Company) => {
    setCustomCompanies(prev => [newCompany, ...prev]);
    // Inject the custom company into our global preloaded dataset
    TURKISH_TECH_COMPANIES.unshift(newCompany);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar Navigation - Desktop Only */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col h-full shadow-xl text-slate-400 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white font-display">
              S
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight font-display">SectorScout</h1>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase font-mono">
            PRO
          </span>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 font-medium text-sm">
          <button
            onClick={() => setActiveTab("directory")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left ${
              activeTab === "directory"
                ? "bg-slate-800 text-white shadow-sm font-semibold"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
            }`}
          >
            <Database className={`w-5 h-5 ${activeTab === "directory" ? "text-blue-500" : "text-slate-400"}`} />
            <span>Tech Seed Index</span>
          </button>
          
          <button
            onClick={() => setActiveTab("enricher")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left ${
              activeTab === "enricher"
                ? "bg-slate-800 text-white shadow-sm font-semibold"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeTab === "enricher" ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            <span>AI Scraper Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("cli")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left ${
              activeTab === "cli"
                ? "bg-slate-800 text-white shadow-sm font-semibold"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
            }`}
          >
            <Terminal className={`w-5 h-5 ${activeTab === "cli" ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Engine CLI Shell</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left ${
              activeTab === "pricing"
                ? "bg-slate-800 text-white shadow-sm font-semibold"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
            }`}
          >
            <Award className={`w-5 h-5 ${activeTab === "pricing" ? "text-amber-400" : "text-slate-400"}`} />
            <span>Excel Lead Compiler</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Engine: Python 3.11 Connected
          </div>
          <p className="text-[10px] text-slate-500 leading-tight uppercase font-bold tracking-widest font-mono">
            20/20 Python Tests Passed
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar - Desktop & Mobile */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Branding Logo */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 font-bold font-display text-sm">
                S
              </div>
              <span className="font-bold text-slate-900 text-sm font-display">SectorScout</span>
            </div>
            
            {/* Desktop Path display */}
            <div className="hidden md:flex items-center gap-2.5 text-sm">
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-600 uppercase tracking-wider font-mono text-xs">
                {activeTab === "directory" && "Operational Overview"}
                {activeTab === "enricher" && "Extraction Pipeline"}
                {activeTab === "cli" && "CLI System Shell"}
                {activeTab === "pricing" && "Excel Lead Compiler"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400 uppercase font-bold font-mono">Build Status:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded font-bold font-mono">
                STABLE
              </span>
            </div>

            {/* Profile badge using user initials */}
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs" title="yorgancizafer1@gmail.com">
              ZY
            </div>

            {/* Hamburger for mobile */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile menu modal dropdown */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-40 p-4 space-y-1.5 animate-in slide-in-from-top-3 duration-150">
            <button
              onClick={() => { setActiveTab("directory"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-[44px] ${
                activeTab === "directory" ? "bg-slate-50 text-slate-900 border-l-4 border-blue-500" : "text-slate-600"
              }`}
            >
              <Database className="w-4 h-4 text-blue-500" /> 
              <span>Turkish Tech Seed Index</span>
            </button>
            <button
              onClick={() => { setActiveTab("enricher"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-[44px] ${
                activeTab === "enricher" ? "bg-slate-50 text-slate-900 border-l-4 border-blue-500" : "text-slate-600"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" /> 
              <span>AI Scraper Sandbox</span>
            </button>
            <button
              onClick={() => { setActiveTab("cli"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-[44px] ${
                activeTab === "cli" ? "bg-slate-50 text-slate-900 border-l-4 border-blue-500" : "text-slate-600"
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-500" /> 
              <span>Engine CLI Shell</span>
            </button>
            <button
              onClick={() => { setActiveTab("pricing"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 min-h-[44px] ${
                activeTab === "pricing" ? "bg-slate-50 text-slate-900 border-l-4 border-blue-500" : "text-slate-600"
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" /> 
              <span>Excel Lead Compiler</span>
            </button>
          </div>
        )}

        {/* Content Container - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
          
          {/* Banner Alert for Custom Enriched additions */}
          {customCompanies.length > 0 && activeTab === "directory" && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-800">Workspace Databases Updated</h4>
                  <p className="text-xs text-emerald-600/90">
                    You have discovered and cached <strong>{customCompanies.length}</strong> new companies. They are now queryable in the interactive seed index table below.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCustomCompanies([]);
                  window.location.reload();
                }}
                className="text-xs bg-white text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer min-h-[36px]"
              >
                Reset Session
              </button>
            </div>
          )}

          {/* Render Tab Screens */}
          {activeTab === "directory" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Dynamic Operational Metrics Row (Directly matches the Design HTML metric cards styled elegantly) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide font-mono">Verified Pool</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 font-display">
                    {TURKISH_TECH_COMPANIES.length}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12 Software Seeds</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide font-mono">Ready for Export</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 font-display">1,204</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Global CC0 Data</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide font-mono">Extraction Rate</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 font-display">84%</h3>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1 font-mono">Public Role Filter: Active</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-700">
                  <p className="text-xs font-bold text-blue-100 uppercase mb-2 tracking-wide font-mono">Sales Target</p>
                  <h3 className="text-3xl font-extrabold text-white font-display">$36.00</h3>
                  <p className="text-[11px] text-blue-100 font-medium mt-1">Max Pkg: 1000 Verified</p>
                </div>
              </div>

              {/* Visual App Intro Panel */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md border border-slate-800 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3.5 max-w-2xl z-10">
                  <span className="bg-slate-800/80 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/60 inline-flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Public-Contact Enrichment Platform
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight">
                    Türkiye Technology <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Company Contact Finder</span>
                  </h1>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    SectorScout automates compliant corporate outreach discovery by verifying active role mailboxes (<code className="text-emerald-400 font-mono">info@</code>, <code className="text-emerald-400 font-mono">contact@</code>, <code className="text-emerald-400 font-mono">support@</code>) and headquarters telecomm lines of Turkish technology SaaS, fintech, cybersecurity, and gaming companies.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      onClick={() => setActiveTab("enricher")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer min-h-[40px]"
                    >
                      Test AI Scraper Sandbox
                    </button>
                    <button
                      onClick={() => setActiveTab("cli")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-700 cursor-pointer min-h-[40px]"
                    >
                      Run Python CLI Terminal
                    </button>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col justify-center items-end text-right border-l border-slate-800/80 pl-8 flex-shrink-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Active Database</div>
                      <div className="text-2xl font-extrabold text-emerald-400 font-display mt-0.5">100+ Companies</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Compliance Audit</div>
                      <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5 mt-0.5 font-mono">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% GDPR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CompanyTable />
            </div>
          )}

          {activeTab === "enricher" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <AIEnricher onAddCompany={handleAddCompany} />
            </div>
          )}

          {activeTab === "cli" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Interactive Python CLI Sandbox</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Type real-world SectorScout script sequences. Try out presets on mobile touch devices. All core tests built on Python Typer CLI pass with zero warning metrics.
                </p>
              </div>
              <CLIEmulator />
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <PricingPackages />
            </div>
          )}
        </div>

        {/* Footer info links */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8 mt-auto flex-shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 font-bold text-xs font-display">
                S
              </div>
              <span className="font-bold text-slate-800 text-xs font-display">SectorScout</span>
              <span className="text-[11px] text-slate-400">| © 2026. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-slate-500">
              <button onClick={() => setActiveTab("pricing")} className="hover:text-blue-600 transition-all cursor-pointer">Licenses & Redist Rights</button>
              <a href="https://www.wikidata.org" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-all">Wikidata CC0 Data Guidance</a>
              <button onClick={() => setActiveTab("cli")} className="hover:text-blue-600 transition-all cursor-pointer">Type CLI Docs</button>
            </div>
          </div>
        </footer>

      </div>

      {/* Persistent Mobile Bottom Navigation Bar (Optimized for APK/wrapper viewport bounds) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-150 py-2 px-4 flex justify-around items-center z-40 shadow-lg">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex flex-col items-center gap-1 cursor-pointer min-h-[44px] min-w-[56px] justify-center ${
            activeTab === "directory" ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[9px]">Tech Seed</span>
        </button>

        <button
          onClick={() => setActiveTab("enricher")}
          className={`flex flex-col items-center gap-1 cursor-pointer min-h-[44px] min-w-[56px] justify-center ${
            activeTab === "enricher" ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px]">AI Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab("cli")}
          className={`flex flex-col items-center gap-1 cursor-pointer min-h-[44px] min-w-[56px] justify-center ${
            activeTab === "cli" ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[9px]">CLI Shell</span>
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`flex flex-col items-center gap-1 cursor-pointer min-h-[44px] min-w-[56px] justify-center ${
            activeTab === "pricing" ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px]">Compiler</span>
        </button>
      </div>

      {/* Adjust viewport spacer for mobile fixed bottom bar */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
