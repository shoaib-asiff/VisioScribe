import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axios/axios.js";
import { Container } from "../container/Container.jsx";
import { Error } from "../Error.jsx";
import { useSelector } from "react-redux";
import { MainLoading } from "../MainLoading.jsx";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Cpu, 
  Clock, 
  Image as ImageIcon, 
  MessageSquare, 
  FileWarning 
} from 'lucide-react';

export function ChatCard() {
  const [error, setError] = useState("");
  const { chatId } = useParams();
  const [chat, setChat] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isLogin = useSelector((state) => state?.auth?.loginStatus);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChat = async () => {
      setError("");
      setIsLoading(true);
      try {
        const chatResponse = await axiosInstance.get(
          isLogin
            ? `/api/v1/chat/view-chat/${chatId}`
            : `/api/v1/chat/view-chat-guest/${chatId}`
        );
        if (chatResponse?.status === 200) {
          console.log(chatResponse);
          setChat(chatResponse?.data);
        } else {
          setError(chatResponse?.message);
        }
      } catch (err) {
        setError(err?.message || "Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
     <Container className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {error && <Error error={error} />}
      
      {isLoading ? (
        <MainLoading />
      ) : (
        <>
          <div className="max-w-4xl mx-auto w-full">
            
            {/* --- ADDED GO BACK BUTTON --- */}
            <div className="mb-8 relative z-10 flex items-center">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
                className="group relative inline-flex items-center gap-3 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-widest rounded-sm transition-all duration-300
                       text-cyan-400 border border-cyan-900/50 bg-[#0a111e] hover:bg-cyan-950/30 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="absolute inset-0 bg-cyan-400/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 origin-left"></div>
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Return_To_Index</span>
              </Link>
            </div>
            {/* --- END GO BACK BUTTON --- */}

            {/* Header */}
            <div className="text-center mb-12 relative">
              <div className="inline-flex items-center justify-center gap-3 mb-2 px-4 py-1 border-t border-b border-cyan-900/30 bg-cyan-950/10">
                 <div className="w-1 h-1 bg-cyan-500"></div>
                 <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.3em]">Secure_Log_Viewer</span>
                 <div className="w-1 h-1 bg-cyan-500"></div>
              </div>
              
              <h1 className="relative text-3xl sm:text-4xl font-bold text-white font-mono tracking-tighter uppercase glitch-text">
                Chat <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">Details</span>
              </h1>
            </div>

            {/* Chat Messages Container */}
            <div className="space-y-12">
              
              {/* User Message - Image on the Right */}
              {chat?.image && (
                <div className="flex justify-end items-start gap-4 group">
                  <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
                    
                    {/* Message Bubble (Tech Frame) */}
                    <div className="relative p-1 bg-[#0a111e] border border-cyan-900/50 hover:border-cyan-500/50 transition-colors duration-500 shadow-xl">
                      {/* Corner Accents */}
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500"></div>
                      
                      {/* Header Label */}
                      <div className="flex justify-between items-center bg-[#0d1626] px-3 py-1 mb-1 border-b border-cyan-900/30">
                          <span className="text-[10px] font-mono text-cyan-500">IMG_DATA_PACKET</span>
                          <ImageIcon size={10} className="text-cyan-500" />
                      </div>

                      <div className="relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500">
                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] opacity-20 pointer-events-none z-10"></div>
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <img
                          src={chat.image}
                          alt={chat?.name || "User image"}
                          className="w-full h-auto max-h-96 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>

                    {/* Timestamp */}
                    {chat?.createdAt && (
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <Clock size={10} className="text-slate-500" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          TS: {formatDate(chat.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Avatar (Hexagon) */}
                  <div className="shrink-0 mt-2">
                     <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#0a111e] border border-cyan-500/50 clip-path-hexagon" style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}></div>
                        <User size={18} className="text-cyan-400 relative z-10" />
                     </div>
                  </div>
                </div>
              )}

              {/* Bot Message - Caption on the Left */}
              {chat?.caption && (
                <div className="flex justify-start items-start gap-4 group">
                  {/* Bot Avatar (Hexagon) */}
                  <div className="shrink-0 mt-2">
                     <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#0a111e] border border-purple-500/50 clip-path-hexagon" style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}></div>
                        <Cpu size={18} className="text-purple-400 relative z-10" />
                     </div>
                  </div>

                  <div className="flex flex-col items-start max-w-[85%] sm:max-w-[70%]">
                    {/* Message Bubble (Terminal Style) */}
                    <div className="relative p-1 bg-[#0a111e] border border-purple-900/50 hover:border-purple-500/50 transition-colors duration-500 shadow-xl">
                       {/* Corner Accents */}
                       <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500"></div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500"></div>

                       {/* Header Label */}
                      <div className="flex justify-between items-center bg-[#130f1f] px-3 py-1 mb-1 border-b border-purple-900/30">
                          <span className="text-[10px] font-mono text-purple-400">ANALYSIS_RESULT</span>
                          <MessageSquare size={10} className="text-purple-400" />
                      </div>

                      <div className="relative p-4 bg-[#0e0b16]">
                        {/* Typing Cursor Decoration */}
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-purple-500 shrink-0">
                             <span className="font-mono text-xs opacity-70">&gt;</span>
                          </div>
                          <p className="text-slate-300 text-sm sm:text-base font-mono leading-relaxed opacity-90">
                            {chat.caption}
                            <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse align-middle"></span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    {chat?.createdAt && (
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <Clock size={10} className="text-slate-500" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          TS: {formatDate(chat.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!chat?.image && !chat?.caption && (
                <div className="text-center py-20 border border-dashed border-cyan-900/30 bg-cyan-950/5 rounded-lg">
                  <div className="flex flex-col items-center gap-4">
                     <div className="p-4 rounded-full bg-cyan-950/20 border border-cyan-500/20">
                        <FileWarning size={32} className="text-cyan-500/50" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-cyan-400 font-mono uppercase tracking-widest text-sm">No_Data_Found</h3>
                        <p className="text-slate-600 text-xs font-mono">Log entry appears to be empty or corrupted.</p>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
