import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const settingsGroups = [
  {
    title: "Station",
    items: [
      { icon: "local_gas_station", label: "Active Station", value: "Shell – Fuente Osmeña" },
      { icon: "swap_horiz", label: "Switch Station", value: "" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "badge", label: "Officer ID", value: "OFF-2024-CEBu" },
      { icon: "lock", label: "Change PIN", value: "" },
      { icon: "logout", label: "Sign Out", value: "", danger: true },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "info", label: "Version", value: "1.0.0" },
      { icon: "policy", label: "Privacy Policy", value: "" },
    ],
  },
];

export default function Settings({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 px-6 pb-36 pt-6 max-w-2xl mx-auto w-full space-y-6">
        <h2 className="text-lg font-headline font-extrabold text-primary">Settings</h2>
        {settingsGroups.map((group) => (
          <section key={group.title} className="space-y-2">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">
              {group.title}
            </p>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((item, i) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface-container-low active:bg-surface-container ${
                    i < group.items.length - 1 ? "border-b border-outline-variant/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`material-symbols-outlined text-xl ${item.danger ? "text-error" : "text-[#003366]"}`}
                    >
                      {item.icon}
                    </span>
                    <span className={`text-sm font-medium ${item.danger ? "text-error" : "text-on-surface"}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.value && (
                    <span className="text-xs text-on-surface-variant">{item.value}</span>
                  )}
                  {!item.value && !item.danger && (
                    <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
