import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const RESIDENT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXqfapZS-XB6Ex6q9gvjpqo49kBnsKSV_xUi6169zZVPThLwv48yJSCJsg3D7IyBEQdesNhfzMVu4GbPrY-h_mMN48GNkjkDN94i2VLoNirV4gdVD9_vpFG_EUcvNBe-m9ofA0uEj-1fsv42-nOFkcpEpueA2XQdh55CDsc-3WQ3VKnvWCEa2TuKoYjPbW7Ul7uxELnVZ-rROGOE6PCdHq3b7944xXgic5uGrP2T2o2xLqLCfUhCZh_64W-e0uHD5DJ18JBsXhcMQY";

export default function ValidationSuccess({ onBack, activeTab, onTabChange }) {
  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <Header />

      <main
        className="flex-1 pt-6 pb-36 px-4 max-w-md mx-auto w-full"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm20-20h20v20H20V0z' fill='%23003366' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="mt-4 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          {/* Status Header */}
          <div
            className="p-8 text-center relative"
            style={{
              background: "linear-gradient(135deg, #003366 0%, #001e40 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm20-20h20v20H20V0z' fill='%23003366' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                <span
                  className="material-symbols-outlined text-5xl text-[#705d00]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h2 className="font-headline font-black text-white text-2xl tracking-tight uppercase">
                Validated
              </h2>
              <p className="text-on-primary-container font-medium text-sm mt-1">
                Transaction Authorized
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Resident Identity */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-surface-container-high p-1 bg-white mb-4">
                <img
                  src={RESIDENT_IMG}
                  alt="Juan A. Dela Cruz"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-outline text-xs font-bold tracking-widest uppercase">
                  Verified Resident
                </p>
                <h3 className="font-headline font-extrabold text-2xl text-primary">
                  Juan A. Dela Cruz
                </h3>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2">
                <span className="material-symbols-outlined text-[#003366]">
                  directions_car
                </span>
                <div>
                  <p className="text-outline text-[10px] font-bold uppercase tracking-wider">
                    Plate Number
                  </p>
                  <p className="font-headline font-bold text-lg text-on-surface">
                    ABC-1234
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2">
                <span
                  className="material-symbols-outlined text-[#705d00]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_gas_station
                </span>
                <div>
                  <p className="text-outline text-[10px] font-bold uppercase tracking-wider">
                    Fuel Allowed
                  </p>
                  <p className="font-headline font-bold text-lg text-on-surface">
                    20L
                  </p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-tertiary-fixed/30 border-l-4 border-tertiary p-4 rounded-r-lg flex gap-3">
              <span className="material-symbols-outlined text-tertiary shrink-0">
                info
              </span>
              <p className="text-sm text-on-tertiary-fixed-variant leading-tight">
                Allocation is valid for immediate dispensing at the designated
                pump station. Please ensure fuel nozzle is securely attached.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onBack}
                className="w-full bg-[#003366] text-white font-headline font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">gas_meter</span>
                Confirm Dispense
              </button>
              <button
                onClick={onBack}
                className="w-full bg-surface-container-high text-on-surface-variant font-headline font-bold py-4 rounded-xl active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-outline text-xs space-y-1 pb-4">
          <p>© 2024 Cebu City Government</p>
          <p>Ref ID: VAL-9823-CEB-2024</p>
        </div>
      </main>

      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
