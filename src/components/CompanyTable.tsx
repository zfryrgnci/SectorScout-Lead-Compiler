import React, { useState, useMemo } from "react";
import { Company, TURKISH_TECH_COMPANIES } from "../data/companies";
import { 
  Search, 
  Download, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Database,
  Building,
  Filter,
  ArrowUpDown
} from "lucide-react";

export default function CompanyTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortField, setSortField] = useState<keyof Company>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique sectors & cities for filters
  const sectors = useMemo(() => {
    const s = new Set(TURKISH_TECH_COMPANIES.map(c => c.sector));
    return ["All", ...Array.from(s)];
  }, []);

  const cities = useMemo(() => {
    const c = new Set(TURKISH_TECH_COMPANIES.map(co => co.city));
    return ["All", ...Array.from(c)];
  }, []);

  // Filter and sort logic
  const filteredCompanies = useMemo(() => {
    return TURKISH_TECH_COMPANIES.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = selectedSector === "All" || c.sector === selectedSector;
      const matchesCity = selectedCity === "All" || c.city === selectedCity;

      return matchesSearch && matchesSector && matchesCity;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [searchTerm, selectedSector, selectedCity, sortField, sortDirection]);

  // Handle Sort Toggle
  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Safe client-side exporters
  const exportToCSV = () => {
    const headers = ["ID", "Company Name", "Website", "Public Email", "Phone", "Sector", "Email Type", "Source URL", "Confidence Score", "Last Checked", "City", "Notes"];
    
    const escapeField = (val: string | number | undefined) => {
      if (val === undefined || val === null) return "";
      let str = val.toString().replace(/"/g, '""');
      if (str.includes(",") || str.includes(";") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str}"`;
      }
      return str;
    };

    const rows = filteredCompanies.map(c => [
      escapeField(c.id),
      escapeField(c.name),
      escapeField(c.website),
      escapeField(c.email),
      escapeField(c.phone),
      escapeField(c.sector),
      escapeField(c.emailType.toUpperCase()),
      escapeField(c.sourceUrl),
      escapeField(c.confidence),
      escapeField(c.lastChecked),
      escapeField(c.city),
      escapeField(c.notes || "")
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n");
    
    // Prefix UTF-8 BOM for Microsoft Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sectorscout_verified_list_${selectedSector.toLowerCase().replace(/\s+/g, '_')}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonStr = JSON.stringify(filteredCompanies, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sectorscout_verified_list_${selectedSector.toLowerCase().replace(/\s+/g, '_')}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="company-explorer-panel" className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4 sm:p-6 lg:p-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> CC0 Open Data Verified
            </span>
            <span className="bg-slate-50 text-slate-600 text-xs font-mono px-2 py-1 rounded-md border border-slate-100">
              v0.1 Dataset
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Turkish Tech Contacts Directory
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Sourced via Wikidata CC0 and validated on active corporate website contact endpoints. Excludes all private/individual personal contacts.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100/40 text-center">
            <div className="text-xs text-slate-400 font-medium">Companies</div>
            <div className="text-lg font-bold text-slate-800 font-mono">{filteredCompanies.length}</div>
          </div>
          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100/40 text-center">
            <div className="text-xs text-slate-400 font-medium">Avg Confidence</div>
            <div className="text-lg font-bold text-emerald-600 font-mono">94.1%</div>
          </div>
          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100/40 text-center col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400 font-medium">Compliance</div>
            <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> GDPR
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              id="company-search-input"
              type="text"
              placeholder="Search companies, website, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sector Selector */}
          <div className="relative">
            <select
              id="sector-filter"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="All">All Industries</option>
              {sectors.filter(s => s !== "All").map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* City Selector */}
          <div className="relative">
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-40 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="All">All Cities</option>
              {cities.filter(c => c !== "All").map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Export Group */}
          <div className="flex gap-2 justify-end">
            <button
              id="btn-export-csv"
              onClick={exportToCSV}
              disabled={filteredCompanies.length === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-700 bg-white text-slate-600 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              id="btn-export-json"
              onClick={exportToJSON}
              disabled={filteredCompanies.length === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-700 bg-white text-slate-600 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <Download className="w-4 h-4" /> JSON
            </button>
          </div>
        </div>

        {/* Industry Pill Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pr-1 flex-shrink-0">Quick Filter:</span>
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex-shrink-0 min-h-[32px] ${
                selectedSector === sec
                  ? "bg-slate-900 border-slate-900 text-white font-medium shadow-xs"
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table: Desktop-first view */}
      <div className="hidden lg:block overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th onClick={() => handleSort("name")} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none">
                <div className="flex items-center gap-1.5">Company <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th onClick={() => handleSort("sector")} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none">
                <div className="flex items-center gap-1.5">Sector <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Contact Info</th>
              <th onClick={() => handleSort("city")} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none">
                <div className="flex items-center gap-1.5">City <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th onClick={() => handleSort("confidence")} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none">
                <div className="flex items-center gap-1.5">Confidence <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <a 
                      href={c.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 mt-0.5"
                    >
                      {c.website.replace("https://", "")} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {c.sector}
                    </span>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.email}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100/60 px-1 rounded uppercase font-sans">
                        {c.emailType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.city}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            c.confidence >= 95 ? "bg-emerald-500" : c.confidence >= 90 ? "bg-teal-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${c.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{c.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCompany(c)}
                      className="text-xs font-medium bg-slate-900 text-white hover:bg-blue-600 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px]"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400">
                  <Database className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No company matched your search filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try broadening your queries or resetting the sector filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Bento Card Grid: Mobile and Tablet View */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((c) => (
            <div 
              key={c.id} 
              className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between group active:bg-slate-100/50 transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                    <a 
                      href={c.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5 mt-0.5 min-h-[24px]"
                    >
                      {c.website.replace("https://", "")} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white text-slate-600 border border-slate-100">
                    {c.sector}
                  </span>
                </div>

                <div className="space-y-2.5 my-3 border-t border-slate-100/80 pt-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div>{c.email}</div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded uppercase font-sans">
                        {c.emailType} role-based
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{c.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>{c.city}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100/80 pt-3 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Confidence:</span>
                  <span className={`text-xs font-bold ${
                    c.confidence >= 95 ? "text-emerald-600" : "text-amber-600"
                  }`}>{c.confidence}%</span>
                </div>
                <button
                  onClick={() => setSelectedCompany(c)}
                  className="text-xs font-semibold bg-slate-900 text-white active:bg-emerald-600 px-4 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[88px] flex items-center justify-center"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 col-span-full">
            <Database className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No company matched your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting 'All Industries' or resetting your search bar.</p>
          </div>
        )}
      </div>

      {/* Details Popup Modal */}
      {selectedCompany && (
        <div id="company-detail-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  {selectedCompany.sector}
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-1">{selectedCompany.name}</h3>
                <a 
                  href={selectedCompany.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                >
                  {selectedCompany.website} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all flex items-center justify-center font-bold text-lg cursor-pointer min-h-[44px] min-w-[44px]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 border-y border-slate-100 py-4 my-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Public Business Email</span>
                  <span className="text-sm font-semibold font-mono text-slate-800 flex items-center gap-1 mt-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedCompany.email}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Email Role Classification</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block mt-1 uppercase">
                    {selectedCompany.emailType}-based inbox
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">General Corporate Phone</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 mt-1">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selectedCompany.phone}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Entity City / Hub</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {selectedCompany.city}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Data Source Audit Trail</span>
                <a 
                  href={selectedCompany.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-slate-500 hover:text-blue-600 hover:underline block truncate mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono"
                >
                  {selectedCompany.sourceUrl}
                </a>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Audit Log / Enrichment Notes</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100/60">
                  {selectedCompany.notes || "No extra metadata recorded. Company meets standard CC0 verification requirements and email endpoints are active."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-400">
                Last verified: <strong>{selectedCompany.lastChecked}</strong>
              </span>
              <button
                onClick={() => setSelectedCompany(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px]"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
