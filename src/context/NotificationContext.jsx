import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        const unread = (res.data.notifications || []).filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated, user?.id]);

  // Socket.IO Real-Time Connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) socket.disconnect();
      return;
    }

    // Connect to current server
    const s = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    s.on("connect", () => {
      setIsConnected(true);
      s.emit("join", { userId: user.id, role: user.role });
    });

    s.on("disconnect", () => {
      setIsConnected(false);
    });

    s.on("notification:new", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Play subtle sound or show customized real-time toast
      const typeIcons = {
        appointment: "📅",
        appointment_cancelled: "❌",
        prescription: "💊",
        lab_result: "🧪",
        emergency: "🚨",
        system: "📢"
      };

      const icon = typeIcons[newNotif.type] || "🔔";

      toast(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <span>{icon}</span>
              <span>{newNotif.title}</span>
            </span>
            <span className="text-[11px] text-slate-300">{newNotif.message}</span>
          </div>
        ),
        {
          duration: 5000,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #14b8a6",
            borderRadius: "14px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
        }
      );
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated, user?.id, user?.role]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const unreadList = notifications.filter((n) => !n.isRead);
    await Promise.all(unreadList.map((n) => api.put(`/notifications/${n.id}/read`).catch(() => {})));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const broadcastNotification = async (payload) => {
    try {
      const res = await api.post("/notifications/broadcast", payload);
      if (res.data.success) {
        toast.success("Real-time broadcast event emitted via Socket.IO");
        return true;
      }
    } catch (err) {
      toast.error("Failed to broadcast notification");
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        broadcastNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  return (
    context || {
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      markAsRead: () => {},
      markAllAsRead: () => {},
      broadcastNotification: async () => {},
      refreshNotifications: () => {},
    }
  );
}
