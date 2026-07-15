"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isLoggedIn = !!user;

  // Derive user info
  const userEmail = user?.email || "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  // Notifications mock data
  const notifications = [
    { id: 1, text: "Case #892-A updated: In Investigation", time: "2 hours ago", unread: true },
    { id: 2, text: "New Community Update: Legal Advice session Friday", time: "1 day ago", unread: false },
    { id: 3, text: "Welcome to Women Safety System!", time: "2 days ago", unread: false },
  ];

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard", authRequired: true },
    { name: "File Complaint", href: "/complaint/new", authRequired: true },
    { name: "Tracker", href: "/complaint/tracker", authRequired: true },
    { name: "Resources", href: "/resources" },
    { name: "Community", href: "/community" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center px-6 max-w-7xl mx-auto h-20">
        {/* Brand */}
        <Link href="/" className="font-headline-md text-xl md:text-2xl font-bold text-primary tracking-tight">
          WOMEN SAFETY SYSTEM
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-6 font-body-md text-base">
          {navItems.map((item) => {
            if (item.authRequired && !isLoggedIn) return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-all duration-200 px-3 py-2 rounded-lg font-medium hover:bg-white/40 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary rounded-none pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications button & dropdown */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="text-primary hover:bg-white/30 rounded-lg p-2 transition-all relative"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined align-middle">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-2xl border border-white/40 shadow-xl rounded-2xl p-4 z-50 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2 mb-2">
                    <span className="font-label-bold text-sm text-on-surface">Notifications</span>
                    <button className="text-xs text-primary hover:underline">Mark all read</button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg text-xs transition-colors hover:bg-surface-container-low/40 ${
                          notif.unread ? "bg-primary-container/20 border-l-2 border-primary" : "bg-transparent"
                        }`}
                      >
                        <p className="text-on-surface font-medium">{notif.text}</p>
                        <p className="text-on-surface-variant/70 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile controls or login button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border-2 border-white/80 shadow-sm select-none">
                  {userInitials}
                </div>
                <span className="font-label-bold text-sm hidden md:block text-on-surface-variant hover:text-primary max-w-[120px] truncate">
                  {userName}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-white/40 shadow-xl rounded-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                    <p className="text-[10px] text-on-surface-variant">Logged in as</p>
                    <p className="text-xs font-bold text-primary truncate" title={userEmail}>
                      {userEmail}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low/50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">dashboard</span> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low/50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">person</span> My Profile
                  </Link>
                  <Link
                    href="/complaint/tracker"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low/50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">description</span> My Cases
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/20 rounded-lg transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-sm text-error">logout</span> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-bold text-sm hover:bg-primary/95 shadow-sm hover:shadow transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-block border border-primary text-primary px-4 py-2 rounded-full font-label-bold text-sm hover:bg-primary-container/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
