import { useCallback, useState } from "react";
import { Container } from "../container/Container.jsx";
import { Input } from "../Input.jsx";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios.js";
import { useDispatch } from "react-redux";
import { login } from "../../features/authentication/authSlice.js";
import { useNavigate } from "react-router";
import { Button } from "../Button.jsx";
import { Error } from "../Error.jsx";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Terminal, Lock, ChevronRight } from 'lucide-react';

export function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axiosInstance.post("/api/v1/users/login", data);
        if (response.status == 200) {
          setError(response.message);
          dispatch(login({ userData: response.data.user }));
          navigate("/");
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate]
  );
  return (
       <Container className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none opacity-40"></div>

      <div className="w-full max-w-md relative z-10">
        
        {error && <Error error={error} />}

        {/* --- Form Container (Robotic Interface) --- */}
        <div className="relative group">
          {/* Holographic Border Effect */}
          <div className="absolute -inset-px bg-linear-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-xl opacity-50 blur-sm pointer-events-none"></div>

          <div className="relative bg-[#080f1e]/90 border border-cyan-900/50 backdrop-blur-xl p-1 shadow-2xl">
            
            {/* Interface Header Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#050b14] border-b border-cyan-900/30 mb-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-cyan-500" />
                    <span className="text-[10px] font-mono text-cyan-500 tracking-[0.2em] uppercase">Auth_Protocol_V.4</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-10 space-y-8"
            >
              {/* Header */}
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center p-4 rounded-full border border-cyan-500/10 bg-cyan-950/10 mb-5 relative group-hover:border-cyan-500/30 transition-colors">
                   <div className="absolute inset-0 bg-cyan-400/5 blur-xl rounded-full"></div>
                   <Terminal size={28} className="text-cyan-400 relative z-10" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-mono tracking-tight uppercase">
                  Welcome <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Back</span>
                </h1>
                <p className="text-slate-500 text-xs font-mono tracking-widest uppercase border-y border-slate-800/50 py-2 mx-auto max-w-[200px]">
                  Identity Verification
                </p>
              </div>

              {/* Input fields */}
              <div className="space-y-6">
                <div className="space-y-1">
                    <Input
                    label="User_ID"
                    type="email"
                    placeholder="ENTER EMAIL ADDRESS..."
                    className="futuristic-input"
                    disabled={isLoading}
                    {...register("email", {
                        required: true,
                        validate: {
                        matchPattern: (value) =>
                            /^(?=.{1,254}$)(?=.{1,64}@)(?![.])(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?<![.])@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/.test(
                            value
                            ) || setError("Invalid email address"),
                        },
                    })}
                    />
                    {/* Error display strictly for layout purposes if needed, logic handled by hook form */}
                </div>

                <div className="space-y-1">
                    <Input
                    label="Access_Key"
                    type="password"
                    placeholder="ENTER PASSWORD..."
                    className="futuristic-input"
                    disabled={isLoading}
                    {...register("password", {
                        required: true,
                        validate: {
                        matchPattern: (value) =>
                            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ||
                            setError(
                            "Password must contain at least 8 characters, including at least one letter and one number"
                            ),
                        },
                    })}
                    />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end -mt-2">
                <Link
                  to="/forget-password"
                  className="text-[10px] font-mono text-cyan-500/60 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1 group/link"
                >
                  <Lock size={10} />
                  <span className="group-hover/link:underline decoration-cyan-500/30 underline-offset-4">RESET_CREDENTIALS</span>
                  <ChevronRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-4 text-sm font-bold font-mono uppercase tracking-widest transition-all duration-300 group overflow-hidden bg-transparent
                ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {/* Button Tech Background */}
                <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-950/20 skew-x-[-10deg] group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all"></div>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Shimmer Animation */}
                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>

                <span className="relative z-10 flex items-center justify-center gap-3 text-cyan-300 group-hover:text-white">
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  )}
                  {isLoading ? "AUTHENTICATING..." : (
                    <>
                      <Zap size={16} className="group-hover:text-yellow-300 transition-colors" />
                      INITIATE_SESSION
                    </>
                  )}
                </span>
              </Button>

              {/* Sign up link */}
              <div className="text-center pt-6 border-t border-slate-800/50 mt-4">
                 <p className="text-[10px] text-slate-500 font-mono">
                  NO_UPLINK_FOUND?{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-500 hover:text-white transition-colors duration-300 ml-2 border-b border-cyan-900/50 hover:border-cyan-400 pb-0.5"
                  >
                    ESTABLISH_NEW_ID
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

    </Container>
  );
}
