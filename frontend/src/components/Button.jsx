export function Button({children, className, onClick, ...props}) {
    return <button
      className={`group relative px-8 py-3 bg-transparent overflow-hidden transition-all duration-300 active:scale-95 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* --- 1. Tech Frame Background (Skewed) --- */}
      <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-950/20 skew-x-[-15deg] group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"></div>

      {/* --- 2. Scanline Texture (Reveal on Hover) --- */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 skew-x-[-15deg]"></div>

      {/* --- 3. Holographic Shimmer Animation --- */}
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-15deg]"></div>

      {/* --- 4. Micro-UI Decor (Corner Bits) --- */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-300 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-300 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-2 w-1 h-1 bg-cyan-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100"></div>

      {/* --- 5. Content Projection --- */}
      <span className="relative z-10 flex items-center justify-center gap-2 font-mono text-sm font-bold text-cyan-400 uppercase tracking-widest group-hover:text-cyan-100 transition-colors shadow-black/50 drop-shadow-md">
        {children}
      </span>

    </button>
}