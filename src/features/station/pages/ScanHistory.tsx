import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/shared/components/navigation/BottomNav";
import {
  fetchStationTransactions,
  type DispenseTransaction,
  type StationAccount,
} from "@/lib/data/agas";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const PAGE_SIZE = 10;

function nameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function fuelTypeTheme(fuelType: string) {
  const normalized = fuelType.toLowerCase();
  if (normalized.includes("premium diesel")) return { soft: "#dcfce7", text: "#166534" };
  if (normalized.includes("diesel")) return { soft: "#f1f5f9", text: "#475569" };
  if (normalized.includes("regular") || normalized.includes("unleaded")) return { soft: "#fefce8", text: "#854d0e" };
  if (normalized.includes("super premium")) return { soft: "#eff6ff", text: "#1d4ed8" };
  if (normalized.includes("premium")) return { soft: "#fee2e2", text: "#991b1b" };
  return { soft: "#f1f5f9", text: "#475569" };
}

function formatDateLabel(value: Date | null): string {
  if (!value) return "Unknown date";
  return value.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeLabel(value: Date | null): string {
  if (!value) return "--:--";
  return value.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function matchesFilter(date: Date | null, filter: string): boolean {
  if (!date || filter === "all") return true;

  const now = new Date();
  if (filter === "today") {
    return date.toDateString() === now.toDateString();
  }

  if (filter === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo;
  }

  if (filter === "month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  return true;
}

function toCsv(transactions: DispenseTransaction[]): string {
  const headers = ["Resident", "Plate", "Vehicle Type", "Date", "Time", "Fuel Type", "Liters", "Price/L", "Total"];
  const rows = transactions.map((tx) => [
    tx.residentName,
    tx.plate,
    tx.vehicleType,
    formatDateLabel(tx.createdAt),
    formatTimeLabel(tx.createdAt),
    tx.fuelType,
    tx.liters.toFixed(1),
    tx.pricePerLiter.toFixed(2),
    tx.totalPaid.toFixed(2),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${value}"`).join(","))
    .join("\n");
}

type ScanHistoryProps = {
  officer: StationAccount | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onScan: () => void;
};

export default function ScanHistory({ officer, activeTab, onTabChange, onScan }: ScanHistoryProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<DispenseTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

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

  const filtered = useMemo(
    () => transactions.filter((tx) => matchesFilter(tx.createdAt, activeFilter)),
    [activeFilter, transactions],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalDispensed = filtered.reduce((sum, tx) => sum + tx.liters, 0);
  const totalRevenue = filtered.reduce((sum, tx) => sum + tx.totalPaid, 0);
  const grouped = paginated.reduce((acc, tx) => {
    const label = formatDateLabel(tx.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(tx);
    return acc;
  }, {} as Record<string, DispenseTransaction[]>);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, transactions.length]);

  const handleDownload = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `station-scan-history-${activeFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-[#eef2f7]">
      <main className="flex-1 px-4 pb-36 pt-5 max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-black text-[#003366] uppercase tracking-wider">Scan History</h2>
          <button
            onClick={handleDownload}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 bg-[#003366] text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
            Download
          </button>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                activeFilter === filter.id
                  ? "bg-[#003366] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex">
          <div className="flex-1 px-4 py-3 text-center border-r border-slate-100">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Dispensed</p>
            <p className="font-headline font-black text-[#003366] text-lg leading-tight mt-0.5">{totalDispensed.toFixed(1)} L</p>
          </div>
          <div className="flex-1 px-4 py-3 text-center border-r border-slate-100">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Transactions</p>
            <p className="font-headline font-black text-[#705d00] text-lg leading-tight mt-0.5">{filtered.length}</p>
          </div>
          <div className="flex-1 px-4 py-3 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Gained</p>
            <p className="font-headline font-black text-[#003366] text-lg leading-tight mt-0.5">₱{totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {loadingTransactions && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-sm text-slate-400">
            Loading live station transactions...
          </div>
        )}

        {!loadingTransactions && Object.entries(grouped).map(([date, txs]) => (
          <section key={date} className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{date}</p>
            {txs.map((tx) => {
              const theme = fuelTypeTheme(tx.fuelType);
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
                        {tx.residentName} · {formatDateLabel(tx.createdAt)} · {formatTimeLabel(tx.createdAt)}
                      </p>
                      <span
                        className="inline-block mt-1 text-[8px] font-black px-2 py-0.5 rounded-full uppercase max-w-full truncate"
                        style={{ background: theme.soft, color: theme.text }}
                        title={tx.fuelType}
                      >
                        {tx.fuelType}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 max-w-[50%]">
                    <p className="text-base font-black text-[#003366]">{tx.liters.toFixed(1)} L</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">₱{tx.pricePerLiter.toFixed(2)}/L</p>
                    <p className="text-sm font-black text-[#003366] mt-1">
                      ₱{tx.totalPaid.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        ))}

        {!loadingTransactions && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <span className="material-symbols-outlined text-4xl">inbox</span>
            <p className="text-sm font-bold">No live records for this period</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 bg-white text-[#003366] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
              Prev
            </button>
            <p className="text-xs font-bold text-slate-400">
              Page {page} of {totalPages}
            </p>
            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 bg-white text-[#003366] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              Next
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
            </button>
          </div>
        )}
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
