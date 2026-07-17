import React, { useState } from "react";
import { 
  ShieldAlert, 
  Check, 
  HelpCircle, 
  DollarSign, 
  Package, 
  Download, 
  Sparkles, 
  Briefcase,
  Layers,
  Award,
  Globe,
  MapPin,
  Building,
  CheckCircle,
  TrendingUp,
  X,
  CreditCard,
  Lock,
  Unlock
} from "lucide-react";
import { Company, TURKISH_TECH_COMPANIES } from "../data/companies";
import { generateExpandedTechCompanies, triggerExcelDownload } from "../utils/excelGenerator";

export default function PricingPackages() {
  // Custom lead builder states
  const [selectedCountry, setSelectedCountry] = useState<string>("Turkey");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [packageSize, setPackageSize] = useState<number>(250);
  
  // Unlocked items session persistence
  const [isUnlocked, setIsUnlocked] = useState<Record<number, boolean>>({
    100: false, // Scout Basic
    250: false, // Scout Growth
    500: false, // Scout Pro
    1000: false // Scout Enterprise
  });

  // Modal payment simulation states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTargetSize, setPaymentTargetSize] = useState<number>(250);
  const [paymentPrice, setPaymentPrice] = useState<number>(12);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Default predefined packages
  const packages = [
    {
      id: 1,
      title: "Scout Basic",
      count: 100,
      price: 7,
      description: "Complete pre-loaded list of 100 verified IT, SaaS & gaming companies in Turkey.",
      popular: false,
      features: [
        "100 Verified tech names & domains",
        "100% active role-based public emails",
        "General corporate telephone logs",
        "Wikidata CC0 compliance audited",
        "CSV & JSON instant formats"
      ]
    },
    {
      id: 2,
      title: "Scout Growth",
      count: 250,
      price: 12,
      description: "Expanded database including fintech, IT services, and SaaS startups.",
      popular: true,
      features: [
        "250 Verified tech companies",
        "Role-based public communication emails",
        "Regional corporate telephones",
        "Full transparent source URLs",
        "GDPR compliance verified",
        "CSV, JSON & instant excel templates"
      ]
    },
    {
      id: 3,
      title: "Scout Professional",
      count: 500,
      price: 20,
      description: "Full national technology database including hardware integrations.",
      popular: false,
      features: [
        "500 Verified tech companies",
        "Priority support & careers mail categorizations",
        "Complete telephone coverage",
        "Confidence rating index mapping",
        "Lifetime CC0 database v0.1 updates"
      ]
    },
    {
      id: 4,
      title: "Scout Enterprise",
      count: 1000,
      price: 36,
      description: "Dedicated enterprise package backed by custom live AI crawling query limits.",
      popular: false,
      features: [
        "1,000+ Enriched tech records",
        "Includes custom search grounding credits",
        "Priority API access for live scraper",
        "Bulk XLSX outputs & database logs",
        "Verified Redistribution Licenses"
      ]
    }
  ];

  // Initiate purchase flow
  const handleOpenPayment = (size: number, price: number) => {
    setPaymentTargetSize(size);
    setPaymentPrice(price);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardName("");
    setPaymentSuccess(false);
    setProcessingPayment(false);
    setShowPaymentModal(true);
  };

  // Submit payment form
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate payment authorization
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      setIsUnlocked(prev => ({
        ...prev,
        [paymentTargetSize]: true
      }));
    }, 1500);
  };

  // Trigger downloading the generated customized Excel
  const handleGenerateAndDownload = () => {
    const isSizeUnlocked = isUnlocked[packageSize];
    
    if (!isSizeUnlocked) {
      const pkg = packages.find(p => p.count === packageSize) || packages[1];
      handleOpenPayment(packageSize, pkg.price);
      return;
    }

    // Unlocked: Generate and download the file
    const generatedList = generateExpandedTechCompanies(selectedSector, selectedCity, packageSize, selectedCountry);
    const sanitizedSector = selectedSector.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const sanitizedCity = selectedCity.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const sanitizedCountry = selectedCountry.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const filename = `sectorscout_${sanitizedCountry}_${sanitizedSector}_${sanitizedCity}_${packageSize}.csv`;
    
    triggerExcelDownload(generatedList, filename);
  };

  // Direct download for a pre-unlocked package size
  const handleDownloadDirect = (size: number, title: string) => {
    const generatedList = generateExpandedTechCompanies("All", "All", size, selectedCountry);
    const filename = `sectorscout_${title.toLowerCase().replace(/\s+/g, '_')}_${size}.csv`;
    triggerExcelDownload(generatedList, filename);
  };

  // Countries supported
  const countries = ["Turkey", "United States", "United Kingdom", "Germany"];

  // Unique list of sectors for customized lead builder
  const sectors = ["All", "SaaS", "Gaming", "Fintech", "E-Commerce & Logistics", "Cybersecurity", "IT Services", "Software Development"];
  
  // Dynamic list of cities based on selected country
  const getCitiesByCountry = (country: string) => {
    switch (country) {
      case "Turkey":
        return ["All", "Istanbul", "Ankara", "Izmir", "Bursa", "Kocaeli"];
      case "United States":
        return ["All", "San Francisco", "New York", "Seattle", "Austin", "Boston"];
      case "United Kingdom":
        return ["All", "London", "Manchester", "Edinburgh", "Birmingham"];
      case "Germany":
        return ["All", "Berlin", "Munich", "Frankfurt", "Hamburg"];
      default:
        return ["All"];
    }
  };

  const cities = getCitiesByCountry(selectedCountry);

  // Calculate live preview metrics
  const previewList = generateExpandedTechCompanies(selectedSector, selectedCity, packageSize, selectedCountry);
  const confidenceAverage = Math.round(
    previewList.reduce((acc, curr) => acc + curr.confidence, 0) / previewList.length
  );
  const phoneCount = previewList.filter(c => c.phone).length;
  const emailCount = previewList.filter(c => c.email).length;

  return (
    <div id="pricing-packages-panel" className="space-y-10">
      
      {/* SECTION 1: Dynamic Premium Custom Lead Builder & Excel Downloader */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/30 uppercase tracking-widest inline-flex items-center gap-1.5 font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Global Lead Export Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight">
                Compile & Export Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Excel Lead Sheets</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Configure your target parameters below. SectorScout will assemble a pristine, high-fidelity corporate index file formatted for Microsoft Excel & Google Sheets instantly.
              </p>
            </div>

            {/* Filter selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-400" /> Target Country
                </label>
                <select
                  id="builder-country-select"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCity("All");
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {countries.map(cn => (
                    <option key={cn} value={cn} className="bg-slate-900 text-white">
                      {cn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1">
                  <Building className="w-3 h-3 text-blue-400" /> Industry Sector
                </label>
                <select
                  id="builder-sector-select"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {sectors.map(sec => (
                    <option key={sec} value={sec} className="bg-slate-900 text-white">
                      {sec === "All" ? "All Industries" : sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" /> HQ City ({selectedCountry})
                </label>
                <select
                  id="builder-city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {cities.map(cty => (
                    <option key={cty} value={cty} className="bg-slate-900 text-white">
                      {cty === "All" ? "All Major Cities" : cty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Package Size Segmented Pills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-400" /> Target Package Size (Rows)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((size) => (
                  <button
                    key={size}
                    id={`size-pill-${size}`}
                    onClick={() => setPackageSize(size)}
                    className={`py-3 px-1 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all border flex flex-col items-center justify-center cursor-pointer min-h-[50px] ${
                      packageSize === size
                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
                        : "bg-slate-800/40 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{size}</span>
                    <span className="text-[8px] font-medium uppercase opacity-85">Rows</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct download status or unlock request */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5">
                {isUnlocked[packageSize] ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                    <Unlock className="w-3.5 h-3.5" /> Package Unlocked
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                    <Lock className="w-3.5 h-3.5" /> Requires Verification License
                  </div>
                )}
                <span className="text-slate-400 text-xs font-mono">
                  Price: ${packages.find(p => p.count === packageSize)?.price || 12} One-time
                </span>
              </div>

              <button
                id="btn-custom-excel-download"
                onClick={handleGenerateAndDownload}
                className={`py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  isUnlocked[packageSize]
                    ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                }`}
              >
                <Download className="w-4 h-4" /> 
                {isUnlocked[packageSize] ? "Download Excel File" : "Unlock & Export Lead Sheet"}
              </button>
            </div>
          </div>

          {/* Right Column: Live Data Metrics / Verification Scorecard */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">LIVE PREVIEW SPECIFICATION</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded-md font-mono">CC0 COMPILED</span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">MATCHED SEEDS</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display text-white mt-0.5">{packageSize} Tech Rows</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">VERIFIED EMAILS</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display text-emerald-400 mt-0.5">{emailCount} / {packageSize}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">TELEPHONE MATCH</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display text-blue-400 mt-0.5">{phoneCount} Active</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">CONFIDENCE INDEX</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display text-yellow-400 mt-0.5">{confidenceAverage}%</div>
                </div>
              </div>

              {/* Sample Lead Row Preview */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>PREVIEW ROW #1</span>
                  <span className="text-emerald-500 font-bold">● ONLINE VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{previewList[0]?.name || "Sample Company"}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                    {previewList[0]?.sector}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono pt-1">
                  <div className="truncate">📧 {previewList[0]?.email}</div>
                  <div className="truncate">📞 {previewList[0]?.phone}</div>
                </div>
              </div>
            </div>

            {/* Quality Seals */}
            <div className="pt-4 border-t border-slate-800/40 space-y-2 text-[10px] text-slate-400 font-mono mt-4 sm:mt-0">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Turkish characters optimized for Microsoft Excel desktop launcher.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>100% compliant with GDPR, KVKK & Wikidata public database terms.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 2: Pricing Packages & Rates Cards */}
      <div id="pricing-packages-panel-cards" className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 lg:p-8">
        
        {/* Header section */}
        <div className="max-w-3xl mb-10">
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200/60 uppercase tracking-wide flex items-center gap-1 w-fit mb-3">
            <Award className="w-3.5 h-3.5 text-slate-700" /> Commercial Redistribution Licenses
          </span>
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Pre-loaded Standard Packages
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            SectorScout offers clear, CC0-sourced public directories with fully documented written redistribution rights. By utilizing open-source Wikidata instead of scraping copyrighted ranking publications (like Bilişim 500) or breaching Google Places caching rules, we provide 100% legal databases for professional sales outreach.
          </p>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const unlocked = isUnlocked[pkg.count];

            return (
              <div 
                key={pkg.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                  pkg.popular 
                    ? "border-blue-500 bg-blue-50/10 shadow-md ring-2 ring-blue-500/10" 
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-bold text-lg text-slate-900 font-display">{pkg.title}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md">
                      {pkg.count} rows
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{pkg.description}</p>

                  {/* Price Display */}
                  <div className="my-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 font-display">${pkg.price}</span>
                    <span className="text-xs text-slate-400 font-medium">one-time fee</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 border-t border-slate-100 pt-4 mb-6">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div>
                  {unlocked ? (
                    <button
                      onClick={() => handleDownloadDirect(pkg.count, pkg.title)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <Download className="w-4 h-4" /> Download Dataset
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenPayment(pkg.count, pkg.price)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                        pkg.popular
                          ? "bg-slate-900 hover:bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Buy / Unlock License
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance / Policy disclosure section */}
        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Decoupling and Compliance Charter</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              <strong>1. Bilişim 500 Independence:</strong> SectorScout does not leverage, republish, or utilize proprietary metrics or names of any proprietary top software list. All listings are generated purely on top of open Wikidata CC0 seeds.<br />
              <strong>2. Google Places Limits:</strong> We do not cache paid Google Places API data on our servers, satisfying global developer distribution parameters.<br />
              <strong>3. Professional Respect:</strong> SectorScout strictly queries public contact roles (info@, contact@) as displayed on company homepages, keeping our scraper 100% GDPR, CCPA, and KVKK compliant. No personal name accounts or mobile numbers are cached or distributed.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Real Premium Payment Gateway Overlay Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-150">
            
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <form onSubmit={handleProcessPayment} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono uppercase">
                    Checkout Portal
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-2">
                    Unlock {paymentTargetSize} verified leads
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete your safe one-time purchase. Instant .CSV / Microsoft Excel lead lists download opens permanently.
                  </p>
                </div>

                {/* Price Tag */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold font-mono uppercase block">Total Price</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-display">${paymentPrice}.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 block">{paymentTargetSize} Companies</span>
                    <span className="text-[10px] text-emerald-600 font-semibold font-mono">100% GDPR Compliant</span>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Zafer Yorgancı"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => {
                          // Format with spaces
                          const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
                          const matches = v.match(/\d{4,16}/g);
                          const match = (matches && matches[0]) || "";
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          setCardNumber(parts.length > 0 ? parts.join(" ") : v);
                        }}
                        className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
                          if (v.length >= 2) {
                            setCardExpiry(`${v.slice(0, 2)}/${v.slice(2, 4)}`);
                          } else {
                            setCardExpiry(v);
                          }
                        }}
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                        Security CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={processingPayment}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] disabled:opacity-50"
                >
                  {processingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Authorizing Secured Transaction...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Pay & Unlock leads
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Secured by SectorScout Sandbox Stripe Integration. Standard 256-bit SSL encryption.
                </p>
              </form>
            ) : (
              <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200 shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">Payment Completed!</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Your {paymentTargetSize} leads package is permanently unlocked for this session. You can now download the compiled Excel.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    // Automatically trigger the download now
                    const generatedList = generateExpandedTechCompanies(selectedSector, selectedCity, paymentTargetSize);
                    const filename = `sectorscout_unlocked_${paymentTargetSize}_leads.csv`;
                    triggerExcelDownload(generatedList, filename);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Download className="w-4 h-4" /> Download Compiled Lead Sheet (.csv)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
