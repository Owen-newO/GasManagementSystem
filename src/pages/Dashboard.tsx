import BottomNav from "../components/BottomNav";

type DashboardOfficer = {
  officerFirstName?: string;
  firstName?: string;
  stationCode?: string;
  barangay?: string;
  brand?: string;
  capacity?: string | number;
  fuelCapacities?: Record<string, number>;
  fuelPrices?: Record<string, number>;
  fuelInventory?: Record<string, number>;
  [key: string]: unknown;
};

type DashboardProps = {
  officer: DashboardOfficer | null;
  onScan: () => void;
  onEditFuels: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

function totalCapacityLabel(officer: DashboardOfficer | null): string {
  const fc = officer?.fuelCapacities;
  if (fc && typeof fc === "object") {
    const sum = Object.values(fc).reduce((acc, n) => acc + (typeof n === "number" ? n : Number(n) || 0), 0);
    if (sum > 0) return `${sum}`;
  }
  const c = officer?.capacity;
  if (c == null || c === "" || c === "N/A") return "N/A";
  const num = typeof c === "number" ? c : Number(c);
  return Number.isFinite(num) ? String(num) : String(c);
}

type RecentTransaction = {
  id: number;
  name: string;
  plate: string;
  date: string;
  time: string;
  liters: number;
  fuelType: string;
  pricePerLiter: number;
};

function nameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function fuelTypeTheme(fuelName: string) {
  const n = fuelName.toLowerCase();
  if (n.includes("regular") || n.includes("unleaded")) {
    return {
      border: "#fca5a5",
      soft: "#fee2e2",
      text: "#991b1b",
      muted: "#b91c1c",
    };
  }
  if (n.includes("diesel")) {
    return {
      border: "#86efac",
      soft: "#dcfce7",
      text: "#166534",
      muted: "#15803d",
    };
  }
  return {
    border: "#fdba74",
    soft: "#ffedd5",
    text: "#9a3412",
    muted: "#c2410c",
  };
}

const recentTransactions: RecentTransaction[] = [
  { id: 1,  name: "Rico Blanco",          plate: "GAE-1234", date: "Apr 1, 2026", time: "10:24 AM", liters: 15.0,  fuelType: "Regular/Unleaded (91)", pricePerLiter: 72.5 },
  { id: 2,  name: "Maria Clara Santos",   plate: "YHM-8890", date: "Apr 1, 2026", time: "09:45 AM", liters: 20.0,  fuelType: "Diesel",                 pricePerLiter: 68.25 },
  { id: 3,  name: "Juan Dela Cruz",       plate: "ABC-5678", date: "Apr 1, 2026", time: "08:12 AM", liters: 8.5,   fuelType: "Premium (95)",           pricePerLiter: 75.9 },
  { id: 4,  name: "Ana Reyes",            plate: "XYZ-9900", date: "Mar 31, 2026", time: "07:55 AM", liters: 12.0, fuelType: "Super Premium (97)",    pricePerLiter: 78.4 },
  { id: 5,  name: "Carlos Fernandez",     plate: "LMN-4412", date: "Mar 31, 2026", time: "07:30 AM", liters: 20.0, fuelType: "Premium Diesel",         pricePerLiter: 70.1 },
  { id: 6,  name: "Lorna Villanueva",     plate: "PQR-3310", date: "Mar 31, 2026", time: "07:10 AM", liters: 10.5, fuelType: "Regular/Unleaded (91)", pricePerLiter: 72.5 },
  { id: 7,  name: "Ramon Castillo",       plate: "STU-7721", date: "Mar 30, 2026", time: "06:58 AM", liters: 18.0, fuelType: "Premium (95)",           pricePerLiter: 75.9 },
  { id: 8,  name: "Grace Tolentino",      plate: "VWX-6650", date: "Mar 30, 2026", time: "06:40 AM", liters: 15.0, fuelType: "Diesel",                 pricePerLiter: 68.25 },
  { id: 9,  name: "Eduardo Mendoza",      plate: "BCD-1133", date: "Mar 30, 2026", time: "06:20 AM", liters: 9.0,  fuelType: "Regular/Unleaded (91)", pricePerLiter: 72.5 },
  { id: 10, name: "Felisa Bautista",      plate: "EFG-2244", date: "Mar 29, 2026", time: "06:05 AM", liters: 20.0, fuelType: "Super Premium (97)",    pricePerLiter: 78.4 },
  { id: 11, name: "Rommel Aquino",        plate: "HIJ-5566", date: "Mar 29, 2026", time: "05:50 AM", liters: 14.5, fuelType: "Premium Diesel",         pricePerLiter: 70.1 },
  { id: 12, name: "Teresita Magbanua",    plate: "KLM-8877", date: "Mar 29, 2026", time: "05:35 AM", liters: 11.0, fuelType: "Premium (95)",           pricePerLiter: 75.9 },
];
const MAX_DASHBOARD_TRANSACTIONS = 5;

export default function Dashboard({ officer, onScan, onEditFuels, activeTab, onTabChange }: DashboardProps) {
  const stationCode = officer?.stationCode || "N/A";
  const barangay = officer?.barangay || "Not set";
  const brand = officer?.brand || "Station";
  const capacity = totalCapacityLabel(officer);
  const fuelCapacities = officer?.fuelCapacities || {};
  const fuelPrices = officer?.fuelPrices || {};
  const fuelInventory = officer?.fuelInventory || {};
  const fuelInventoryCards: Array<[string, number]> = Object.keys(fuelCapacities).length
    ? Object.entries(fuelCapacities)
    : [
        ["Diesel", 0],
        ["Premium Diesel", 0],
        ["Regular/Unleaded (91)", 0],
        ["Premium (95)", 0],
        ["Super Premium (97)", 0],
      ];

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 pb-44 pt-5 max-w-2xl mx-auto w-full">

        <div className="px-4 space-y-4">

          {/* Active Station banner — high contrast */}
          <section
            className="rounded-2xl p-5 shadow-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0a192f 0%, #1e3a8a 100%)",
            }}
          >
            <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5 z-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Online</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Active Station</p>
              <p className="text-white font-headline font-black text-2xl flex items-center gap-2 leading-tight">
                <span className="material-symbols-outlined text-yellow-400 drop-shadow-md" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
                {brand}
              </p>
              <p className="text-indigo-200/80 text-xs mt-1">Barangay {barangay} · ID: {stationCode}</p>
            </div>
            
            <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto relative z-10 mt-2 sm:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/5 self-start sm:self-end">
                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Total Capacity</p>
                <p className="text-lg font-black text-white leading-none mt-0.5">{capacity} <span className="text-xs text-indigo-200">L</span></p>
              </div>
              <button
                type="button"
                onClick={onEditFuels}
                className="w-full sm:w-auto min-h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base shrink-0" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 0" }}>edit</span>
                Fuel &amp; pricing
              </button>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          </section>

          {/* Fuel inventory + price */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-headline font-black text-[#003366] uppercase tracking-wider">Fuel Type Inventory</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capacity + Price</span>
            </div>
            <div className="space-y-2">
              {fuelInventoryCards.map(([fuelName, liters]) => {
                const price = fuelPrices[fuelName] ?? 0;
                const inventory = fuelInventory[fuelName] ?? liters;
                const capacityNum = liters === 0 ? 1 : liters; // avoid divide by zero
                const percent = Math.min(100, Math.max(0, (inventory / capacityNum) * 100));
                const theme = fuelTypeTheme(fuelName);
                return (
                  <div
                    key={fuelName}
                    className="p-4 rounded-2xl flex flex-col shadow-sm border border-black/5"
                    style={{
                      background: theme.soft,
                      boxShadow: `inset 0 2px 10px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.05)`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                          style={{ background: "rgba(255,255,255,0.6)" }}
                        >
                          <span className="material-symbols-outlined" style={{ color: theme.text, fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                            local_gas_station
                          </span>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
                            Fuel Type
                          </p>
                          <p className="text-sm font-headline font-black leading-tight" style={{ color: theme.text }}>{fuelName}</p>
                          <p className="text-xs font-headline font-bold mt-0.5 leading-none" style={{ color: theme.muted }}>
                            ₱{Number(price).toFixed(2)}/L
                          </p>
                        </div>
                      </div>
                      <div className="text-right min-w-[108px]">
                        <div className="flex items-end justify-end gap-2">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Current</span>
                          <span className="text-lg font-headline font-black leading-none" style={{ color: theme.text }}>
                            {Number(inventory).toLocaleString()}<span className="text-[9px] font-semibold ml-0.5 text-slate-500">L</span>
                          </span>
                        </div>
                        <div className="flex items-end justify-end gap-2 mt-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Capacity</span>
                          <span className="text-lg font-headline font-black leading-none" style={{ color: theme.muted }}>
                            {Number(liters).toLocaleString()}<span className="text-[9px] font-semibold ml-0.5 text-slate-500">L</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percent}%`,
                          background: `linear-gradient(90deg, ${theme.muted}, ${theme.text})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-headline font-black text-[#003366] uppercase tracking-wider">Recent Transactions</h3>
              <button className="text-xs font-bold text-primary-container hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {recentTransactions.slice(0, MAX_DASHBOARD_TRANSACTIONS).map((tx) => {
                const txTheme = fuelTypeTheme(tx.fuelType);
                const totalPrice = Math.round(tx.liters * tx.pricePerLiter * 100) / 100;
                const initials = nameInitials(tx.name);
                return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#003366" }}>
                      <span className="text-white font-headline font-black text-sm tracking-tight">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{tx.name}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {tx.plate} · {tx.date} · {tx.time}
                      </p>
                      <span
                        className="inline-block mt-1 text-[8px] font-black px-2 py-0.5 rounded-full max-w-full truncate"
                        style={{ background: txTheme.soft, color: txTheme.text }}
                        title={tx.fuelType}
                      >
                        {tx.fuelType}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 max-w-[48%]">
                    <p className="text-base font-black text-[#003366]">{tx.liters.toFixed(1)} L</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                      ₱{tx.pricePerLiter.toFixed(2)}/L
                    </p>
                    <p className="text-sm font-black text-[#003366] mt-1">
                      ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Scan QR button */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button
          onClick={onScan}
          className="pointer-events-auto flex items-center gap-2 bg-[#003366] text-white font-headline font-bold px-6 py-3.5 rounded-full shadow-2xl active:scale-95 transition-all border-2 border-white/20"
          style={{ boxShadow: "0 8px 32px rgba(0,51,102,0.45)" }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
          Scan QR Code
        </button>
      </div>

      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
