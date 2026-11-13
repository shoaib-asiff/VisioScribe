import { useCallback, useRef, useState } from "react";
import { Button } from "../Button.jsx";
import { Container } from "../container/Container.jsx";
import { useDropzone } from "react-dropzone";
import Webcam from "react-webcam";
import { axiosInstance } from "../../axios/axios.js";
import { useNavigate } from "react-router";
import { Loading } from "../Loading.jsx";
import { useSelector } from "react-redux";
import { Error } from "../Error.jsx";
import {
  Zap,
  X,
  Camera,
  Upload,
  Clock,
  Lock,
  Scan,
  Aperture,
  Cpu,
  Activity,
  Maximize,
} from "lucide-react";

export function Home() {
  const [preview, setPreview] = useState(null);
  const webCamRef = useRef(null);
  const [isCapturing, SetIsCapturing] = useState(false);
  const [image, setImage] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginStatus = useSelector((state) => state?.auth?.loginStatus);

  const onDrop = useCallback((file) => {
    const image = file[0];
    setImage(image);
    setPreview(URL.createObjectURL(image));
    setIsCaptured(false);
  }, []);

  const submitImage = async () => {
    setIsLoading(true);
    let imageBlob = image;
    if (isCaptured) {
      imageBlob = dataURLtoBlob(image);
      setIsCaptured(false);
    }
    const formData = new FormData();
    formData.append("image", imageBlob, "photo.jpeg");

    try {
      const response = await axiosInstance.post(
        loginStatus ? "/api/v1/chat/add-chat" : "/api/v1/chat/add-chat-guest",
        formData
      );
      if (response.status == 200) {
        setError(response.message);
        navigate(`/chat/${response?.data?._id}`);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const dataURLtoBlob = useCallback((dataURL) => {
    const [header, data] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }, []);

  const Capture = useCallback(() => {
    const imageCaptured = webCamRef?.current?.getScreenshot();
    setIsCaptured(true);
    setPreview(imageCaptured);
    setImage(imageCaptured);
  }, []);

  const { getRootProps, getInputProps, isDropActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });
  return (
    <Container className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#050b14] font-sans">
      {/* --- Global Robotic Overlay Elements --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050b14_90%)]" />

        {/* Circuit Lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 100 H 100 L 150 150 H 300"
            stroke="#06b6d4"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M100% 100 H calc(100% - 100px) L calc(100% - 150px) 150 H calc(100% - 300px)"
            stroke="#06b6d4"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Corner Brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-none"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-none"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-none"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-none"></div>

        {/* System Text */}
        <div className="absolute top-8 left-16 text-[10px] font-mono text-cyan-500/40 tracking-[0.2em]">
          SYS.ROOT.User_Interface_V.4.2
        </div>
        <div className="absolute top-8 right-16 text-[10px] font-mono text-cyan-500/40 tracking-[0.2em]">
          STATUS: ONLINE
        </div>
      </div>

      {error && <Error error={error} />}

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* --- Hero Section --- */}
          <div className="text-center mb-16 relative z-10">
            <div className="relative inline-block mb-6 group">
              <div className="absolute -inset-4 bg-cyan-500/5 blur-xl skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu size={16} className="text-cyan-500 animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
                  Neural Net Interface
                </span>
                <Cpu size={16} className="text-cyan-500 animate-pulse" />
              </div>

              <h1
                className="relative text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase glitch-text"
                data-text="AI Image Analysis"
              >
                <span className="bg-clip-text text-transparent bg-linear-to-b from-white to-slate-500">
                  AI Image
                </span>
                <br />
                <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  Analysis
                </span>
              </h1>

              {/* Decorative Lines under title */}
              <div className="mt-4 flex items-center justify-center gap-1 opacity-50">
                <div className="h-px w-12 bg-cyan-500"></div>
                <div className="h-px w-2 bg-cyan-500"></div>
                <div className="h-px w-2 bg-cyan-500"></div>
                <div className="h-px w-12 bg-cyan-500"></div>
              </div>
            </div>

            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-light tracking-wide">
              <span className="inline-block px-2 py-1 bg-cyan-950/30 border border-cyan-900/50 rounded text-xs font-mono text-cyan-300 mr-3 align-middle">
                MODE: SCAN
              </span>
              Process visual data streams with high-precision AI algorithms.
            </p>
          </div>

          {/* --- Main Interactive Area --- */}
          <div className="max-w-5xl mx-auto mb-20 relative z-10">
            {preview ? (
              // --- VIEW: Image Preview (Analysis Mode) ---
              <div className="relative group perspective-1000">
                <div className="absolute inset-0 bg-cyan-500/5 blur-3xl -z-10 rounded-none transform scale-95 opacity-50"></div>

                <div className="relative bg-[#0a111e] border border-cyan-900/50 p-1">
                  {/* Decorative Header Bar */}
                  <div className="h-8 bg-cyan-950/30 border-b border-cyan-900/50 flex items-center justify-between px-4 mb-1">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-cyan-400" />
                      <span className="text-[10px] font-mono text-cyan-400">
                        ANALYSIS_BUFFER_01
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-cyan-500"></div>
                      <div className="w-1 h-1 bg-cyan-500/50"></div>
                      <div className="w-1 h-1 bg-cyan-500/20"></div>
                    </div>
                  </div>

                  <div className="relative p-6 sm:p-8 bg-[#0d1526]">
                    {/* Image Container */}
                    <div className="mb-8 relative border-2 border-cyan-900/50 group-hover:border-cyan-500/50 transition-colors duration-500">
                      {/* Scanning Animation */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-30 animate-[scan_2s_linear_infinite]"></div>
                      <div className="absolute inset-0 bg-cyan-500/10 z-20 mix-blend-overlay pointer-events-none"></div>

                      {/* Grid Overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-size-[20px_20px] z-20 pointer-events-none opacity-50"></div>

                      <img
                        src={preview}
                        alt="Target Data"
                        className="w-full h-auto relative z-10 grayscale-20 contrast-125 block"
                      />

                      {/* Tech Markers */}
                      <div className="absolute top-0 left-0 p-2 z-30">
                        <span className="bg-black/70 text-cyan-400 text-[10px] font-mono px-1 border border-cyan-500/30">
                          IMG_SRC_OK
                        </span>
                      </div>
                      <Maximize
                        size={24}
                        className="absolute bottom-2 right-2 text-cyan-400/50 z-30"
                        strokeWidth={1}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button
                        onClick={() => {
                          setPreview(null);
                          setIsCaptured(false);
                          setImage(null);
                        }}
                        className="group relative px-8 py-3 bg-transparent overflow-hidden"
                      >
                        <div className="absolute inset-0 border border-slate-700 skew-x-[-15deg] group-hover:border-red-500 transition-colors"></div>
                        <div className="absolute inset-0 bg-slate-800/50 skew-x-[-15deg] group-hover:bg-red-900/20 transition-colors -z-10"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3 font-mono text-sm text-slate-400 group-hover:text-red-400 uppercase tracking-wider">
                          <X size={16} />
                          Terminate
                        </span>
                      </Button>

                      <Button
                        type="submit"
                        onClick={submitImage}
                        className="group relative px-10 py-3 bg-transparent overflow-hidden"
                      >
                        <div className="absolute inset-0 border border-cyan-500 skew-x-[-15deg] shadow-[0_0_10px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all"></div>
                        <div className="absolute inset-0 bg-cyan-500/10 skew-x-[-15deg] group-hover:bg-cyan-500/20 transition-colors -z-10"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3 font-mono text-sm font-bold text-cyan-300 group-hover:text-cyan-100 uppercase tracking-wider">
                          <Scan size={18} className="animate-pulse" />
                          Initiate Scan
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : isCapturing ? (
              // --- VIEW: Webcam Capture (Live Feed) ---
              <div className="relative">
                <div className="relative bg-[#050b14] border border-cyan-900 p-1 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  {/* Header */}
                  <div className="h-6 bg-cyan-950 flex justify-between px-2 items-center mb-1">
                    <span className="text-[10px] font-mono text-cyan-500">
                      LIVE_FEED // CAM_01
                    </span>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  </div>

                  <div className="relative p-4 bg-[#080f1e]">
                    <div className="mb-6 flex justify-center">
                      <div className="relative border border-slate-700 bg-black w-full max-w-md aspect-video overflow-hidden">
                        {/* Scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-size-[100%_2px,3px_100%] pointer-events-none"></div>

                        <Webcam
                          audio={false}
                          ref={webCamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={{facingMode: "environment"}}
                          className="w-full h-full object-cover relative z-10 opacity-80"
                        />

                        {/* HUD Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-30 p-4">
                          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/50"></div>
                          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-500/50"></div>
                          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-500/50"></div>
                          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/50"></div>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/30">
                            <Aperture size={48} strokeWidth={0.5} />
                          </div>

                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                            <span className="text-[10px] font-mono text-cyan-400 bg-black/50 px-2">
                              TARGET ACQUISITION
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => SetIsCapturing(false)}
                        className="group relative px-6 py-3 bg-transparent overflow-hidden"
                      >
                        <div className="absolute inset-0 border border-slate-600 skew-x-[-15deg] group-hover:border-slate-400 transition-colors"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs text-slate-400 group-hover:text-white uppercase">
                          <X size={14} />
                          Disengage
                        </span>
                      </Button>
                      <Button
                        onClick={Capture}
                        className="group relative px-8 py-3 bg-transparent overflow-hidden"
                      >
                        <div className="absolute inset-0 border border-red-500 skew-x-[-15deg] group-hover:bg-red-900/20 transition-all"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs font-bold text-red-400 group-hover:text-red-200 uppercase tracking-widest">
                          <Camera size={16} />
                          Capture Frame
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // --- VIEW: Data Port (Dropzone) ---
              <div className="relative group" {...getRootProps()}>
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-cyan-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div
                  className={`relative bg-[#080f1e] border-2 border-dashed rounded-none p-10 sm:p-14 transition-all duration-300 ease-out cursor-pointer overflow-hidden
                  ${
                    isDropActive
                      ? "border-cyan-400 bg-cyan-950/20"
                      : "border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426]"
                  }`}
                >
                  {/* Mechanical Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 bg-[#050b14] border-b border-r border-slate-700"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#050b14] border-b border-l border-slate-700"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#050b14] border-t border-r border-slate-700"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#050b14] border-t border-l border-slate-700"></div>

                  <input {...getInputProps()} className="hidden" />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* Central Icon Hexagon */}
                    <div className="mb-8 relative">
                      <div
                        className={`absolute inset-0 bg-cyan-500 blur-xl opacity-20 transition-opacity ${
                          isDropActive ? "opacity-50" : ""
                        }`}
                      ></div>
                      <div
                        className={`relative w-24 h-24 flex items-center justify-center border border-cyan-800 bg-[#050b14] clip-path-hexagon transition-all duration-500 ${
                          isDropActive ? "scale-110 border-cyan-400" : ""
                        }`}
                        style={{
                          clipPath:
                            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        }}
                      >
                        <Upload
                          className={`w-10 h-10 transition-colors duration-300 ${
                            isDropActive
                              ? "text-cyan-300 animate-bounce"
                              : "text-slate-600 group-hover:text-cyan-400"
                          }`}
                          strokeWidth={1}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-2xl font-bold mb-3 font-mono tracking-tighter uppercase
                      ${
                        isDropActive
                          ? "text-cyan-400"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {isDropActive
                        ? ">> UPLINK DETECTED <<"
                        : "Initialize Data Transfer"}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mb-8 border-t border-b border-slate-800 py-2 px-6">
                      <span>FMT: JPG/PNG</span>
                      <span>|</span>
                      <span>CAP: 10MB</span>
                      <span>|</span>
                      <span>ENC: AES-256</span>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        SetIsCapturing(true);
                      }}
                      className="group relative px-8 py-3 bg-transparent overflow-hidden"
                    >
                      <div className="absolute inset-0 border border-cyan-900/50 bg-cyan-950/20 skew-x-[-15deg] group-hover:border-cyan-400 group-hover:bg-cyan-900/40 transition-all"></div>
                      <span className="relative z-10 flex items-center justify-center gap-3 font-mono text-xs font-bold text-cyan-500 group-hover:text-cyan-200 uppercase tracking-widest">
                        <Camera size={16} />
                        Activate Visual Sensor
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Features Section (Data Modules) --- */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Module 1 */}
              <div className="group relative bg-[#080f1e] border border-slate-800 p-6 hover:border-cyan-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-600 group-hover:bg-cyan-500"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                  </div>
                </div>
                <div className="mb-4 text-cyan-500 group-hover:text-cyan-300 transition-colors">
                  <Zap size={28} strokeWidth={1} />
                </div>
                <div className="text-xs font-mono text-slate-500 mb-1">
                  MODULE_01
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 font-mono uppercase">
                  Hyper-Speed
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-3 group-hover:border-cyan-500/50 transition-colors">
                  Zero-latency processing via neural edge computing.
                </p>
              </div>

              {/* Module 2 */}
              <div className="group relative bg-[#080f1e] border border-slate-800 p-6 hover:border-purple-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-600 group-hover:bg-purple-500"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                  </div>
                </div>
                <div className="mb-4 text-purple-500 group-hover:text-purple-300 transition-colors">
                  <Clock size={28} strokeWidth={1} />
                </div>
                <div className="text-xs font-mono text-slate-500 mb-1">
                  MODULE_02
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 font-mono uppercase">
                  Temporal Log
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-3 group-hover:border-purple-500/50 transition-colors">
                  Automated archival and retrieval of analysis sessions.
                </p>
              </div>

              {/* Module 3 */}
              <div className="group relative bg-[#080f1e] border border-slate-800 p-6 hover:border-emerald-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-600 group-hover:bg-emerald-500"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                    <div className="w-1 h-1 bg-slate-600"></div>
                  </div>
                </div>
                <div className="mb-4 text-emerald-500 group-hover:text-emerald-300 transition-colors">
                  <Lock size={28} strokeWidth={1} />
                </div>
                <div className="text-xs font-mono text-slate-500 mb-1">
                  MODULE_03
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 font-mono uppercase">
                  Vault Encrypt
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-3 group-hover:border-emerald-500/50 transition-colors">
                  Enterprise-grade isolation for sensitive visual data.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

    </Container>
  );
}
