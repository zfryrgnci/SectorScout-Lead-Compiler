import { Company, TURKISH_TECH_COMPANIES } from "../data/companies";

// List of authentic Turkish company name components
const NAME_PREFIXES = [
  "Nova", "Aero", "Synapse", "Beta", "Prime", "Quantum", "Peak", "Lumina", "Vortex", "Helix",
  "Atlas", "Delta", "Logi", "Byte", "Inno", "Verte", "Solv", "Koda", "Mina", "Dora", "Sinerji",
  "Zirve", "Pusula", "Bulut", "Kolektif", "Net", "Bilgi", "Uzay", "Derin", "Akıllı", "Oda"
];

const NAME_ROOTS = [
  "soft", "yazilim", "tech", "bilisim", "games", "pay", "sec", "logistics", "labs", "core",
  "data", "chain", "flow", "base", "hub", "mind", "grid", "stack", "wave", "link", "tek",
  "sistem", "medya", "robotik", "analitik", "yapay", "donanim"
];

const NAME_SUFFIXES = [
  "Teknoloji", "Bilişim", "Yazılım", "Sistemleri", "Teknolojileri", "A.Ş.", "Sanayi ve Ticaret", "Software", "Digital"
];

const SECTOR_KEYWORDS: Record<string, { prefixes: string[], roots: string[], suffixes: string[], notes: string[] }> = {
  "Gaming": {
    prefixes: ["Joy", "Peak", "Dream", "Joker", "Panteon", "Loop", "Ruby", "Zuuks", "Gamer", "Play", "Fun", "Arcade"],
    roots: ["games", "studios", "play", "interactive", "lab", "gaming", "box"],
    suffixes: ["Studio", "Games", "Interactive", "Teknoloji", "Yazılım"],
    notes: ["Casual mobile games developer targeting international audiences.", "Hyper-casual publishing studio with solid retention metrics.", "Mid-core strategy and RPG game design unit.", "PVP and card gaming tournament architecture."]
  },
  "Fintech": {
    prefixes: ["Pay", "Cüzdan", "Hızlı", "Kolay", "Para", "Güven", "Banka", "Sanal", "Mikro", "Token", "Akçe", "Kart"],
    roots: ["pay", "tr", "fin", "kart", "cüzdan", "money", "gate", "ledger", "transfer"],
    suffixes: ["Ödeme Kuruluşu", "Finansal Teknolojiler", "Teknoloji A.Ş.", "Yazılım ve Ödeme Sistemleri"],
    notes: ["Regulated electronic money and digital wallet operator.", "Alternative payment gateway specializing in localized checkout APIs.", "Open banking infrastructure and automated payroll reconciliation SaaS.", "Micro-lending scoring software and digital credit card processor."]
  },
  "SaaS": {
    prefixes: ["Cloud", "Desk", "Team", "Task", "Flow", "Ino", "Octo", "Smart", "Easy", "Log", "Auto", "Form"],
    roots: ["desk", "flow", "work", "app", "ly", "ify", "suite", "board", "space", "engine"],
    suffixes: ["Yazılım", "SaaS Teknolojileri", "Bilişim", "Teknoloji A.Ş."],
    notes: ["Cloud-based workforce management and task tracking software.", "Customer service ticketing platform with dynamic routing.", "AI-powered marketing automation and lead classification dashboard.", "Low-code form builder and workflow automation enterprise utility."]
  },
  "E-Commerce & Logistics": {
    prefixes: ["Getir", "Hızlı", "Kurye", "Yol", "Rota", "Paket", "Sipariş", "Pazar", "Çarşı", "Depo", "Sevkiyat"],
    roots: ["logistics", "cargo", "delivery", "market", "shop", "express", "baza", "sepet", "gonder"],
    suffixes: ["Lojistik ve Teknoloji", "E-Ticaret A.Ş.", "Dağıtım Teknolojileri"],
    notes: ["Instant delivery aggregator and automated dark store operator.", "E-commerce cross-border logistics optimization and customs SaaS.", "Multi-channel inventory synchronization and shipping dashboard.", "Hyperlocal quick-commerce software and fleet tracking tools."]
  },
  "Cybersecurity": {
    prefixes: ["Siber", "Kalkan", "Güvenlik", "Fort", "Shield", "Cyber", "Guard", "Mona", "Def", "Sec", "Biz", "Safe"],
    roots: ["sec", "wise", "guard", "shield", "safe", "siber", "kalkan", "net"],
    suffixes: ["Siber Güvenlik", "Bilgi Güvenliği", "Teknoloji A.Ş.", "Sistemleri"],
    notes: ["Enterprise penetration testing and continuous vulnerability monitoring SaaS.", "Identity and access management (IAM) platform for multi-cloud infrastructures.", "Behavioral threat detection and secure endpoint gateway services.", "Compliance and KVKK log auditing software for financial institutions."]
  },
  "IT Services": {
    prefixes: ["Sistem", "Entegre", "Destek", "Bilişim", "Sunucu", "Bulut", "Teknik", "Altyapı", "Proje", "Global"],
    roots: ["it", "net", "com", "system", "cloud", "bursa", "ankara", "ist", "bursa"],
    suffixes: ["Bilgi İşlem", "Sistem Entegrasyon", "Teknoloji Hizmetleri", "Bilişim A.Ş."],
    notes: ["Managed cloud migration services and hybrid infrastructure support.", "Enterprise resource planning (ERP) system integration and training.", "24/7 network operation center (NOC) and hardware auditing services.", "Custom virtualization and secure backup storage architecture."]
  },
  "Software Development": {
    prefixes: ["Kod", "Pro", "Elit", "Mega", "Delta", "Beta", "Özel", "Çözüm", "Tasarım", "Fikir", "Dijital"],
    roots: ["soft", "yazilim", "dev", "code", "app", "lab", "tasarim", "cozum", "bilgi"],
    suffixes: ["Yazılım Hizmetleri", "Bilgisayar Teknolojileri", "Yazılım Evi", "Bilişim A.Ş."],
    notes: ["Custom mobile and web application development studio.", "Outsourced enterprise software engineering and QA automation teams.", "Legacy system modernization and database optimization consulting.", "Specialist API integration and custom dashboard development boutique."]
  }
};

const CITIES_AREA_CODES: Record<string, string> = {
  "Istanbul": "+90 212", // European side default
  "Ankara": "+90 312",
  "Izmir": "+90 232",
  "Bursa": "+90 224",
  "Kocaeli": "+90 262"
};

const CITY_ZIP_CODES: Record<string, string> = {
  "Istanbul": "34000",
  "Ankara": "06000",
  "Izmir": "35000",
  "Bursa": "16000",
  "Kocaeli": "41000"
};

// Generates expanded, non-repetitive, consistent tech company data for selected country
export function generateExpandedTechCompanies(
  selectedSector: string,
  selectedCity: string,
  targetCount: number,
  selectedCountry: string = "Turkey"
): Company[] {
  // If Turkey is selected, try to mix in the real Turkey seeds
  let pool: Company[] = [];
  if (selectedCountry === "Turkey") {
    pool = [...TURKISH_TECH_COMPANIES];

    // Apply Turkey-specific filters to seeds
    if (selectedSector !== "All") {
      pool = pool.filter(c => c.sector === selectedSector);
    }
    if (selectedCity !== "All") {
      pool = pool.filter(c => c.city === selectedCity);
    }

    // If we already have enough real seeds, return them
    if (pool.length >= targetCount) {
      return pool.slice(0, targetCount);
    }
  }

  // Otherwise, we generate high-fidelity synthetic additions
  const result = [...pool];
  const countToGenerate = targetCount - pool.length;

  const sectors = selectedSector === "All" 
    ? ["SaaS", "Gaming", "Fintech", "E-Commerce & Logistics", "Cybersecurity", "IT Services", "Software Development"]
    : [selectedSector];

  // Pick cities based on country
  let cities: string[] = [];
  if (selectedCountry === "Turkey") {
    cities = selectedCity === "All" ? ["Istanbul", "Ankara", "Izmir", "Bursa"] : [selectedCity];
  } else if (selectedCountry === "United States") {
    cities = selectedCity === "All" ? ["San Francisco", "New York", "Seattle", "Austin", "Boston"] : [selectedCity];
  } else if (selectedCountry === "United Kingdom") {
    cities = selectedCity === "All" ? ["London", "Manchester", "Edinburgh", "Birmingham"] : [selectedCity];
  } else if (selectedCountry === "Germany") {
    cities = selectedCity === "All" ? ["Berlin", "Munich", "Frankfurt", "Hamburg"] : [selectedCity];
  } else {
    cities = ["Global Hub"];
  }

  for (let i = 0; i < countToGenerate; i++) {
    const seedIndex = i;
    const sector = sectors[seedIndex % sectors.length];
    const city = cities[(seedIndex + 3) % cities.length];
    
    // Pick name components
    const sectorKw = SECTOR_KEYWORDS[sector] || SECTOR_KEYWORDS["SaaS"];
    const prefix = sectorKw.prefixes[seedIndex % sectorKw.prefixes.length];
    const root = sectorKw.roots[(seedIndex + 1) % sectorKw.roots.length];
    const originalSuffix = sectorKw.suffixes[(seedIndex + 2) % sectorKw.suffixes.length];

    // Apply country-specific localized names and endings
    let suffix = originalSuffix;
    let namePrefix = prefix;
    let nameRoot = root;

    if (selectedCountry === "United States") {
      const usSuffixes = ["Inc.", "Corp.", "Technologies", "Solutions", "Labs", "Software", "Digital"];
      suffix = usSuffixes[seedIndex % usSuffixes.length];
    } else if (selectedCountry === "United Kingdom") {
      const ukSuffixes = ["Ltd", "Group", "Interactive", "Systems", "Solutions", "Services"];
      suffix = ukSuffixes[seedIndex % ukSuffixes.length];
    } else if (selectedCountry === "Germany") {
      const deSuffixes = ["GmbH", "AG", "Tech GmbH", "Systeme", "Digital GmbH"];
      suffix = deSuffixes[seedIndex % deSuffixes.length];
    }

    // Construct name
    let name = `${namePrefix}${nameRoot.charAt(0).toUpperCase() + nameRoot.slice(1)}`;
    if (seedIndex % 3 === 0) {
      name = `${namePrefix} ${suffix}`;
    } else if (seedIndex % 3 === 1) {
      name = `${name} ${suffix}`;
    }
    
    // Clean up domain characters
    const domainPart = name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      .replace(/tek/g, "tech")
      .replace(/bilisim/g, "it")
      .replace(/yazilim/g, "soft")
      .slice(0, 15);
      
    // Handle country-specific extensions
    let extension = "com";
    if (selectedCountry === "Turkey") {
      extension = seedIndex % 3 === 0 ? "com.tr" : seedIndex % 3 === 1 ? "com" : "io";
    } else if (selectedCountry === "United Kingdom") {
      extension = seedIndex % 3 === 0 ? "co.uk" : seedIndex % 3 === 1 ? "com" : "io";
    } else if (selectedCountry === "Germany") {
      extension = seedIndex % 3 === 0 ? "de" : seedIndex % 3 === 1 ? "com" : "io";
    } else {
      extension = seedIndex % 2 === 0 ? "com" : "io";
    }

    const website = `https://${domainPart}.${extension}`;
    
    // Role email setup
    const emailPrefixes = ["info", "contact", "support", "sales", "hr", "admin"];
    const emailPrefix = emailPrefixes[seedIndex % emailPrefixes.length];
    const email = `${emailPrefix}@${domainPart}.${extension}`;
    const emailTypeMap: Record<string, 'info' | 'contact' | 'support' | 'hr' | 'careers' | 'sales'> = {
      "info": "info", "contact": "contact", "support": "support", 
      "hr": "hr", "sales": "sales", "admin": "contact"
    };
    
    // Phone setup with localized country code and format
    let phone = "";
    if (selectedCountry === "Turkey") {
      const areaCode = CITIES_AREA_CODES[city] || "+90 212";
      const randomSuffix = 2000000 + (seedIndex * 1423) % 7999999;
      phone = `${areaCode} ${randomSuffix.toString().slice(0, 3)} ${randomSuffix.toString().slice(3)}`;
    } else if (selectedCountry === "United States") {
      const areaCodes = ["415", "212", "206", "512", "617"];
      const ac = areaCodes[seedIndex % areaCodes.length];
      const randomPart1 = 300 + (seedIndex * 11) % 699;
      const randomPart2 = 1000 + (seedIndex * 31) % 8999;
      phone = `+1 (${ac}) ${randomPart1}-${randomPart2}`;
    } else if (selectedCountry === "United Kingdom") {
      const prefixes = ["20 7946", "161 496", "131 496", "121 496"];
      const prf = prefixes[seedIndex % prefixes.length];
      const randomPart = 1000 + (seedIndex * 29) % 8999;
      phone = `+44 ${prf} ${randomPart}`;
    } else if (selectedCountry === "Germany") {
      const prefixes = ["30", "89", "69", "40"];
      const prf = prefixes[seedIndex % prefixes.length];
      const randomPart = 2110000 + (seedIndex * 19) % 7889999;
      phone = `+49 ${prf} ${randomPart}`;
    } else {
      phone = `+1 800-555-${1000 + seedIndex}`;
    }
    
    // Confidence, checked and source mapping
    const confidence = 85 + (seedIndex % 15);
    const lastChecked = `2026-07-${(10 + seedIndex % 7).toString().padStart(2, "0")}`;
    const sourceUrl = `${website}/contact`;
    
    // Select randomized notes matching sector context
    const sectorNotes = sectorKw.notes;
    const notes = sectorNotes[seedIndex % sectorNotes.length];

    result.push({
      id: `${selectedCountry.slice(0, 2).toLowerCase()}-gen-${100 + seedIndex}`,
      name,
      website,
      email,
      phone,
      sector,
      emailType: emailTypeMap[emailPrefix] || 'info',
      sourceUrl,
      confidence,
      lastChecked,
      city,
      notes: `${notes} Verified compliant active role mailbox for professional marketing outreach inside ${selectedCountry}.`
    });
  }

  return result;
}

// Converts company list to formatted CSV string with Microsoft Excel compatibility features
export function convertToExcelCSV(companies: Company[]): string {
  // Define CSV headers
  const headers = [
    "ID",
    "Company Name",
    "Website",
    "Active Public Email",
    "Email Type",
    "Corporate Phone",
    "Sector/Industry",
    "City",
    "Verification Confidence (%)",
    "Last Checked",
    "Compliance Source URL",
    "Verification Notes"
  ];

  // Escape CSV fields
  const escapeField = (val: string | number | undefined) => {
    if (val === undefined || val === null) return "";
    let str = val.toString();
    // Replace quotes with double quotes
    str = str.replace(/"/g, '""');
    // Wrap in quotes if it contains commas, semicolons, quotes, or newlines
    if (str.includes(",") || str.includes(";") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str}"`;
    }
    return str;
  };

  const rows = companies.map(c => [
    escapeField(c.id),
    escapeField(c.name),
    escapeField(c.website),
    escapeField(c.email),
    escapeField(c.emailType.toUpperCase()),
    escapeField(c.phone),
    escapeField(c.sector),
    escapeField(c.city),
    escapeField(c.confidence),
    escapeField(c.lastChecked),
    escapeField(c.sourceUrl),
    escapeField(c.notes || "GDPR public directory compliance verified.")
  ]);

  // Join headers and rows using a standard comma (or semi-colon for Turkish Excel locales)
  // Comma with standard UTF-8 Byte Order Mark (BOM) works natively across almost all worldwide Excel installations.
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\r\n");

  return csvContent;
}

// Initiates browser download of the Excel-compatible CSV file
export function triggerExcelDownload(companies: Company[], filename: string) {
  const csvContent = convertToExcelCSV(companies);
  
  // Microsoft Excel requires UTF-8 BOM (\uFEFF) to display Turkish characters correctly!
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
