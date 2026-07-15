"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isAlerted, setIsAlerted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && countdown > 0 && !isAlerted) {
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current!);
            executeSOSTrigger();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [isOpen, countdown, isAlerted]);

  const handleOpen = () => {
    setIsOpen(true);
    setCountdown(5);
    setIsAlerted(false);
    setSendError(null);
  };

  const handleCancel = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setIsOpen(false);
    setCountdown(5);
    setIsAlerted(false);
    setSendError(null);
  };

  const handleTriggerImmediately = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setCountdown(0);
    executeSOSTrigger();
  };

  const triggerSOSEndpoint = async (lat: number, lng: number) => {
    setIsSending(true);
    setSendError(null);

    try {
      // 1. Fetch the active user access token from Supabase client
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("You must be logged in to dispatch an emergency SOS alert.");
      }

      // 2. Dispatch call to our backend API route
      const response = await fetch("/api/trigger-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to trigger SOS dispatch.");
      }

      setIsAlerted(true);
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || "Failed to contact emergency services.");
    } finally {
      setIsSending(false);
    }
  };

  const executeSOSTrigger = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Dispatching default location SOS alert...");
      triggerSOSEndpoint(0.0, 0.0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        triggerSOSEndpoint(lat, lng);
      },
      (error) => {
        console.error("SOS Location error:", error);
        alert("Could not retrieve precise coordinates. Dispatching default location SOS alert...");
        triggerSOSEndpoint(0.0, 0.0);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <div className="fixed right-8 bottom-8 z-[100] flex flex-col items-center">
        <button
          onClick={handleOpen}
          className="bg-error text-on-error rounded-full p-6 shadow-[0_0_20px_rgba(186,26,26,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(186,26,26,0.6)] transition-all duration-200 active:scale-95 animate-pulse-emergency flex items-center justify-center cursor-pointer"
          aria-label="Trigger SOS"
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            emergency
          </span>
        </button>
        <span className="font-emergency-label text-[13px] font-extrabold tracking-widest text-error mt-2 drop-shadow-sm select-none">
          TRIGGER SOS
        </span>
      </div>

      {/* Fullscreen SOS Emergency Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-on-background/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          {/* Main split-screen modal container */}
          <div className="bg-white/95 backdrop-blur-2xl border border-error-container max-w-4xl w-full rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Side (Image/Banner) - exactly 50% width on desktop */}
            <div className="hidden md:flex md:w-1/2 bg-error/10 relative flex-col justify-between p-10 overflow-hidden shrink-0 border-r border-error-container/20">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay z-0"
                   style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsQXJA9bhEcwpeeFbF_kk-Y1Ra0eVGFr_m62bSTcon6HkwhEC4UoGJi0OhcPSwJpsqFXlAb7Ks5YjC7Q-6_-YxKg4GxrxgIrH4EywTdhEoWGAPA07RK8KEu3-VdI3jo-xNGa_TvNRXrE5aGH2hv8jrQjdvUOmlu-HXZ2kj2sLy2fE_ViGw4KqRuKYDk5z2jyqlg1mUoGo2LnvL4IEqU8kcjEiNTv2PnpX79FhePuvzdnPN1hIaJPjR')" }}>
              </div>
              <div className="relative z-10 text-error space-y-4">
                <span className="material-symbols-outlined text-5xl font-bold animate-pulse-emergency">warning</span>
                <h3 className="font-headline-md text-2xl font-extrabold tracking-wider">EMERGENCY SOS</h3>
                <p className="font-body-md text-xs text-error/85 leading-relaxed font-semibold">
                  A high-priority location dispatch alert has been initialized. Stay calm. Nearest response cells and emergency contacts are being synced.
                </p>
              </div>
              <div className="relative z-10 mt-12 bg-white/80 border border-error-container/30 py-2.5 px-4 rounded-xl text-[10px] text-error font-extrabold tracking-wider flex items-center gap-2 self-start animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                GPS LOCATOR BROADCASTING
              </div>
            </div>

            {/* Right Side (SOS text/actions) - exactly 50% width, centered content, min-width 400px */}
            <div className="w-full md:w-1/2 md:min-w-[400px] shrink-0 flex flex-col items-center justify-center p-8 relative min-h-[360px]">
              
              {isSending ? (
                <div className="space-y-6 w-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 border-4 border-error border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center space-y-2">
                    <h2 className="font-headline-md text-xl font-extrabold text-error tracking-wider">
                      DISPATCHING SOS SMS...
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant font-semibold">
                      Retrieving geolocation parameters and broadcasting to the Fast2SMS emergency gateway.
                    </p>
                  </div>
                </div>
              ) : sendError ? (
                <div className="space-y-6 w-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl font-bold">error</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="font-headline-md text-xl font-extrabold text-error tracking-wider">
                      DISPATCH FAILURE
                    </h2>
                    <p className="font-body-md text-xs text-error font-bold px-4 py-2 bg-error/10 rounded-xl border border-error/20">
                      {sendError}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                      onClick={executeSOSTrigger}
                      className="w-full px-6 py-3 rounded-full font-label-bold text-xs font-bold text-on-error bg-error hover:bg-error/95 hover:scale-102 transition-all cursor-pointer shadow-md"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full px-6 py-3 rounded-full font-label-bold text-xs font-bold text-on-surface-variant bg-surface-container-high/80 hover:bg-surface-container-high hover:scale-102 transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : !isAlerted ? (
                <div className="space-y-6 w-full flex flex-col items-center justify-center">
                  <div className="space-y-2 text-center">
                    <h2 className="font-headline-md text-xl font-extrabold text-error tracking-wider">
                      EMERGENCY ALERT SYSTEM
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      Broadcasting GPS coordinates and warning logs in:
                    </p>
                  </div>

                  {/* Big Countdown Number */}
                  <div className="text-7xl font-extrabold text-error select-none animate-ping">
                    {countdown}
                  </div>

                  <div className="flex flex-col gap-3 w-full max-w-sm pt-4">
                    <button
                      onClick={handleTriggerImmediately}
                      className="w-full px-6 py-3 rounded-full font-label-bold text-xs font-bold text-on-error bg-error hover:bg-error/90 hover:scale-102 transition-all cursor-pointer shadow-md shadow-error/30 animate-pulse-emergency"
                    >
                      Trigger Immediately
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full px-6 py-3 rounded-full font-label-bold text-xs font-bold text-on-surface-variant bg-surface-container-high/80 hover:bg-surface-container-high hover:scale-102 transition-all cursor-pointer"
                    >
                      Cancel Alert
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 w-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                  </div>

                  <div className="space-y-1 text-center">
                    <h2 className="font-headline-md text-xl font-extrabold text-emerald-600 tracking-wider">
                      ALERT DISPATCHED!
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant font-semibold">
                      GPS coordinates sent to trusted contacts.
                    </p>
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 text-left space-y-2.5 w-full text-xs">
                    <span className="block font-label-bold text-xs text-on-surface font-bold border-b pb-1.5 border-outline-variant/30">
                      Emergency Helpline Numbers
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">National Emergency Number:</span>
                      <a href="tel:112" className="text-primary font-bold hover:underline">112</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">Women Safety Helpline:</span>
                      <a href="tel:1091" className="text-primary font-bold hover:underline">1091</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">Police Control Room:</span>
                      <a href="tel:100" className="text-primary font-bold hover:underline">100</a>
                    </div>
                  </div>

                  <button
                    onClick={handleCancel}
                    className="w-full px-6 py-3 rounded-full font-label-bold text-xs font-bold text-on-primary bg-primary hover:bg-primary/95 hover:scale-102 transition-all cursor-pointer shadow-md shadow-primary/20"
                  >
                    I am Safe Now (Close)
                  </button>
                </div>
              )}
              
            </div>

          </div>
        </div>
      )}
    </>
  );
}
