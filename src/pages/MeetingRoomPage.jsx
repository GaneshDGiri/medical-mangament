import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  MessageSquare,
  Users,
  Send,
  ShieldCheck,
  HeartPulse,
  FileText,
  Clock,
  Sparkles,
  Camera,
  RotateCcw
} from "lucide-react";
import toast from "react-hot-toast";

export default function MeetingRoomPage() {
  const { user } = useAuth();
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [useLocalWebcam, setUseLocalWebcam] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "vitals" | "notes"
  const [chatMessages, setChatMessages] = useState([
    { sender: "Dr. Sarah Jenkins", text: "Hello Sophia, can you hear and see me clearly?", time: "11:15 AM" },
    { sender: "Sophia Martinez", text: "Yes Dr. Jenkins, loud and clear!", time: "11:16 AM" },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [meetings, setMeetings] = useState([]);

  const doctorVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const res = await api.get("/meetings");
        if (res.data.success) {
          setMeetings(res.data.meetings || []);
        }
      } catch (err) {
        console.error("Failed to load meetings", err);
      }
    }
    loadMeetings();
  }, []);

  // WebCam handling for patient
  useEffect(() => {
    if (inCall && videoOn && useLocalWebcam) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn("Webcam access declined or not supported", err);
            setUseLocalWebcam(false);
            toast("Webcam unavailable, using simulated video feed");
          });
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [inCall, videoOn, useLocalWebcam]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: user?.name || "Participant",
        text: inputMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setInputMsg("");
  };

  const handleStartCall = () => {
    setInCall(true);
    toast.success("Connected to MediCare Encrypted Telehealth Stream");
  };

  const handleEndCall = () => {
    setInCall(false);
    toast("Consultation call ended");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Telemedicine Bar */}
      <div className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <BackButton fallback="/dashboard" label="Exit Call" className="!bg-slate-900 !text-slate-300 !border-slate-800 hover:!bg-slate-800" />
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">MediCare Telehealth Video Suite</h1>
            <p className="text-[11px] text-teal-400 font-mono">HIPAA & GDPR End-to-End Encrypted</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Stream: 1080p 60fps</span>
          </span>
        </div>
      </div>

      {/* Main Video Viewport or Lobby */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Frames */}
        <div className="flex-1 p-4 flex flex-col justify-between gap-4">
          {!inCall ? (
            /* Lobby Pre-Join screen */
            <div className="flex-1 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <Video className="w-10 h-10" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-bold">Virtual Consultation Room</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join secure high-definition telemedicine consultation with full clinical notes, digital stethoscope audio, and vital record sync.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleStartCall}
                  className="px-8 py-3.5 rounded-2xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30 transition-all"
                >
                  Join Scheduled Call Now
                </button>
              </div>

              {/* Scheduled Meetings List */}
              <div className="w-full max-w-lg pt-6 border-t border-slate-800 text-left text-xs space-y-2">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Scheduled Telehealth Sessions
                </p>
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">{m.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {m.hostDoctorName} · Code: <span className="font-mono text-teal-400">{m.meetingCode}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleStartCall}
                      className="px-3 py-1.5 rounded-lg bg-teal-600/20 text-teal-300 font-semibold hover:bg-teal-600/30 text-xs"
                    >
                      Enter Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active Call Frame */
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Doctor Video Feed */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
                <video
                  ref={doctorVideoRef}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to high resolution doctor photo if external video stream fails
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = "block";
                    }
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1594824813515-58f700445d3e?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor Video Feed"
                  className="w-full h-full object-cover hidden"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Dr. Sarah Jenkins (Orthopedics)</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-teal-400 font-mono flex items-center gap-2">
                  <span>LIVE CLINICAL FEED</span>
                  <span>·</span>
                  <span>HD 1080p 60FPS</span>
                </div>
              </div>

              {/* Patient Video Feed */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
                {videoOn ? (
                  useLocalWebcam ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                      alt="Patient Video"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <VideoOff className="w-10 h-10" />
                    <p className="text-xs">Camera is Off</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                  <span className="font-semibold text-white">{user?.name || "Sophia Martinez"} (Patient)</span>
                </div>

                {videoOn && (
                  <button
                    onClick={() => {
                      const next = !useLocalWebcam;
                      setUseLocalWebcam(next);
                      toast(next ? "Activating local webcam device" : "Switched to simulated HD feed");
                    }}
                    className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-teal-400" />
                    <span>{useLocalWebcam ? "Use Sample Video" : "Use Real Camera"}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          {inCall && (
            <div className="p-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-xl transition-colors ${
                  micOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
                }`}
                title={micOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-xl transition-colors ${
                  videoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
                }`}
                title={videoOn ? "Stop Video" : "Start Video"}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  setScreenShare(!screenShare);
                  toast(screenShare ? "Screen sharing ended" : "Presenting diagnostic imaging screen");
                }}
                className={`p-3 rounded-xl transition-colors ${
                  screenShare ? "bg-teal-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
                title="Share Screen"
              >
                <MonitorUp className="w-5 h-5" />
              </button>

              <button
                onClick={handleEndCall}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                title="End Consultation Call"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Chat & Clinical Info */}
        <div className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "chat" ? "text-teal-400 border-b-2 border-teal-500" : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>In-Call Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("vitals")}
              className={`flex-1 py-3 font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "vitals" ? "text-teal-400 border-b-2 border-teal-500" : "text-slate-400 hover:text-white"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Live Vitals</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {activeTab === "chat" ? (
              <div className="space-y-3">
                {chatMessages.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-teal-400">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-slate-200">{m.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="font-bold text-slate-300">Synchronized Clinical Vitals</p>
                  <div className="space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Blood Pressure</span>
                      <span className="font-mono text-white font-bold">116/74 mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resting Heart Rate</span>
                      <span className="font-mono text-white font-bold">68 bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SpO2 Oxygen Saturation</span>
                      <span className="font-mono text-emerald-400 font-bold">99%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Temperature</span>
                      <span className="font-mono text-white font-bold">98.4 °F</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-800 space-y-1 text-teal-200">
                  <p className="font-bold text-white">Chief Complaint</p>
                  <p className="text-[11px]">Post-running right patellofemoral knee soreness; reviewing response to physical rehabilitation exercises.</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          {activeTab === "chat" && (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type message to participants..."
                className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
