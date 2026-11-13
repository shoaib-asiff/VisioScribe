import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { Button } from "../Button.jsx";
import { logout } from "../../features/authentication/authSlice.js";
import { axiosInstance } from "../../axios/axios.js";
import { Error } from "../Error.jsx";
import { Menu, X, LogOut, ChevronRight, LayoutGrid } from "lucide-react";

export function Header() {
  const isLogin = useSelector((state) => state.auth.loginStatus);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [errror, setError] = useState("");

  const handleLogout = async () => {
    const response = await axiosInstance.get("/api/v1/users/logout");
    if (response?.status != 200) {
      setError(response.message);
    } else {
      dispatch(logout());
    }
    setIsMobileMenuOpen(false);
  };

  const navElements = useMemo(
    () => [
      {
        name: "Home",
        path: "/",
        isVisible: isLogin,
      },
      {
        name: "History",
        path: "/history",
        isVisible: isLogin,
      },
      {
        name: "Login",
        path: "/login",
        isVisible: !isLogin,
      },
      {
        name: "Register",
        path: "/signup",
        isVisible: !isLogin,
      },
    ],
    [isLogin]
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-24 pointer-events-none font-sans">
        {errror && <Error error={errror} />}

        {/* Decorative Top Circuit Line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent">
          <div className="absolute left-1/4 top-0 w-16 h-0.5 bg-cyan-400/50"></div>
          <div className="absolute right-1/4 top-0 w-16 h-0.5 bg-cyan-400/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full pt-4">
            {/* --- MODULE 1: LEFT (Logo Data Block) --- */}
            <div className="pointer-events-auto">
              <Link
                to="/"
                className="group relative flex items-center gap-4 p-1 pl-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  {/* Rotating Hexagon Background */}
                  <div
                    className="absolute inset-0 bg-slate-900 border border-cyan-500/30 clip-path-hexagon hover:border-cyan-400 transition-colors duration-300 transform rotate-90 group-hover:rotate-0"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  ></div>

                  {/* Icon */}
                  <LayoutGrid className="relative z-10 text-cyan-400 w-6 h-6 group-hover:text-white transition-colors" />

                  {/* Ping Effect */}
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                </div>

                {/* Text Block */}
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-bold text-white tracking-wider leading-none group-hover:text-cyan-400 transition-colors">
                    VISIOSCRIBE
                  </span>
                  <span className="text-[10px] text-cyan-500/60 font-mono tracking-[0.2em] group-hover:text-cyan-400/80">
                    V.2.0.4 SYSTEM
                  </span>
                </div>
              </Link>
            </div>

            {/* --- MODULE 2: CENTER (Floating Nav Island) --- */}
            {/* Alignment Shift: Moved Nav to Center-Floating Pill */}
            <div className="hidden md:block pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-4">
              <nav className="flex items-center gap-1 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Glass Shimmer on Nav Container */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full animate-shimmer pointer-events-none"></div>

                {navElements.map(
                  (element) =>
                    element.isVisible && (
                      <NavLink
                        key={element.name}
                        to={element.path}
                        className={({ isActive }) =>
                          `relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300
                          ${
                            isActive
                              ? "text-slate-950 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] font-bold"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {element.name}
                      </NavLink>
                    )
                )}
              </nav>
            </div>

            {/* --- MODULE 3: RIGHT (User / Mobile Toggle) --- */}
            <div className="pointer-events-auto flex items-center gap-3">
              {isLogin && (
                <div className="hidden md:flex items-center">
                  <Button
                    onClick={handleLogout}
                    className="group relative px-4 py-2 bg-slate-900/50 hover:bg-red-950/30 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <span className="text-xs font-mono text-slate-400 group-hover:text-red-400 transition-colors">
                      TERMINATE_SESSION
                    </span>
                    <LogOut
                      size={14}
                      className="text-slate-500 group-hover:text-red-500 transition-colors"
                    />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button - Styled as a Tech Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden pointer-events-auto relative p-2 group"
                aria-label="Toggle menu"
              >
                <div className="absolute inset-0 bg-slate-900 border border-cyan-900 group-hover:border-cyan-500 transition-colors duration-300 transform skew-x-[-10deg]"></div>
                <div className="relative z-10 text-cyan-400 group-hover:text-white transition-colors">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE OVERLAY (Full Screen Tech Grid) --- */}
      {/* Kept logic, updated style to match new aesthetic */}
      <div
        className={`fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-xl transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center h-full space-y-4 px-8 pt-32 pb-8 overflow-y-auto">
          <div className="w-full max-w-xs space-y-4">
            {navElements.map(
              (element) =>
                element.isVisible && (
                  <NavLink
                    key={element.name}
                    to={element.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center justify-between w-full p-3 border-l-2 transition-all duration-300
                        ${
                          isActive
                            ? "border-cyan-400 bg-linear-to-r from-cyan-950/50 to-transparent text-cyan-300"
                            : "border-slate-800 text-slate-500 hover:text-slate-200 hover:border-cyan-500/50"
                        }`
                    }
                  >
                    <span className="text-xl font-light tracking-widest uppercase">
                      {element.name}
                    </span>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-500" />
                  </NavLink>
                )
            )}
          </div>

          {isLogin && (
            <Button
              onClick={handleLogout}
              className="mt-8 flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors px-6 py-3 border border-red-900/30 rounded hover:bg-red-950/20"
            >
              <LogOut size={20} />
              <span className="tracking-widest text-sm">DISCONNECT</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
