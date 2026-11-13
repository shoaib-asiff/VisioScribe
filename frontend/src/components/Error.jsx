import { useEffect, useState } from "react";
import { AlertTriangle, X, Activity, Cpu } from "lucide-react";

export function Error({ error }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!error || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 animate-slide-in font-sans">
      <div className="relative group">
        {/* --- Background Glow --- */}
        <div className="absolute -inset-1 bg-red-500/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

        {/* --- Error Container (System Alert Module) --- */}
        <div className="relative backdrop-blur-xl bg-[#0a111e]/95 border border-red-500/50 p-1 shadow-[0_0_30px_rgba(220,38,38,0.15)] w-full sm:w-auto sm:min-w-[320px] max-w-md overflow-hidden">
          {/* Robotic Corner Brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500 z-20"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500 z-20"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/30 z-10"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500/30 z-10"></div>

          {/* Header Bar */}
          <div className="flex items-center justify-between bg-red-950/30 border-b border-red-500/30 px-3 py-1 mb-3">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">
                System_Alert
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-red-500"></div>
              <div className="w-1 h-1 bg-red-800"></div>
            </div>
          </div>

          <div className="px-4 pb-4 flex items-start gap-4">
            {/* Error Icon Module */}
            <div className="shrink-0 mt-1">
              <div className="relative w-10 h-10 flex items-center justify-center border border-red-500/30 bg-red-900/10 clip-path-octagon">
                <div className="absolute inset-0 border border-red-500/20 rotate-45"></div>
                <AlertTriangle
                  className="w-5 h-5 text-red-500 relative z-10"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Error Message Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-red-400 font-mono text-xs font-bold uppercase mb-1 flex items-center gap-2">
                <Cpu size={12} />
                Critical_Failure
              </h3>
              <p className="text-red-200/80 text-xs font-mono leading-relaxed wrap-break-word">
                {typeof error === "string"
                  ? error
                  : error?.message || "An error occurred"}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="shrink-0 p-1 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-sm transition-all duration-200 border border-transparent hover:border-red-500/30"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar for auto-dismiss */}
          <div className="h-1 bg-red-950/50 w-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 h-full bg-red-500 animate-progress-bar origin-left shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
