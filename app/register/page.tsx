"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    contactNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyContact: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.age || !formData.contactNo) {
        setError("Please fill out all personal details.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill out all account information details.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emergencyName || !formData.emergencyRelation || !formData.emergencyContact) {
      setError("Please fill out emergency contact details.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            age: formData.age,
            contact_no: formData.contactNo,
            emergency_name: formData.emergencyName,
            emergency_relation: formData.emergencyRelation,
            emergency_contact: formData.emergencyContact,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Save details to localStorage so Dashboard can personalize
        localStorage.setItem("userName", formData.fullName.split(" ")[0]);
        localStorage.setItem("emergencyContactName", formData.emergencyName);
        localStorage.setItem("emergencyContactPhone", formData.emergencyContact);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Progress Bar width calculation
  const getProgressWidth = () => {
    if (step === 1) return "w-1/3";
    if (step === 2) return "w-2/3";
    return "w-full";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#a8cbe7] text-on-surface antialiased overflow-x-hidden flex flex-col justify-center items-center p-6 py-12 font-body-md">
      {/* Registration Container */}
      <div className="glass-panel rounded-3xl w-full max-w-3xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        {/* Header Area */}
        <div className="p-8 border-b border-white/40">
          <div className="text-center mb-8">
            <Link href="/" className="font-headline-md text-2xl font-bold text-primary tracking-tight">
              WOMEN SAFETY SYSTEM
            </Link>
            <p className="font-body-lg text-sm text-on-surface-variant mt-1.5">
              Create your secure account
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="flex items-center justify-between w-full mt-8 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-surface-variant z-0 rounded-full"></div>
            <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-300 ${getProgressWidth()}`}></div>

            {/* Step 1 Indicator */}
            <div className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => setStep(1)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                step >= 1 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant border-2 border-white/50"
              }`}>
                1
              </div>
              <span className={`mt-2 text-xs font-bold absolute top-10 whitespace-nowrap ${
                step === 1 ? "text-primary" : "text-on-surface-variant/70"
              }`}>
                Personal Details
              </span>
            </div>

            {/* Step 2 Indicator */}
            <div className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => formData.fullName && formData.contactNo && setStep(2)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                step >= 2 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant border-2 border-white/50"
              }`}>
                2
              </div>
              <span className={`mt-2 text-xs font-bold absolute top-10 whitespace-nowrap ${
                step === 2 ? "text-primary" : "text-on-surface-variant/70"
              }`}>
                Account Info
              </span>
            </div>

            {/* Step 3 Indicator */}
            <div className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => formData.email && formData.password && setStep(3)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                step >= 3 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant border-2 border-white/50"
              }`}>
                3
              </div>
              <span className={`mt-2 text-xs font-bold absolute top-10 whitespace-nowrap ${
                step === 3 ? "text-primary" : "text-on-surface-variant/70"
              }`}>
                Emergency Contacts
              </span>
            </div>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="p-8 pt-4">
          {error && (
            <div className="mb-6 p-3.5 bg-error-container/30 border border-error-container/40 rounded-xl text-error text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="fullName"
                      placeholder="Jane Doe"
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="age">
                      Age
                    </label>
                    <input
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="age"
                      max="120"
                      min="13"
                      placeholder="25"
                      required
                      type="number"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="contactNo">
                    Contact Number
                  </label>
                  <input
                    value={formData.contactNo}
                    onChange={(e) => handleInputChange("contactNo", e.target.value)}
                    className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                    id="contactNo"
                    placeholder="+91 (555) 000-0000"
                    required
                    type="tel"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Account Info */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                    id="email"
                    placeholder="jane.doe@example.com"
                    required
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="password">
                      Password
                    </label>
                    <input
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="password"
                      placeholder="••••••••"
                      required
                      type="password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="confirmPassword"
                      placeholder="••••••••"
                      required
                      type="password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contacts */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="emergencyName">
                      Contact Name
                    </label>
                    <input
                      value={formData.emergencyName}
                      onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="emergencyName"
                      placeholder="John Doe"
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="emergencyRelation">
                      Relationship
                    </label>
                    <input
                      value={formData.emergencyRelation}
                      onChange={(e) => handleInputChange("emergencyRelation", e.target.value)}
                      className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                      id="emergencyRelation"
                      placeholder="Father / Spouse / Friend"
                      required
                      type="text"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="emergencyContact">
                    Emergency Contact Number
                  </label>
                  <input
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    className="w-full bg-white/50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface input-glow focus:bg-white transition-all duration-200"
                    id="emergencyContact"
                    placeholder="+91 (555) 999-9999"
                    required
                    type="tel"
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-6 border-t border-white/40 flex justify-between items-center">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  type="button"
                  className="px-6 py-2.5 rounded-full font-label-bold text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-white/30 transition-all cursor-pointer"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  type="button"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-inverse-primary to-primary text-on-primary font-label-bold text-sm font-bold shadow-md hover:shadow-lg transition-all ml-auto flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-surface-tint text-on-primary font-label-bold text-sm font-bold shadow-md hover:shadow-lg transition-all ml-auto flex items-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
