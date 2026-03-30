const SEAL_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbbe-zthaM_t4yu1d8rgLXIXnsVdYAhK4iVpRkY38-T3C0QczupjBJ-hIbKtILZOYmftRglfHQA5ORA67weq_22pWa4Ygb6InCCo-UHuR3fliRnk2eF9uCgMpEbR3rQJErsjiL4xg67xg7yW2azcjHj0PDs3ijssOzkJPftoPzLotreDN2AdpeV_dKBJsIE1cH0t5lBhcNEbd_I77vjTXCG6xCE3bRmNtU_K8qSaqu2wjy1uFx7j1PgRNIJkKp7IiKFMwJgnl1Ev7U";

export default function Header({ onClose }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-100/80 backdrop-blur-md shadow-sm flex justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
          <img
            src={SEAL_URL}
            alt="Official Cebu City Seal"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-[#003366] font-headline font-bold tracking-tight text-lg leading-none">
            Cebu Fuel Val
          </h1>
          <p className="text-[10px] text-[#003366] font-black uppercase tracking-wider opacity-80">
            Official Portal
          </p>
        </div>
      </div>

      {onClose ? (
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200/50 rounded-full transition-all duration-150 active:scale-95 text-[#003366]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      ) : (
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200/50 transition-colors active:scale-95 duration-150 text-[#003366]">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      )}
    </header>
  );
}
