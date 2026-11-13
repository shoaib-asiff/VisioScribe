import { useCallback, useEffect, useRef } from "react";
import { Scan, Zap, Activity, Wifi } from "lucide-react";

export function Container({ children, className = "" }) {
  const animationFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const target = e.currentTarget;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const mouseFollowEffect = [
    "before:content-['']",
    "before:absolute",
    "before:inset-0",
    "before:z-0", // Behind content
    "before:opacity-0", 
    "hover:before:opacity-100", // Fades in on hover
    "before:transition-opacity",
    "before:duration-500",
    "before:bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),_rgba(6,182,212,0.15),_transparent_80%)]",
  ].join(" ");

  return (
    <div
      className={`
        relative overflow-hidden 
        p-8 
        bg-slate-950 
        text-cyan-50 
        border border-cyan-900/50 
        shadow-[0_0_15px_rgba(6,182,212,0.1)] 
        backdrop-blur-sm
        group
        gpu-boost
        ${mouseFollowEffect} 
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }}
    >
      {/* --- Decorative Tech Overlay (Visuals only, no logic) --- */}
      
      {/* 1. Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none z-0" />

      {/* 2. Robotic Corner Brackets (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60">
        <path d="M 2 20 V 2 H 20" stroke="rgba(6,182,212,0.8)" strokeWidth="2" fill="none" />
        <path d="M calc(100% - 20px) calc(100% - 2px) H calc(100% - 2px) V calc(100% - 20px)" stroke="rgba(6,182,212,0.8)" strokeWidth="2" fill="none" />
        <rect x="calc(100% - 15px)" y="5" width="10" height="2" fill="rgba(6,182,212,0.5)" />
        <rect x="5" y="calc(100% - 7px)" width="10" height="2" fill="rgba(6,182,212,0.5)" />
      </svg>

      {/* 3. Lucide Icons as HUD Elements (Purely Cosmetic) */}
      <div className="absolute top-3 right-3 text-cyan-500/30 pointer-events-none z-10 animate-pulse">
        <Scan size={20} strokeWidth={1.5} />
      </div>

      <div className="absolute bottom-3 left-3 flex gap-2 text-cyan-500/20 pointer-events-none z-10">
        <Activity size={14} strokeWidth={2} />
        <Wifi size={14} strokeWidth={2} />
        <Zap size={14} strokeWidth={2} />
      </div>

      {/* 4. Scanner Line Animation */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-700 z-10" />

      {/* --- End Decoration --- */}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}