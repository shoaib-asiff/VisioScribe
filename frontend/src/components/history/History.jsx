import { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Container } from "../container/Container.jsx";
import { HistoryCard } from "./HIstoryCard.jsx";
import { Error } from "../Error.jsx";
import { Database, Search, HardDrive } from "lucide-react";

export function History() {
  const [error, setError] = useState("");
  const [userHistory, setUserHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isNextPage = useRef(false);
  const isLoggedIn = useSelector((state) => state?.auth?.loginStatus);
  const userData = useSelector((state) => state?.auth?.userData);
  const userName = userData?.userName;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchHistory = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (isLoggedIn) {
          const historyResponse = await axiosInstance.get(
            "/api/v1/users/user-history",
            {
              params: { userName: userName, page: currentPage },
              signal: controller.signal,
            }
          );
          if (historyResponse?.status === 200) {
            const newHistory = historyResponse?.data?.docs?.[0]?.history || [];
            setUserHistory((prev) => [...prev, ...newHistory]);
            isNextPage.current = historyResponse?.data?.hasNextPage;
          } else {
            setError(historyResponse?.message);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    return () => controller.abort();
  }, [currentPage, isLoggedIn, userName]);

  useEffect(() => {
    const handleScroll = () => {
      if (isNextPage.current) {
        if (
          window.innerHeight + window.scrollY >=
          document.body?.offsetHeight - 50
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDelete = useCallback((id) => {
    setUserHistory((prev) => prev.filter((chat) => chat._id !== id));
  });

  return (
    <Container className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {error && <Error error={error} />}

      {/* Header Section */}
      <div className="text-center mb-16 relative z-10">
        {/* Tech Header Bar */}
        <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-1 border-y border-cyan-900/30 bg-cyan-950/10">
          <Database size={12} className="text-cyan-500" />
          <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.3em]">
            Archive_Protocol_V.3
          </span>
        </div>

        <div className="relative inline-block mb-4 group">
          <div className="absolute inset-0 bg-cyan-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-mono tracking-tighter uppercase glitch-text">
            Analysis{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              History
            </span>
          </h1>
        </div>

        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase max-w-2xl mx-auto border-t border-slate-800/50 pt-4 mt-2">
          Retrieving stored visual data packets...
        </p>
      </div>

      {/* History Cards Grid */}
      {userHistory && userHistory.length > 0 ? (
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {userHistory.map((chat) => (
              // Assuming HistoryCard accepts className for styling injections if needed,
              // otherwise the wrapper styling here sets the grid.
              // Note: You might want to style HistoryCard internally to match this theme.
              <HistoryCard
                key={chat._id}
                imageURL={chat.image}
                id={chat._id}
                caption={chat.caption}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Loading indicator for infinite scroll */}
          {(isLoading || (isNextPage && isNextPage.current)) && (
            <div className="mt-16 flex justify-center">
              <div className="relative p-1">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-50"></div>
                <div className="relative backdrop-blur-md bg-[#0a111e] border border-cyan-900/50 px-8 py-4 rounded-sm shadow-2xl flex items-center gap-4">
                  {/* Tech Spinner */}
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 border-2 border-cyan-900 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"></div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                      Buffering_Data
                    </span>
                    <span className="text-slate-600 text-[10px] font-mono">
                      Fetching additional records...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-2xl mx-auto text-center relative z-10 mt-12">
          <div className="relative group">
            {/* Holographic Border */}
            <div className="absolute -inset-px bg-linear-to-b from-slate-700/20 via-transparent to-slate-700/20 opacity-50 pointer-events-none"></div>

            {/* Empty State Glassy Card */}
            <div className="relative backdrop-blur-xl bg-[#080f1e]/90 border border-dashed border-slate-800 p-12 shadow-2xl">
              <div className="mb-8 flex justify-center">
                <div className="p-6 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/30 transition-colors duration-500">
                  <div className="relative">
                    <HardDrive
                      size={48}
                      className="text-slate-600 group-hover:text-cyan-500/50 transition-colors duration-500"
                      strokeWidth={1}
                    />
                    <div className="absolute -bottom-1 -right-1 text-slate-500">
                      <Search size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-300 font-mono uppercase tracking-tight mb-2">
                No_Logs_Found
              </h2>
              <p className="text-slate-500 font-mono text-xs tracking-wide mb-10 border-b border-slate-800/50 pb-6 mx-auto max-w-sm">
                /var/logs/history is empty. Initiate new analysis sequence.
              </p>

              <button
                onClick={() => navigate("/")}
                className="group relative px-8 py-3 bg-transparent overflow-hidden inline-flex items-center"
              >
                {/* Button Tech Background */}
                <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-950/20 skew-x-[-15deg] group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all"></div>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <span className="relative z-10 flex items-center justify-center gap-3 font-mono text-xs font-bold text-cyan-400 group-hover:text-white uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-pulse"></div>
                  Initialize_Scan
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
