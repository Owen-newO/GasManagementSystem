import Header from "../components/Header";

const GAS_STATION_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC70SgrsGiLN3gjgqCDp55cjhvV5VIoB2T5YVmftxnSRPpxTgbXjIcZ03Hm4KY11KBjWHA3R5FV3eQlmKDNWj3Vw_CfPibdpGmlemiqOvVyQRwNtlO8lc5yUBf3bUhryqy-yKgfkBzLCbXsbU_sHs-pgLc5_9TCUpPgQgnmSbe7OLcrU4SOREZFAmbOvngYOGlZYcVmSx0x1tPWfH1BfJUJc_LWyachTNBmKYJwBzjDu6E66tWCwpgkSuEILU2ggW_56irEll2DJgpr";

export default function QRScanner({ onClose, onSuccess }) {
  return (
    <div className="flex flex-col h-dvh bg-black overflow-hidden">
      {/* Header */}
      <div className="relative z-50">
        <Header onClose={onClose} />
      </div>

      {/* Camera Viewfinder */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background camera feed */}
        <div className="absolute inset-0 z-0">
          <img
            src={GAS_STATION_IMG}
            alt="Camera feed"
            className="w-full h-full object-cover opacity-80 brightness-75"
          />
        </div>

        {/* Dark overlay with cutout */}
        <div className="absolute inset-0 z-10 scanner-mask" />

        {/* Overlay UI */}
        <div className="absolute inset-0 z-20 flex flex-col items-center pointer-events-none">
          {/* Station indicator */}
          <div className="mt-6 px-4 py-2 bg-primary-container/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-2 border border-white/10">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
            >
              local_gas_station
            </span>
            <span className="text-white text-xs font-bold font-headline tracking-wide">
              Mabolo Shell Station #402
            </span>
          </div>

          {/* Scanner frame */}
          <div className="relative w-[75vw] aspect-square mt-10">
            {/* Corner borders */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-tertiary-fixed rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-tertiary-fixed rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-tertiary-fixed rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-tertiary-fixed rounded-br-xl" />

            {/* Animated scan line */}
            <div className="scanning-line absolute w-full top-1/2" />
          </div>

          {/* Instruction text */}
          <div className="mt-8 px-8 py-4 text-center">
            <h2 className="text-white font-headline font-bold text-xl drop-shadow-md">
              Scan resident QR code to validate.
            </h2>
            <p className="text-white/60 text-sm mt-2 font-body">
              Position the QR code within the frame for instant verification.
            </p>
          </div>
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-6">
          <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white active:bg-white/30 transition-all">
            <span className="material-symbols-outlined">flashlight_on</span>
          </button>
          <button
            onClick={onSuccess}
            className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white active:bg-white/30 transition-all"
          >
            <span className="material-symbols-outlined">image</span>
          </button>
        </div>

        {/* Simulate scan button (demo) */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={onSuccess}
            className="bg-tertiary-fixed text-on-tertiary-fixed px-6 py-3 rounded-full font-headline font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            Simulate Scan
          </button>
        </div>

        {/* Banig texture */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/4 opacity-10 pointer-events-none z-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>
    </div>
  );
}
