import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios/axios.js";
import { useState, useCallback } from "react";
import { Error } from "../Error.jsx";
import { 
  Trash2, 
  AlertTriangle, 
  Image as ImageIcon, 
  FileText, 
  ChevronRight,
  Maximize
} from 'lucide-react';

export function HistoryCard({ imageURL, caption, id, onDelete }) {
  const [error, setError] = useState("");

  const onDeleteCard = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const response = await axiosInstance.delete(
          `/api/v1/chat/delete-chat/${id}`
        );
        if (response?.status === 200) {
          onDelete(id);
        }
      } catch (error) {
        setError(error?.message);
      }
    },
    [id]
  );
  return (
   <Link to={`/chat/${id}`} className="block group relative">
      {/* --- Hover Holographic Glow --- */}
      <div className="absolute -inset-0.5 bg-linear-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>

      {/* --- Card Container (Data Module) --- */}
      <div
        className="relative bg-[#0a111e] border border-cyan-900/50 hover:border-cyan-500/50 rounded-xl p-1 shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-[1.01] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        {/* Decorative Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-900 group-hover:border-cyan-400 transition-colors z-10"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-900 group-hover:border-cyan-400 transition-colors z-10"></div>

        {/* --- ERROR POPUP (Overlay) --- */}
        {error && (
          <div
            className="absolute inset-0 z-50 p-6 flex flex-col items-center justify-center 
                       bg-[#050b14]/95 backdrop-blur-sm text-center border border-red-500/30"
          >
            {/* Warning Icon Animation */}
            <div className="relative mb-3">
               <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
               <AlertTriangle className="w-10 h-10 text-red-500 relative z-10" strokeWidth={1.5} />
            </div>

            <div className="text-red-400 font-mono text-sm tracking-widest uppercase mb-2">
              System_Alert
            </div>
            
            <div className="mb-4">
              <Error error={error} />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setError(""); 
              }}
              className="px-6 py-2 text-[10px] font-bold font-mono uppercase tracking-widest
                         bg-red-950/30 border border-red-500/50 text-red-400 rounded-sm
                         hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Close_Alert
            </button>
          </div>
        )}
        {/* --- END ERROR POPUP --- */}

        {/* --- Delete Button (Trash Protocol) --- */}
        <button
          type="button"
          onClick={onDeleteCard}
          className="absolute top-3 right-3 z-20 p-2 rounded-sm
                     bg-[#050b14]/80 backdrop-blur-md border border-slate-700
                     text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-950/30
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     transition-all duration-300 ease-out"
          title="Purge Data"
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>

        {/* --- Image Section (Visual Data) --- */}
        <div className="relative mb-1 rounded-lg overflow-hidden border border-cyan-900/30 bg-[#050b14]">
            {/* Tech Header Strip */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-black/80 to-transparent z-10 flex items-center px-2 border-b border-white/5">
                <ImageIcon size={10} className="text-cyan-500/70 mr-2" />
                <span className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">IMG_Source_01</span>
            </div>
            
            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] opacity-10 pointer-events-none z-10"></div>
            
            <img
                src={imageURL}
                alt="Analyzed Content"
                className="w-full h-48 sm:h-56 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 filter grayscale-30 group-hover:grayscale-0"
            />
            
            {/* Hover Maximizer Icon */}
            <div className="absolute bottom-2 right-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Maximize size={14} />
            </div>
        </div>

        {/* --- Caption Section (Analysis Log) --- */}
        <div className="relative p-3 bg-[#0c1322] border-t border-cyan-900/30">
          <div className="flex items-start gap-3">
             <div className="mt-1 shrink-0">
                <FileText size={14} className="text-cyan-500/70" />
             </div>
             
             <div className="min-w-0">
                <p className="text-slate-400 text-xs sm:text-sm font-mono line-clamp-2 leading-relaxed group-hover:text-cyan-100 transition-colors duration-300">
                  {caption}
                </p>
             </div>
          </div>

          {/* Footer / View Details */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/50 pt-2">
             <span className="text-[10px] text-slate-600 font-mono uppercase">ID: {id.slice(-6)}</span>
             
             <div className="flex items-center gap-1 text-cyan-500/0 group-hover:text-cyan-400 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Access_Log</span>
                <ChevronRight size={12} />
             </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
