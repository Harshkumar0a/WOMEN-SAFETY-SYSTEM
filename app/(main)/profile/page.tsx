"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        }

        if (data) {
          setFullName(data.full_name || "");
          setPhoneNumber(data.phone_number || "");
          setEmergencyEmail(data.emergency_email || "");
        } else {
          // Fallback to metadata
          setFullName(user.user_metadata?.full_name || "");
          setPhoneNumber(user.user_metadata?.phone_number || "");
          setEmergencyEmail(user.user_metadata?.emergency_email || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          emergency_email: emergencyEmail,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      // Also update auth user metadata so client context syncs
      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          emergency_email: emergencyEmail
        }
      });

      setMessage({ type: "success", text: "Profile details updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-12 flex-grow font-body-md">
      {/* Ambient background blur elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-45">
        <div className="absolute top-24 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/20 blur-[120px]"></div>
        <div className="absolute bottom-12 right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary-container/20 blur-[130px]"></div>
      </div>

      <header className="mb-10 text-center md:text-left">
        <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-background mb-1">
          My Account Profile
        </h1>
        <p className="font-body-lg text-on-surface-variant text-base md:text-lg">
          Manage your personal details and emergency rescue contacts.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
          <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm space-y-6">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
            
            <h2 className="font-headline-md text-xl font-bold text-primary flex items-center gap-3 border-b border-outline-variant/20 pb-4 mb-2">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
              Profile Details
            </h2>

            {message && (
              <div className={`p-4 rounded-xl border text-sm font-semibold animate-fade-in ${
                message.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-error-container/20 text-error border-error-container/40"
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="profile-fullname">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  id="profile-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                  placeholder="Sarah Jenkins"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="profile-phone">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  id="profile-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1.5 pt-4 border-t border-outline-variant/20">
                <label className="block font-label-bold text-xs font-bold text-error flex items-center gap-1.5" htmlFor="profile-emergency">
                  <span className="material-symbols-outlined text-sm">emergency</span>
                  Emergency SOS Contact Email Address
                </label>
                <input
                  required
                  type="email"
                  id="profile-emergency"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline/30 rounded-xl p-3 focus:ring-2 focus:ring-error focus:border-error transition-all text-on-surface font-body-md text-sm font-bold shadow-inner"
                  placeholder="Enter relative's email address (e.g. guardian@example.com)"
                />
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed mt-1">
                  *When you trigger the emergency SOS button, a secure geographic location email alert will be immediately dispatched to this address.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-full font-label-bold text-sm font-bold text-on-primary bg-gradient-to-r from-primary to-surface-tint shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  Save Profile Settings
                  <span className="material-symbols-outlined text-base">save</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
