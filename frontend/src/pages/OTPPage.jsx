import { useForm } from "react-hook-form";
import { Container } from "../components";
import { Input } from "../components/Input.jsx";
import { useState } from "react";
import { axiosInstance } from "../axios/axios.js";
import { useNavigate } from "react-router";
import { Button } from "../components/Button.jsx";
import { Error } from "../components/Error.jsx";
import { useSelector } from "react-redux";
import { ShieldCheck, Lock, KeyRound, RefreshCw } from "lucide-react";

export function OTPPage() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = useSelector((state) => state?.forgetPassword?.email);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/api/v1/users/otp-verify", {
        email: email,
        otp: data?.otp,
      });
      if (response.status === 200) {
        setError("OTP Sent Successfully");
        navigate("/change-password");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResendCllick = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/v1/users/otp-get", {
        email,
      });
      if (response.status === 200) {
        dispatch(setEmail({ email }));
        setError("OTP Sent Successfully");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none opacity-40"></div>

      {error && <Error error={error} />}

      <div className="w-full max-w-md relative z-10">
        {/* --- Form Container (Robotic Interface) --- */}
        <div className="relative group perspective-1000">
          {/* Holographic Border Effect */}
          <div className="absolute -inset-px bg-linear-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-xl opacity-50 blur-sm pointer-events-none"></div>

          <div className="relative bg-[#0a111e]/95 border border-cyan-900/50 backdrop-blur-xl p-1 shadow-2xl">
            {/* Interface Header Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#050b14] border-b border-cyan-900/30 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-500" />
                <span className="text-[10px] font-mono text-cyan-500 tracking-[0.2em] uppercase">
                  2FA_Gateway_V.3
                </span>
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
                  <KeyRound
                    size={28}
                    className="text-cyan-400 relative z-10"
                    strokeWidth={1.5}
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-mono tracking-tight uppercase">
                  Verify{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
                    Identity
                  </span>
                </h1>
                <p className="text-slate-500 text-xs font-mono tracking-widest uppercase border-y border-slate-800/50 py-2 mx-auto max-w-[260px]">
                  Input 4-Digit Security Token
                </p>
              </div>

              {/* Input field - STYLED FOR OTP */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <Input
                    label="Security_Code"
                    type="number"
                    placeholder="0 0 0 0"
                    // Custom OTP styling applied here via className
                    className="futuristic-input font-mono text-3xl text-center tracking-[1em] px-4"
                    disabled={isLoading}
                    maxLength={4}
                    {...register("otp", {
                      required: true,
                    })}
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-4 text-sm font-bold font-mono uppercase tracking-widest transition-all duration-300 group overflow-hidden bg-transparent mt-6
                ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {/* Button Tech Background */}
                <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-950/20 skew-x-[-10deg] group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all"></div>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Shimmer Animation */}
                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>

                <span className="relative z-10 flex items-center justify-center gap-3 text-cyan-300 group-hover:text-white">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                      <span>VALIDATING...</span>
                    </>
                  ) : (
                    <>
                      <Lock
                        size={16}
                        className="group-hover:text-yellow-300 transition-colors"
                      />
                      VERIFY_TOKEN
                    </>
                  )}
                </span>
              </Button>

              {/* Resend Code Link */}
              <div className="text-center pt-6 border-t border-slate-800/50 mt-4">
                <p className="text-[10px] text-slate-500 font-mono">
                  TOKEN_NOT_RECEIVED?{" "}
                  <button
                    type="button"
                    className="text-cyan-500 hover:text-white transition-colors duration-300 ml-2 border-b border-cyan-900/50 hover:border-cyan-400 pb-0.5 inline-flex items-center gap-1 uppercase tracking-wider font-bold"
                    onClick={onResendCllick}
                  >
                    <RefreshCw size={10} />
                    RETRANSMIT
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
