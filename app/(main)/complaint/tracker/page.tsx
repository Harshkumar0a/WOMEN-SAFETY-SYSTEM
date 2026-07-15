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

export default function ComplaintTrackerPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [cases, setCases] = useState<Complaint[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching complaints from Supabase:", error.message);
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
        console.error("Fetch complaints error:", err);
      }
    };

    fetchComplaints();
  }, [user]);

  // Calculate counts dynamically
  const totalCount = cases.length;
  const newCount = cases.filter((c) => c.status === "Filed").length;
  const activeCount = cases.filter((c) => c.status === "Sent to Authority" || c.status === "Approved & Investigating").length;
  const resolvedCount = cases.filter((c) => c.status === "Completed").length;

  const filteredCases = cases.filter((c) => {
    if (filter === "All") return true;
    if (filter === "New") return c.status === "Filed";
    if (filter === "Active") return c.status === "Sent to Authority" || c.status === "Approved & Investigating";
    if (filter === "Resolved") return c.status === "Completed";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Filed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Filed
          </span>
        );
      case "Sent to Authority":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Sent to Authority
          </span>
        );
      case "Approved & Investigating":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Approved & Investigating
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-variant text-on-surface-variant">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-12 flex-grow font-body-md">
      <header className="mb-10 text-center md:text-left">
        <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-background mb-1">
          Complaint Tracker
        </h1>
        <p className="font-body-lg text-on-surface-variant text-base md:text-lg">
          Monitor the status and progress of your filed reports securely.
        </p>
      </header>

      {/* Tracker Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main list area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status summary numbers bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter("All")}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer transition-all ${
                filter === "All" ? "border-primary ring-2 ring-primary/20 bg-white" : "hover:bg-white/40"
              }`}
            >
              <span className="text-2xl font-bold text-primary">{totalCount}</span>
              <span className="text-xs font-bold text-on-surface-variant">Total Cases</span>
            </button>
            <button
              onClick={() => setFilter("New")}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer transition-all ${
                filter === "New" ? "border-primary ring-2 ring-primary/20 bg-white" : "hover:bg-white/40"
              }`}
            >
              <span className="text-2xl font-bold text-on-primary-fixed">{newCount}</span>
              <span className="text-xs font-bold text-on-surface-variant">Pending</span>
            </button>
            <button
              onClick={() => setFilter("Active")}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer transition-all ${
                filter === "Active" ? "border-primary ring-2 ring-primary/20 bg-white" : "hover:bg-white/40"
              }`}
            >
              <span className="text-2xl font-bold text-on-tertiary-container">{activeCount}</span>
              <span className="text-xs font-bold text-on-surface-variant">Active</span>
            </button>
            <button
              onClick={() => setFilter("Resolved")}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer transition-all ${
                filter === "Resolved" ? "border-primary ring-2 ring-primary/20 bg-white" : "hover:bg-white/40"
              }`}
            >
              <span className="text-2xl font-bold text-emerald-700">{resolvedCount}</span>
              <span className="text-xs font-bold text-on-surface-variant">Completed</span>
            </button>
          </div>

          {/* List display */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/50 shadow-sm">
            <div className="p-5 border-b border-outline-variant/30 bg-white/40 flex justify-between items-center">
              <h2 className="font-headline-md text-lg font-bold text-on-surface">Recent Reports ({filteredCases.length})</h2>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                filter_list
              </span>
            </div>

            <div className="divide-y divide-outline-variant/20 bg-white/20">
              {cases.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                  <span className="material-symbols-outlined text-5xl text-outline-variant">
                    folder_off
                  </span>
                  <p className="font-headline-md text-lg font-bold text-on-surface">
                    You have not filed any complaints yet
                  </p>
                  <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto">
                    Submit your concerns securely through our encrypted safety forms to track them in real-time.
                  </p>
                  <Link
                    href="/complaint/new"
                    className="mt-2 bg-primary text-on-primary text-xs font-bold py-2 px-6 rounded-full hover:bg-primary/95 transition-all shadow-md cursor-pointer"
                  >
                    File a Complaint
                  </Link>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant text-sm font-semibold">
                  No complaints found matching this status filter.
                </div>
              ) : (
                filteredCases.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedComplaint(item)}
                    className="p-6 hover:bg-white/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-label-bold text-[11px] font-bold bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">
                          ID: #{item.id}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <h3 className="font-headline-md text-lg font-bold text-on-surface">
                        {item.nature}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-sm align-middle">local_police</span>
                        <span>{item.agency}</span>
                        <span className="mx-1">•</span>
                        <span className="material-symbols-outlined text-sm align-middle">location_on</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-start md:items-end gap-2">
                      <span className="text-xs text-on-surface-variant font-semibold">{item.date}</span>
                      <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                        Track Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Support Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/50 space-y-6">
            <h3 className="font-headline-md text-lg font-bold text-on-surface border-b pb-2.5 border-outline-variant/30">
              Support Resources
            </h3>
            <div className="space-y-4">
              <a
                href="#"
                className="block p-4 rounded-xl bg-white/50 border border-outline-variant/20 hover:border-primary hover:bg-white transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                  <span className="font-label-bold text-sm font-bold text-on-surface group-hover:text-primary">
                    Contact Advocate
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Speak directly with a dedicated support counselor regarding your file.
                </p>
              </a>
              <a
                href="#"
                className="block p-4 rounded-xl bg-white/50 border border-outline-variant/20 hover:border-primary hover:bg-white transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                  <span className="font-label-bold text-sm font-bold text-on-surface group-hover:text-primary">
                    Legal Aid Cell
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Access free, confidential legal guidance for tracking court logs.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Case Details modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[200] bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/40 max-w-2xl w-full rounded-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface">
              <h2 className="font-headline-md text-lg font-bold text-on-surface">
                Complaint Detail: #{selectedComplaint.id}
              </h2>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-on-surface-variant hover:text-error p-2 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              {/* Incident Meta */}
              <div className="bg-surface-container-low/50 rounded-2xl p-4 border border-outline-variant/20 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Nature:</span>
                  <span className="font-bold text-primary">{selectedComplaint.nature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Logged Date:</span>
                  <span className="font-semibold text-on-surface">{selectedComplaint.date} {selectedComplaint.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Assigned Agency:</span>
                  <span className="font-semibold text-on-surface">{selectedComplaint.agency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Pinned Location:</span>
                  <span className="font-semibold text-on-surface">{selectedComplaint.location}</span>
                </div>
                <div className="border-t border-outline-variant/20 pt-2 mt-2">
                  <span className="block text-on-surface-variant font-medium mb-1">Details:</span>
                  <p className="text-on-surface leading-relaxed text-xs">{selectedComplaint.description}</p>
                </div>
                {selectedComplaint.evidenceUrl && (
                  <div className="border-t border-outline-variant/20 pt-2 mt-2 flex flex-col gap-1">
                    <span className="block text-on-surface-variant font-medium">Uploaded Evidence:</span>
                    <a
                      href={selectedComplaint.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-1.5 text-xs"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      View Uploaded Media Link
                    </a>
                  </div>
                )}
              </div>

              {/* Dynamic Status Timeline */}
              <div className="space-y-4">
                <h3 className="font-label-bold text-sm font-bold text-on-surface">Status Timeline</h3>
                <div className="relative pl-6 border-l-2 border-primary-container space-y-6">
                  {/* Step 1: Filed */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-primary ring-4 ring-white flex items-center justify-center text-[10px] text-white font-bold">
                      ✓
                    </span>
                    <h4 className="font-label-bold text-sm font-bold text-on-surface">Filed</h4>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">Report submitted securely and ID generated.</p>
                  </div>

                  {/* Step 2: Sent to Authority */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full ring-4 ring-white flex items-center justify-center text-[10px] text-white font-bold ${
                      selectedComplaint.status !== "Pending"
                        ? "bg-primary"
                        : "bg-outline-variant"
                    }`}>
                      {selectedComplaint.status !== "Pending" ? "✓" : "2"}
                    </span>
                    <h4 className={`font-label-bold text-sm font-bold ${
                      selectedComplaint.status !== "Pending"
                        ? "text-on-surface"
                        : "text-on-surface-variant/50"
                    }`}>
                      Sent to Authority
                    </h4>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      {selectedComplaint.status !== "Pending"
                        ? `Dispatched securely to ${selectedComplaint.agency}.`
                        : "Awaiting agency assignment dispatch."}
                    </p>
                  </div>

                  {/* Step 3: Approved */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full ring-4 ring-white flex items-center justify-center text-[10px] text-white font-bold ${
                      selectedComplaint.status === "Approved" || selectedComplaint.status === "Completed"
                        ? "bg-primary"
                        : "bg-outline-variant"
                    }`}>
                      {selectedComplaint.status === "Approved" || selectedComplaint.status === "Completed" ? "✓" : "3"}
                    </span>
                    <h4 className={`font-label-bold text-sm font-bold ${
                      selectedComplaint.status === "Approved" || selectedComplaint.status === "Completed"
                        ? "text-on-surface"
                        : "text-on-surface-variant/50"
                    }`}>
                      Approved & Investigating
                    </h4>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      {selectedComplaint.status === "Approved" || selectedComplaint.status === "Completed"
                        ? "Action items approved by police desk officer."
                        : "Pending desk approval."}
                    </p>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full ring-4 ring-white flex items-center justify-center text-[10px] text-white font-bold ${
                      selectedComplaint.status === "Completed" ? "bg-emerald-600" : "bg-outline-variant"
                    }`}>
                      {selectedComplaint.status === "Completed" ? "✓" : "4"}
                    </span>
                    <h4 className={`font-label-bold text-sm font-bold ${
                      selectedComplaint.status === "Completed" ? "text-emerald-700" : "text-on-surface-variant/50"
                    }`}>
                      Completed
                    </h4>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      {selectedComplaint.status === "Completed"
                        ? "Case resolved and archived. Details sent to user."
                        : "Ongoing case."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-outline-variant/20 bg-surface flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-sm hover:bg-primary/95 transition-all cursor-pointer font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
