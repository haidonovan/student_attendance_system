"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Bell, Check, CheckCircle, AlertCircle, Info, MessageSquare, Trash2, Clock, X } from 'lucide-react'

export function NotificationPopup({ isOpen, onClose, notifications = [] }) {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/admin/notification");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLocalNotifications(data.notifications || []);
    } catch (err) {
      console.error("[v0] Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get icon and color based on notification type
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
      case "message":
        return <MessageSquare className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "message":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
  }

  const handleMarkAsRead = (notificationId) => {
    setLocalNotifications(
      localNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const handleMarkAsChecked = async (notificationId) => {
    try {
      const res = await fetch("/api/dashboard/admin/notification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, check: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      
      setLocalNotifications(
        localNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, check: true } : notif
        )
      );
    } catch (err) {
      console.error("[v0] Error marking as checked:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const res = await fetch("/api/dashboard/admin/notification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setLocalNotifications(
        localNotifications.filter((notif) => notif.id !== notificationId)
      );
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null);
      }
    } catch (err) {
      console.error("[v0] Error deleting notification:", err);
    }
  };

  const unreadCount = localNotifications.filter((n) => !n.read).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <DialogHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg md:text-xl text-slate-900 dark:text-white break-words flex items-center gap-2">
                <Bell className="w-5 h-5 flex-shrink-0" />
                Notifications
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3 animate-spin" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
              </div>
            </div>
          ) : localNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full py-8 px-4">
              <div className="text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No notifications yet</p>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
              {localNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  onClick={() => setSelectedNotification(notification)}
                  className={`border-slate-200 dark:border-slate-700 cursor-pointer transition-all hover:shadow-md ${
                    selectedNotification?.id === notification.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  } ${
                    !notification.read
                      ? "bg-blue-50 dark:bg-blue-900/10"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white break-words">
                              {notification.type
                                ? notification.type.charAt(0).toUpperCase() +
                                  notification.type.slice(1)
                                : "Notification"}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-words leading-relaxed mb-2">
                          {notification.message}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div className="flex items-center gap-1">
                            {notification.check && (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs py-0.5">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Checked
                              </Badge>
                            )}
                            {!notification.read && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs py-0.5">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {!notification.check && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsChecked(notification.id)
                            }}
                            className="h-8 w-8 p-0 border-slate-300 dark:border-slate-600"
                            title="Mark as checked"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                          className="h-8 w-8 p-0 border-slate-300 dark:border-slate-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 gap-2">
          {localNotifications.filter((n) => !n.read).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalNotifications(
                  localNotifications.map((n) => ({ ...n, read: true }))
                )
              }}
              className="border-slate-300 dark:border-slate-600 text-xs sm:text-sm"
            >
              Mark All as Read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 dark:border-slate-600 bg-transparent text-xs sm:text-sm ml-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
