"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface Complaint {
  id: string;
  nature: string;
  date: string;
  time: string;
  location: string;
  description: string;
  witnessName?: string;
  witnessContact?: string;
  status: string;
  agency: string;
  evidenceUrl?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("User");
  const [liveTracking, setLiveTracking] = useState(true);
  const [cases, setCases] = useState<Complaint[]>([]);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name?.split(" ")[0];
      if (name) {
        setUserName(name);
      }

      const fetchComplaints = async () => {
        try {
          const { data, error } = await supabase
            .from("complaints")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching complaints for dashboard:", error.message);
            return;
          }

          if (data) {
            const mapped = data.map((item: any) => ({
              id: item.id,
              nature: item.nature_of_complaint,
              date: item.date,
              time: item.time,
              location: item.location,
              description: item.description,
              witnessName: item.witness_name || undefined,
              witnessContact: item.witness_contact || undefined,
              status: item.status,
              agency: item.agency,
              evidenceUrl: item.evidence_url || undefined,
            }));

            setCases(mapped);
          }
        } catch (err) {
          console.error("Dashboard complaints fetch error:", err);
        }
      };

      fetchComplaints();
    } else {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, [user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Filed":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Sent to Authority":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Approved & Investigating":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      default:
        return "bg-surface-variant text-on-surface-variant";
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-12 flex-grow">
      {/* Ambient background blur elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-24 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/20 blur-[120px]"></div>
        <div className="absolute bottom-12 right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary-container/20 blur-[130px]"></div>
      </div>

      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-background mb-1">
            Welcome back, {userName}
          </h1>
          <p className="font-body-lg text-on-surface-variant text-base md:text-lg">
            Your central hub for security, support, and empowerment.
          </p>
        </div>

        {/* Live Mobile Location Tracking Simulation Card */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-6 min-w-[240px] border border-white/50 shadow-sm">
          <div className="flex-grow">
            <span className="block font-label-bold text-xs font-bold text-on-background">
              Live Safe-Tracking
            </span>
            <span className={`text-xs font-semibold ${liveTracking ? "text-primary" : "text-on-surface-variant"}`}>
              {liveTracking ? "Active & Sharing GPS" : "Paused"}
            </span>
          </div>
          <button
            onClick={() => setLiveTracking(!liveTracking)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${
              liveTracking ? "bg-primary" : "bg-outline/30"
            }`}
            aria-label="Toggle Live Tracking"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                liveTracking ? "right-1" : "left-1"
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Primary Actions & Status Overview */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
          {/* Quick Actions Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* File Complaint Card */}
            <Link
              href="/complaint/new"
              className="glass-card rounded-3xl p-6 flex flex-col items-start gap-4 hover:-translate-y-1 transition-all duration-300 group border border-white/50 hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  description
                </span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-background">File New Complaint</h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Securely submit details to authorities with end-to-end encryption.
              </p>
              <span className="mt-auto pt-4 font-label-bold text-sm text-primary font-bold flex items-center gap-1">
                Start Filing <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </Link>

            {/* My Cases Status summary */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-white/50 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <h3 className="font-headline-md text-xl font-bold text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      folder_open
                    </span>
                    My Cases Status
                  </h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold select-none">
                    {cases.length} Filed
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[160px] overflow-y-auto">
                  {cases.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-white/30 backdrop-blur-md rounded-2xl border border-dashed border-outline-variant/40 flex flex-col items-center justify-center gap-3">
                      <span className="material-symbols-outlined text-3xl text-outline-variant">
                        folder_off
                      </span>
                      <p className="font-body-md text-xs text-on-surface-variant font-medium">
                        You have not filed any complaints yet
                      </p>
                      <Link
                        href="/complaint/new"
                        className="bg-primary text-on-primary text-[10px] font-extrabold px-4 py-1.5 rounded-full hover:bg-primary/95 transition-all shadow-[0_2px_8px_rgba(64,98,123,0.15)]"
                      >
                        File a Complaint
                      </Link>
                    </div>
                  ) : (
                    cases.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/40 backdrop-blur-md rounded-xl p-3 border border-outline-variant/20 flex justify-between items-center shadow-inner"
                      >
                        <div className="max-w-[70%]">
                          <span className="block font-label-bold text-xs font-bold text-on-surface">{item.nature}</span>
                          <span className="block text-[11px] text-on-surface-variant/80 truncate">ID: #{item.id}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <Link
                href="/complaint/tracker"
                className="font-label-bold text-sm font-bold text-primary text-center mt-6 hover:underline"
              >
                View Complaint History
              </Link>
            </div>
          </div>

          {/* Empowerment Grid section */}
          <section className="glass-card rounded-3xl p-6 border border-white/50">
            <h2 className="font-headline-md text-2xl font-bold text-on-background mb-6">
              Empowerment & Support Hub
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/resources"
                className="bg-white/40 border border-outline-variant/30 rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-2 group-hover:scale-105 transition-transform">
                  gavel
                </span>
                <span className="font-label-bold text-sm font-bold text-on-surface">Legal Aid Guidelines</span>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Understand your legal rights and online cyber policies.
                </p>
              </Link>
              <Link
                href="/resources"
                className="bg-white/40 border border-outline-variant/30 rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-2 group-hover:scale-105 transition-transform">
                  psychology
                </span>
                <span className="font-label-bold text-sm font-bold text-on-surface">Self-Defense & Confidence</span>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Assertive training modules and confidence building tips.
                </p>
              </Link>
              <Link
                href="/community"
                className="bg-white/40 border border-outline-variant/30 rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-2 group-hover:scale-105 transition-transform">
                  diversity_3
                </span>
                <span className="font-label-bold text-sm font-bold text-on-surface">Community Support</span>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Join stories and support groups in a moderated space.
                </p>
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column - Side Panels / Helplines & Tips */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          {/* Safety Tip Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/50 bg-gradient-to-br from-white/80 to-primary-container/10">
            <h3 className="font-headline-md text-lg font-bold text-primary flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined">lightbulb</span>
              Daily Safety Tip
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              When traveling alone at night, share your live GPS location link through our dashboard tracking with trusted family. Keep your SOS button trigger active in the background.
            </p>
          </div>

          {/* Quick Helpline Numbers Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/50">
            <h3 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-error">phone_in_talk</span>
              Emergency Hotlines
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">National Helpline:</span>
                <a href="tel:112" className="text-primary font-bold hover:underline">112</a>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">Women Safety Call:</span>
                <a href="tel:1091" className="text-primary font-bold hover:underline">1091</a>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-on-surface-variant font-medium">Cyber Cell Helpline:</span>
                <a href="tel:1930" className="text-primary font-bold hover:underline">1930</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
