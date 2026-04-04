import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/shared/components/navigation/BottomNav";
import {
  fetchStationTransactions,
  type DispenseTransaction,
  type StationAccount,
} from "@/lib/data/agas";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type FuelTheme = {
  soft: string;
  text: string;
  gradient: string;
};

type DashboardProps = {
  officer: StationAccount | null;
  onScan: () => void;
  onEditFuels: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lastUpdated?: Date | null;
};

const ORDERED_FUELS = [
  "Diesel",
  "Premium Diesel",
  "Regular/Unleaded (91)",
  "Premium (95)",
  "Super Premium (97)",
] as const;

const MAX_DASHBOARD_TRANSACTIONS = 3;

function fuelTypeTheme(fuelType: string): FuelTheme {
  const normalized = fuelType.toLowerCase();
  if (normalized.includes("premium diesel")) return { soft: "#dcfce7", text: "#166534", gradient: "#16a34a" };
  if (normalized.includes("diesel")) return { soft: "#f1f5f9", text: "#475569", gradient: "#64748b" };
  if (normalized.includes("regular") || normalized.includes("unleaded")) return { soft: "#fefce8", text: "#854d0e", gradient: "#ca8a04" };
  if (normalized.includes("super premium")) return { soft: "#eff6ff", text: "#1d4ed8", gradient: "#2563eb" };
  if (normalized.includes("premium")) return { soft: "#fee2e2", text: "#991b1b", gradient: "#dc2626" };
  return { soft: "#f1f5f9", text: "#475569", gradient: "#64748b" };
}

function nameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function totalCapacityLabel(officer: StationAccount | null): number {
  const capacities = officer?.fuelCapacities;
  if (capacities && typeof capacities === "object") {
    const sum = Object.values(capacities).reduce((acc, value) => acc + (typeof value === "number" ? value : Number(value) || 0), 0);
    if (sum > 0) return sum;
  }

  const rawCapacity = officer?.capacity;
  const numericCapacity = typeof rawCapacity === "number" ? rawCapacity : Number(rawCapacity);
  return Number.isFinite(numericCapacity) ? numericCapacity : 0;
}

function formatTransactionDate(value: Date | null): string {
  if (!value) return "Unknown date";
  return value.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTransactionTime(value: Date | null): string {
  if (!value) return "--:--";
  return value.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Dashboard({ officer, onScan, onEditFuels, activeTab, onTabChange, lastUpdated }: DashboardProps) {
  const [lastUpdateLabel, setLastUpdateLabel] = useState("Never");
  const [transactions, setTransactions] = useState<DispenseTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!lastUpdated) {
      setLastUpdateLabel("Never");
      return;
    }

    setLastUpdateLabel(timeAgo(lastUpdated));
    const interval = setInterval(() => setLastUpdateLabel(timeAgo(lastUpdated)), 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  useEffect(() => {
    if (!officer?.uid) {
      setTransactions([]);
      return;
    }

    let cancelled = false;
    setLoadingTransactions(true);

    void fetchStationTransactions(officer.uid)
      .then((items) => {
        if (!cancelled) {
          setTransactions(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTransactions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingTransactions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [officer?.uid]);

  const stationCode = officer?.stationCode || "N/A";
  const barangay = officer?.barangay || "Not set";
  const brand = officer?.brand || officer?.stationName || "Station Name";
  const stationStatus =
    officer?.presenceStatus?.toLowerCase() === "online" || officer?.status?.toLowerCase() === "online"
      ? "online"
      : "offline";

  const fuelCapacities = officer?.fuelCapacities || {};
  const fuelPrices = officer?.fuelPrices || {};
  const fuelInventory = officer?.fuelInventory || {};
  const recentTransactions = useMemo(
    () => transactions.slice(0, MAX_DASHBOARD_TRANSACTIONS),
    [transactions],
  );

  const totalCapacity = totalCapacityLabel(officer);
  const totalInventory = Object.values(fuelInventory).reduce((sum, value) => sum + (typeof value === "number" ? value : Number(value) || 0), 0);
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.totalPaid, 0);

  return (
    <div className="flex flex-col min-h-dvh bg-[#eef2f7]">
      <main className="flex-1 pb-44 max-w-2xl mx-auto w-full">
        <div className="space-y-5">
          <div className="px-4 pt-5 space-y-3">
            <section className="rounded-2xl px-4 py-4 flex flex-col gap-3" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d3270 100%)" }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-white shrink-0"
                      style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
                    >
                      local_gas_station
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline font-black text-white text-base leading-tight truncate">{brand}</p>
                    <p className="text-xs text-white/50">Barangay {barangay}</p>
                    <p className="text-xs text-white/50">ID: {stationCode}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 border ${
                  stationStatus === "online"
                    ? "bg-emerald-500/20 border-emerald-400/40"
                    : "bg-white/10 border-white/20"
                }`}>
                  {stationStatus === "online" ? (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full h-2 w-2 bg-slate-400" />
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    stationStatus === "online" ? "text-emerald-400" : "text-slate-400"
                  }`}>
                    {stationStatus === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Total Capacity</p>
                  <p className="font-black text-white text-base leading-tight mt-0.5">
                    {totalCapacity.toLocaleString()} L
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Current Stock</p>
                  <p className="font-black text-white text-base leading-tight mt-0.5">
                    {totalInventory.toLocaleString()} L
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Last Update</p>
                  <p className="font-black text-white text-base leading-tight mt-0.5">{lastUpdateLabel}</p>
                </div>
              </div>
            </section>
          </div>

          <section className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-headline font-black text-[#003366] uppercase tracking-wider">
                Fuel Type Inventory
              </h3>
              <button onClick={onEditFuels} type="button" className="text-xs font-bold text-primary-container hover:underline">
                <span className="px-1 material-symbols-outlined shrink-0" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 0" }}>
                  edit
                </span>
                Fuel &amp; Pricing
              </button>
            </div>
            {ORDERED_FUELS.filter((fuelType) => {
              const availableFuels = officer?.availableFuels;
              if (!Array.isArray(availableFuels) || availableFuels.length === 0) return true;
              return availableFuels.includes(fuelType);
            }).map((fuelType) => {
              const theme = fuelTypeTheme(fuelType);
              const capacityLiters = fuelCapacities[fuelType] ?? 0;
              const inventoryLiters = fuelInventory[fuelType] ?? capacityLiters;
              const price = fuelPrices[fuelType] ?? 0;

              return (
                <div
                  key={fuelType}
                  className="rounded-2xl shadow-sm overflow-hidden flex items-center gap-3 px-4 py-3"
                  style={{ background: theme.gradient }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-white/20">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#fff", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
                    >
                      local_gas_station
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-black text-sm text-white leading-tight truncate">{fuelType}</p>
                    <p className="font-headline font-bold text-base leading-none text-white">
                      ₱{Number(price).toFixed(2)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-black text-sm text-white">{Number(inventoryLiters).toLocaleString()} L</span>
                      <span className="material-symbols-outlined text-white/60" style={{ fontSize: "18px" }}>trending_flat</span>
                      <span className="font-black text-sm text-white">{Number(capacityLiters).toLocaleString()} L</span>
                    </div>
                    <div className="flex justify-between gap-2 mt-0.5">
                      <p className="text-[9px] px-1 font-bold uppercase tracking-wider text-white/60">Current</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Capacity</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="px-4 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex">
              <div className="flex-1 px-4 py-3 text-center border-r border-slate-100">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Transactions</p>
                <p className="font-headline font-black text-[#705d00] text-lg leading-tight mt-0.5">{transactions.length}</p>
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-slate-100">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Dispensed</p>
                <p className="font-headline font-black text-[#003366] text-lg leading-tight mt-0.5">
                  {(totalCapacity - totalInventory).toLocaleString()} L
                </p>
              </div>
              <div className="flex-1 px-4 py-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Revenue</p>
                <p className="font-headline font-black text-[#003366] text-lg leading-tight mt-0.5">₱{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </section>

          <section className="px-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-headline font-black text-[#003366] uppercase tracking-wider">
                Recent Transactions
              </h3>
              <button type="button" onClick={() => onTabChange("history")} className="text-xs font-bold text-primary-container hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-2">
              {loadingTransactions && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-sm text-slate-400">
                  Loading live station transactions...
                </div>
              )}

              {!loadingTransactions && recentTransactions.length === 0 && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-sm text-slate-400">
                  No transactions recorded yet.
                </div>
              )}

              {recentTransactions.map((tx) => {
                const txTheme = fuelTypeTheme(tx.fuelType);
                return (
                  <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#003366]">
                        <span className="text-white font-headline font-black text-sm tracking-tight">
                          {nameInitials(tx.residentName)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{tx.plate || "No Plate"} <span className="font-medium text-slate-400">({tx.vehicleType || "Vehicle"})</span></p>
                        <p className="text-[10px] font-medium text-slate-400 truncate">
                          {tx.residentName} · {formatTransactionDate(tx.createdAt)} · {formatTransactionTime(tx.createdAt)}
                        </p>
                        <span
                          className="inline-block mt-1 text-[8px] font-black px-2 py-0.5 rounded-full uppercase max-w-full truncate"
                          style={{ background: txTheme.soft, color: txTheme.text }}
                          title={tx.fuelType}
                        >
                          {tx.fuelType}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 max-w-[50%]">
                      <p className="text-base font-black text-[#003366]">
                        {tx.liters.toFixed(1)} L
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                        ₱{tx.pricePerLiter.toFixed(2)}/L
                      </p>
                      <p className="text-sm font-black text-[#003366] mt-1">
                        ₱{tx.totalPaid.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-32 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button
          type="button"
          onClick={onScan}
          className="pointer-events-auto flex items-center gap-2 bg-[#003366] text-white font-headline font-bold px-6 py-3.5 rounded-full shadow-[0_8px_32px_rgba(0,51,102,0.45)] active:scale-95 transition-all border-2 border-white/20"
        >
          <span className="material-symbols-outlined icon-filled">qr_code_scanner</span>
          Scan QR Code
        </button>
      </div>

      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
