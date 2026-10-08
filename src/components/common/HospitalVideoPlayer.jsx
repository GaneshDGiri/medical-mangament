import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  CheckCircle2,
  Video,
  Activity,
  Layers,
  Heart,
  Gauge,
  Sliders,
  RotateCcw,
  ShieldCheck
} from "lucide-react";

export default function HospitalVideoPlayer({ autoPlay = false, className = "" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showTelemetryHud, setShowTelemetryHud] = useState(true);
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [heartRate, setHeartRate] = useState(72);

  const channels = [
    {
      id: "robotic-or",
      title: "Robotic Surgical Suites",
      category: "Operating Theater 4",
      desc: "MAKO robotic arm precision joint replacement & minimally invasive neurosurgery.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      backupUrl: "https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patients-x-ray-41315-large.mp4",
      badge: "Surgical Robot · Active",
      vitals: { hr: 72, bp: "118/76", o2: "99%", temp: "36.8°C", gas: "Sevoflurane 1.8%" }
    },
    {
      id: "mri-suite",
      title: "Siemens 3T MAGNETOM MRI",
      category: "Radiology Suite 101",
      desc: "Sub-millimeter volumetric neurovascular diagnostics with zero ionizing radiation.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      backupUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      badge: "RF Gradient · 3.0 Tesla",
      vitals: { hr: 68, bp: "122/80", o2: "98%", temp: "36.7°C", gas: "Cryo-Helium 99.8%" }
    },
    {
      id: "icu-telemetry",
      title: "Intensive Care Unit (ICU)",
      category: "Critical Care Pod 3",
      desc: "Continuous multi-parameter hemodynamic monitoring and smart ventilator telemetry.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      backupUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      badge: "ICU Resuscitation · 24/7",
      vitals: { hr: 78, bp: "125/82", o2: "99%", temp: "37.1°C", gas: "FiO2 35%" }
    },
    {
      id: "telehealth-hub",
      title: "Telehealth Consultation Center",
      category: "Virtual Clinic Wing",
      desc: "Encrypted virtual consultations connecting rural clinics directly to faculty specialists.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      backupUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      badge: "Encrypted HD · 60 FPS",
      vitals: { hr: 70, bp: "120/80", o2: "99%", temp: "36.6°C", gas: "Ambient 21.0°C" }
    }
  ];

  const currentChannel = channels[activeChannelIdx];

  // Animated ECG heart rate canvas simulation
  useEffect(() => {
    let animId;
    let x = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const drawEcg = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(10, 15, 29, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#14b8a6"; // Teal wave
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerY = canvas.height / 2;
      const step = 2;

      // Draw standard P-Q-R-S-T wave pattern cycle
      for (let i = 0; i < canvas.width; i += step) {
        const cyclePos = (i + x) % 120;
        let y = centerY;
        if (cyclePos > 30 && cyclePos < 40) {
          y = centerY - 6; // P wave
        } else if (cyclePos >= 45 && cyclePos < 48) {
          y = centerY + 5; // Q
        } else if (cyclePos >= 48 && cyclePos < 54) {
          y = centerY - 28; // R peak
        } else if (cyclePos >= 54 && cyclePos < 58) {
          y = centerY + 10; // S
        } else if (cyclePos >= 70 && cyclePos < 88) {
          y = centerY - 8; // T wave
        }
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      x = (x + 2) % 120;
      animId = requestAnimationFrame(drawEcg);
    };

    drawEcg();
    return () => cancelAnimationFrame(animId);
  }, [activeChannelIdx]);

  // Subtle HR fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate((prev) => 70 + Math.floor(Math.random() * 6));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setVideoError(false);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedToggle = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleFullscreen = () => {
    const container = document.getElementById("hospital-video-container");
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  const handleChannelSelect = (idx) => {
    setActiveChannelIdx(idx);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      id="hospital-video-container"
      className={`rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col text-slate-100 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">MediCare AI Smart Hospital Virtual Tour</span>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono text-[10px] border border-teal-500/30">
                4K HDR · LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Channel: {currentChannel.title} ({currentChannel.category})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTelemetryHud(!showTelemetryHud)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showTelemetryHud
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            title="Toggle Clinical Telemetry HUD"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telemetry HUD</span>
          </button>

          <button
            onClick={handleSpeedToggle}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group select-none">
        {/* HTML5 Video Element */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={currentChannel.videoUrl}
            loop
            muted={isMuted}
            playsInline
            autoPlay={autoPlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                setDuration(videoRef.current.duration || 60);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              // Try backup or graceful simulation
              if (videoRef.current && videoRef.current.src !== currentChannel.backupUrl) {
                videoRef.current.src = currentChannel.backupUrl;
              } else {
                setVideoError(true);
              }
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          /* High-Tech Animated Clinical Medical Graphic Simulation Fallback */
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-3 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center border border-teal-500/40 animate-pulse">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">{currentChannel.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{currentChannel.desc}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>Simulated High-Definition Clinical Visualization Feed Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none" />

        {/* Clinical Telemetry HUD Overlay (Togglable) */}
        {showTelemetryHud && (
          <div className="absolute inset-0 p-4 sm:p-6 pointer-events-none flex flex-col justify-between">
            {/* Top HUD info */}
            <div className="flex items-start justify-between gap-4">
              <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-lg space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="font-bold text-white">{currentChannel.badge}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
                  <span>LAT: 41.8781° N</span>
                  <span>CAM: OR-04-STERILE</span>
                  <span className="text-teal-400">FPS: 60.0</span>
                </div>
              </div>

              {/* Real-Time Live Vitals Mini-Monitor */}
              <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-teal-500/40 shadow-xl space-y-1.5 min-w-[200px]">
                <div className="flex items-center justify-between text-[11px] text-teal-400 font-semibold font-mono">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-teal-400 text-teal-400 animate-bounce" />
                    <span>PATIENT ECG</span>
                  </span>
                  <span className="text-white font-bold">{heartRate} BPM</span>
                </div>

                {/* Animated ECG wave */}
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={32}
                  className="rounded-lg bg-slate-900 border border-slate-800 w-full h-8"
                />

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 pt-0.5">
                  <div>
                    <span className="text-slate-500">BP:</span> {currentChannel.vitals.bp}
                  </div>
                  <div>
                    <span className="text-slate-500">SpO2:</span> {currentChannel.vitals.o2}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Center Target Reticle for Robotic & MRI modes */}
            <div className="self-center flex flex-col items-center justify-center opacity-40">
              <div className="w-24 h-24 border border-teal-400/60 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              </div>
              <span className="font-mono text-[9px] text-teal-400 mt-1 uppercase tracking-widest">
                Target Lock · Calibrated
              </span>
            </div>

            {/* Bottom HUD bar */}
            <div className="flex items-end justify-between text-[11px] font-mono text-slate-400">
              <div>
                <span>ROOM TEMP: {currentChannel.vitals.temp}</span>
                <span className="mx-2">·</span>
                <span>GAS: {currentChannel.vitals.gas}</span>
              </div>
              <div className="text-teal-300 font-bold">
                JCI PROTOCOL 10.4 VALIDATED
              </div>
            </div>
          </div>
        )}

        {/* Big Center Play / Pause Button Overlay */}
        <button
          onClick={togglePlay}
          className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-600/90 hover:bg-teal-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 z-20 ${
            isPlaying ? "opacity-0 group-hover:opacity-90" : "opacity-100"
          }`}
          title={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        {/* Video Scrubber & Bottom Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          {/* Timeline progress line */}
          <div
            className="w-full bg-slate-800 hover:bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (!videoRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              videoRef.current.currentTime = pos * (videoRef.current.duration || 60);
            }}
          >
            <div
              className="bg-teal-500 h-full rounded-full transition-all"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-teal-400 text-white transition-colors p-1"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-teal-400 text-white transition-colors p-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-slate-400 font-mono text-[11px]">
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, "0")} / 01:00
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                {currentChannel.title}
              </span>
              <button
                onClick={handleFullscreen}
                className="hover:text-teal-400 text-slate-400 hover:text-white p-1 transition-colors"
                title="Fullscreen Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Channel Interactive Switcher */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Hospital Tour Channels (Select Feed)</span>
          <span className="text-teal-400 font-mono">4 Streams Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {channels.map((ch, idx) => {
            const isActive = activeChannelIdx === idx;
            return (
              <button
                key={ch.id}
                onClick={() => handleChannelSelect(idx)}
                className={`p-3 rounded-2xl text-left transition-all space-y-1 relative group ${
                  isActive
                    ? "bg-teal-500/15 border-2 border-teal-500 text-teal-200 shadow-md ring-1 ring-teal-500/20"
                    : "bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-teal-400">CAM 0{idx + 1}</span>
                  <span className="text-slate-500">{ch.category}</span>
                </div>
                <p className="font-bold text-xs truncate text-white">{ch.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                  {ch.desc}
                </p>
                {isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

