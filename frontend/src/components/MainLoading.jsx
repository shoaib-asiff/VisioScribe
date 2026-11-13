import { Container } from "./container/Container.jsx";
import { 
  Loader2, 
  Database, 
  FileText, 
  Server, 
  Layout, 
  Wifi, 
  HardDrive,
  Download
} from 'lucide-react';
export function MainLoading() {
  return (
     <Container className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* --- Ambient Digital Glow --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* --- Main Loading Module --- */}
        <div className="relative group">
          {/* Holographic Border */}
          <div className="absolute -inset-px bg-linear-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-xl opacity-50 blur-sm pointer-events-none"></div>

          {/* Main Card */}
          <div className="relative bg-[#0a111e]/95 border border-cyan-900/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl overflow-hidden">
            
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-20"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-900/50 z-20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-900/50 z-20"></div>

            {/* Header with animated icon */}
            <div className="text-center mb-10 relative">
              <div className="relative inline-block mb-6">
                
                {/* Rotating Tech Ring */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-2 border border-cyan-500/20 rounded-full"></div>
                  
                  {/* Center Icon */}
                  <div className="relative z-10 bg-[#0a111e] p-3 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tighter uppercase">
                  Loading <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">Content</span>
                </h1>
                <div className="flex items-center justify-center gap-2">
                   <Download size={14} className="text-cyan-500 animate-pulse" />
                   <p className="text-slate-500 text-xs font-mono tracking-[0.2em] uppercase">
                     Retrieving_Assets...
                   </p>
                </div>
              </div>
            </div>

            {/* Animated Data Flow Section */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 relative">
              
              {/* Server Avatar (Source) */}
              <div className="relative group/user flex flex-col items-center gap-2">
                <div className="relative w-14 h-14 bg-[#0d1626] border border-cyan-500/30 flex items-center justify-center clip-path-hexagon">
                  <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                  <Server className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-[10px] text-cyan-500/70 font-mono uppercase tracking-wider">Host_DB</span>
              </div>

              {/* Animated Connection Line */}
              <div className="flex-1 max-w-[100px] sm:max-w-[140px] relative h-8 flex items-center">
                {/* Track */}
                <div className="w-full h-0.5 bg-slate-800 relative overflow-hidden">
                   {/* Data Packet */}
                   <div className="absolute top-0 left-0 h-full w-1/3 bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-slide-right"></div>
                </div>
                
                {/* Floating Bits */}
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-2/3 w-1 h-1 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: "0.3s" }}></div>
              </div>

              {/* File Avatar (Target) */}
              <div className="relative group/bot flex flex-col items-center gap-2">
                <div className="relative w-14 h-14 bg-[#0d1626] border border-purple-500/30 flex items-center justify-center clip-path-hexagon">
                  <div className="absolute inset-0 bg-purple-500/10 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[10px] text-purple-500/70 font-mono uppercase tracking-wider">Local_View</span>
              </div>
            </div>

            {/* Loading progress bar */}
            <div className="mb-8 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                 <span>BUFFER</span>
                 <span className="animate-pulse">DOWNLOADING...</span>
              </div>
              <div className="relative h-1.5 bg-[#050b14] border border-slate-700 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.2)_2px,rgba(6,182,212,0.2)_4px)] opacity-30"></div>
                <div className="absolute inset-y-0 left-0 bg-cyan-500 w-1/3 animate-progress-loading shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              </div>
            </div>

            {/* Animated loading dots (Status Indicators) */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-sm animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-sm animate-bounce" style={{ animationDelay: "0.15s" }}></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-sm animate-bounce" style={{ animationDelay: "0.3s" }}></div>
            </div>

            {/* Feature icons - Data Modules */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-800/50 pt-6">
              
              {/* Module 1 */}
              <div className="text-center group flex flex-col items-center gap-2">
                <div className="p-2 rounded-sm bg-[#0d1626] border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Net_Link</p>
              </div>

              {/* Module 2 */}
              <div className="text-center group flex flex-col items-center gap-2">
                <div className="p-2 rounded-sm bg-[#0d1626] border border-slate-700 group-hover:border-purple-500/50 transition-colors">
                  <HardDrive className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">I/O_Read</p>
              </div>

              {/* Module 3 */}
              <div className="text-center group flex flex-col items-center gap-2">
                <div className="p-2 rounded-sm bg-[#0d1626] border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                  <Layout className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Render</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
