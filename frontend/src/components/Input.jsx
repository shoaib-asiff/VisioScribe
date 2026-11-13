import { forwardRef, useId } from "react";
import { Terminal, Hash } from "lucide-react";

export const Input = forwardRef(
  ({ type = "text", label, className, ...props }, ref) => {
    const id = useId();
    return (
      <div className="relative group font-sans">
        {/* --- Label Section --- */}
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-2 text-[10px] font-bold font-mono text-cyan-500/70 mb-2 uppercase tracking-[0.2em] group-focus-within:text-cyan-400 transition-colors"
          >
            <Terminal size={10} className="opacity-50" />
            {label}
          </label>
        )}

        <div className="relative">
          {/* --- Input Field --- */}
          <input
            type={type}
            id={id}
            ref={ref}
            className={`w-full px-4 py-3.5 bg-[#0a111e]/90 border border-cyan-900/30 rounded-sm
            text-cyan-100 placeholder-slate-600 font-mono text-sm
            focus:outline-none focus:border-cyan-500/50 focus:bg-[#0c1629]
            focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] 
            transition-all duration-300
            ${className || ""}`}
            {...props}
          />

          {/* --- Robotic Accents (Decorations) --- */}

          {/* 1. Corner Brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-700 group-focus-within:border-cyan-400 transition-colors pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-700 group-focus-within:border-cyan-400 transition-colors pointer-events-none"></div>

          {/* 2. Scanning Laser Effect (Bottom Border) */}
          <div className="absolute bottom-0 left-0 h-px bg-cyan-400 w-0 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none"></div>

          {/* 3. Inner Holographic Glint */}
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          {/* 4. Side Tech Bits */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-900/20 group-focus-within:bg-cyan-500/20 transition-colors pointer-events-none"></div>
        </div>
      </div>
    );
  }
);
