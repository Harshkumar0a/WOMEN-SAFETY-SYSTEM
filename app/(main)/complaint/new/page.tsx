"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

export default function FileComplaintPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [nature, setNature] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [witnessContact, setWitnessContact] = useState("");
  
  // Interactive mock states
  const [isPinning, setIsPinning] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handlePinLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsPinning(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setPinnedLocation(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
        setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        setIsPinning(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(`Failed to pin location: ${error.message}`);
        setIsPinning(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileObject(file);
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nature || !date || !time || !description) {
      alert("Please fill in all required fields (Nature, Date, Time, Description).");
      return;
    }

    setIsLoading(true);

    try {
      // Securely fetch the currently authenticated user directly from Supabase session
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        alert("You must be logged in to file a complaint.");
        setIsLoading(false);
        return;
      }

      const generatedId = `WSS-2026-${Math.floor(100 + Math.random() * 900)}`;
      const agency = nature === "Cyberstalking" ? "Cyber Cell Unit" : "Central District Station";
      let evidenceUrl = null;

      if (fileObject) {
        const fileExt = fileObject.name.split(".").pop();
        const fileName = `${authUser.id}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(filePath, fileObject);

        if (uploadError) {
          alert(`Failed to upload evidence: ${uploadError.message}`);
          setIsLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("evidence")
          .getPublicUrl(filePath);

        evidenceUrl = urlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from("complaints").insert({
        id: generatedId,
        user_id: authUser.id,
        nature_of_complaint: nature,
        date,
        time,
        location: location || "Mock Location",
        description,
        witness_name: witnessName || null,
        witness_contact: witnessContact || null,
        agency,
        evidence_url: evidenceUrl,
        latitude,
        longitude,
      });

      if (insertError) {
        alert(`Error filing complaint: ${insertError.message}`);
      } else {
        setSuccessMsg(`Complaint successfully encrypted and logged under ID: #${generatedId}`);
        // Clear forms
        setNature("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setWitnessName("");
        setWitnessContact("");
        setPinnedLocation("");
        setLatitude(null);
        setLongitude(null);
        setUploadedFile(null);
        setFileObject(null);

        setTimeout(() => {
          router.push("/complaint/tracker");
        }, 1500);
      }
    } catch (err: any) {
      alert(err?.message || "An unexpected error occurred during submission.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient background blur elements */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
          <div className="absolute top-24 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/20 blur-[120px]"></div>
          <div className="absolute bottom-12 right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary-container/20 blur-[130px]"></div>
        </div>

        <div className="glass-card rounded-3xl p-12 md:p-16 border border-emerald-300/80 text-center space-y-6 max-w-2xl w-full animate-fade-in shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/95 to-emerald-50/10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="w-20 h-20 bg-emerald-100/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <span className="material-symbols-outlined text-5xl font-bold">check</span>
          </div>
          
          <h2 className="font-display-lg text-3xl font-extrabold text-on-background mt-4">
            Report Logged Successfully
          </h2>
          
          <p className="font-body-lg text-on-surface-variant text-base font-semibold max-w-lg mx-auto leading-relaxed">
            {successMsg}
          </p>
          
          <div className="pt-6 flex flex-col items-center gap-3 border-t border-outline-variant/10 mt-6">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-outline font-bold">
              Redirecting you to the Complaint Tracker...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-12 flex-grow font-body-md">
      <header className="mb-10 text-center md:text-left">
        <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-background mb-1">
          Raise Your Voice: File a Complaint
        </h1>
        <p className="font-body-lg text-on-surface-variant text-base md:text-lg">
          Your safety is our priority. Please provide the details below securely and confidentially.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Incident Details */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
            <h2 className="font-headline-md text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </span>
              Incident Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="complaint-nature">
                  Nature of Complaint <span className="text-error">*</span>
                </label>
                <select
                  required
                  value={nature}
                  onChange={(e) => setNature(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm cursor-pointer"
                  id="complaint-nature"
                >
                  <option value="" disabled>Select nature of incident...</option>
                  <option value="Violence">Violence</option>
                  <option value="Eve-teasing">Eve-teasing</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Domestic Violence">Domestic Violence</option>
                  <option value="Cyberstalking">Cyberstalking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="incident-date">
                    Date <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                    id="incident-date"
                    type="date"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="incident-time">
                    Time <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                    id="incident-time"
                    type="time"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block font-label-bold text-xs font-bold text-on-surface">Location</label>
              <div className="h-48 w-full bg-surface-container-low rounded-2xl border border-outline-variant/30 relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
                   style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-4y8S1cEsz-T9H-V9F_T3G7tZ3i5Z98h86-z9y3-X-P9G8C5r4h-d_p7m0N7p-Q')" }}>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
                
                {pinnedLocation ? (
                  <div className="relative z-10 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md border border-primary/20 text-xs font-semibold flex items-center gap-1.5 text-primary animate-fade-in">
                    <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                    {pinnedLocation}
                  </div>
                ) : (
                  <button
                    onClick={handlePinLocation}
                    disabled={isPinning}
                    className="relative z-10 bg-primary text-on-primary px-6 py-3 rounded-full font-label-bold text-xs font-bold shadow-md hover:bg-primary/95 hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">location_on</span> 
                    {isPinning ? "Fetching coordinates..." : "Pin Live Location"}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Description & Media */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/70"></div>
            <h2 className="font-headline-md text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </span>
              Description & Media
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="incident-desc">
                  Description of Incident <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm resize-y"
                  id="incident-desc"
                  placeholder="Describe what happened in detail (e.g. details of people involved, vehicle numbers, verbal statements etc)..."
                  rows={5}
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <span className="block font-label-bold text-xs font-bold text-on-surface">Upload Evidence (Photos/Videos/Audio)</span>
                <label className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-8 text-center hover:bg-primary-container/5 transition-all cursor-pointer group flex flex-col items-center justify-center gap-2">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,video/*,audio/*"
                  />
                  <div className="flex gap-3 text-primary">
                    <span className="material-symbols-outlined text-4xl group-hover:scale-105 transition-transform">
                      photo_camera
                    </span>
                    <span className="material-symbols-outlined text-4xl group-hover:scale-105 transition-transform">
                      videocam
                    </span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {uploadedFile ? `Selected: ${uploadedFile}` : "Click to browse or drag and drop files here"}
                  </p>
                  <p className="text-[11px] text-outline">Supports JPG, PNG, MP4, WAV (Max 50MB)</p>
                </label>
              </div>
            </div>
          </section>

          {/* Section 3: Witness Details */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40"></div>
            <h2 className="font-headline-md text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </span>
              Witness Details (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="witness-name">
                  Witness Name
                </label>
                <input
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                  id="witness-name"
                  placeholder="Enter witness name"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-label-bold text-xs font-bold text-on-surface" htmlFor="witness-contact">
                  Witness Contact
                </label>
                <input
                  value={witnessContact}
                  onChange={(e) => setWitnessContact(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface font-body-md text-sm"
                  id="witness-contact"
                  placeholder="Phone or email"
                  type="tel"
                />
              </div>
            </div>
          </section>

          {/* Submit Actions */}
          <section className="flex flex-col items-center pt-6 border-t border-outline-variant/30 gap-4">
            <p className="font-body-md text-xs text-on-surface-variant text-center max-w-xl leading-relaxed">
              By submitting, you confirm that the information provided is accurate and truthful. Data is encrypted using client-side keys before mock transmission.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 rounded-full font-label-bold text-sm font-bold text-primary bg-primary-container/30 hover:bg-primary-container/50 transition-colors cursor-pointer"
              >
                Save Draft & Exit
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-full font-label-bold text-sm font-bold text-on-primary bg-gradient-to-r from-primary to-surface-tint shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? "Encrypting & Submitting..." : "Review & Submit"}
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </section>
        </form>
    </div>
  );
}
