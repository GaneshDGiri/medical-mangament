import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Sparkles,
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Trash2,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  HelpCircle
} from "lucide-react";

const SUGGESTED_QUERIES = [
  "Which cardiologists are available today?",
  "How can I prepare for an MRI scan?",
  "Where is the radiology department?",
  "Show me robotic orthopedic surgeons",
  "Where do I go for emergency care?",
  "What is the difference between MRI and CT scan?"
];

export default function AIChat({ onOpenEmergency }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am **MediCare AI**, your clinical and hospital assistant. How can I assist you with appointments, doctors, departments, preparation guidelines, or hospital navigation today?",
      suggestedActions: [
        { label: "Find Doctors", link: "/doctors" },
        { label: "3D Equipment Explorer", link: "/equipment" },
        { label: "Hospital Navigation", link: "/navigation" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText = input) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.post("/ai/chat", {
        prompt: textToSend,
        conversationHistory: historyPayload
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: res.data.reply,
            suggestedActions: res.data.suggestedActions || [],
            disclaimer: res.data.disclaimer
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "I'm currently unable to reach the external clinical knowledge server, but our hospital staff is available 24/7 at **+1 (800) 555-9911**.",
          suggestedActions: [{ label: "Browse Doctors Directory", link: "/doctors" }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Voice input simulation
      setTimeout(() => {
        setIsListening(false);
        setInput("Where is the radiology department for my MRI?");
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Chat cleared. Feel free to ask any question regarding hospital procedures, doctors, or facilities.",
        suggestedActions: [
          { label: "Book Appointment", link: "/appointments" },
          { label: "Hospital Map", link: "/navigation" }
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all transform hover:scale-105 group"
          title="Open MediCare AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-teal-200 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <span className="font-semibold text-sm tracking-tight pr-1">Ask MediCare AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden ${
            isExpanded
              ? "inset-4 md:inset-10"
              : "bottom-5 right-5 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-none">MediCare AI Assistant</h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-teal-800/60 rounded text-teal-100 font-mono">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-teal-100">Smart Hospital Navigator & Clinical Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-teal-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-teal-100"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-teal-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Safety Banner */}
          <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>AI informational guide. In severe emergencies, call 911 or head to the ER.</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                    msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {msg.content}
                  </div>

                  {/* Suggested Action Shortcuts */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, i) =>
                        act.action === "emergency_modal" ? (
                          <button
                            key={i}
                            onClick={onOpenEmergency}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 hover:bg-rose-200 transition-colors"
                          >
                            <span>🚨 {act.label}</span>
                          </button>
                        ) : (
                          <Link
                            key={i}
                            to={act.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-teal-700 dark:text-teal-300 hover:border-teal-500 transition-colors"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        )
                      )}
                    </div>
                  )}

                  {msg.disclaimer && (
                    <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 italic">
                      {msg.disclaimer}
                    </p>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-slate-400">Consulting hospital database...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 px-1">
              <HelpCircle className="w-3 h-3 text-teal-600" />
              <span>Suggested Questions</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {SUGGESTED_QUERIES.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 transition-colors shrink-0"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isListening ? "Listening... click to stop" : "Voice input simulation"}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask doctor availability, MRI prep, directions..."}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
