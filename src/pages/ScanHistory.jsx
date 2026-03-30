import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const history = [
  { id: 1, name: "Rico Blanco", plate: "GAE-1234", time: "10:24 AM", date: "Today", liters: 15.0, type: "Regular" },
  { id: 2, name: "Maria Clara Santos", plate: "YHM-8890", time: "09:45 AM", date: "Today", liters: 20.0, type: "Diesel" },
  { id: 3, name: "Juan Dela Cruz", plate: "ABC-5678", time: "08:12 AM", date: "Today", liters: 8.5, type: "Premium" },
  { id: 4, name: "Ana Reyes", plate: "XYZ-9900", time: "03:30 PM", date: "Yesterday", liters: 12.0, type: "Regular" },
  { id: 5, name: "Carlos Fernandez", plate: "LMN-4412", time: "01:15 PM", date: "Yesterday", liters: 20.0, type: "Diesel" },
];

export default function ScanHistory({ activeTab, onTabChange }) {
  const grouped = history.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 px-6 pb-36 pt-6 max-w-2xl mx-auto w-full space-y-6">
        <h2 className="text-lg font-headline font-extrabold text-primary">Scan History</h2>
        {Object.entries(grouped).map(([date, txs]) => (
          <section key={date} className="space-y-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{date}</p>
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{tx.name}</p>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                      {tx.plate} • {tx.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{tx.liters.toFixed(1)} L</p>
                  <p className="text-[9px] font-bold text-tertiary uppercase">{tx.type}</p>
                </div>
              </div>
            ))}
          </section>
        ))}
      </main>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
