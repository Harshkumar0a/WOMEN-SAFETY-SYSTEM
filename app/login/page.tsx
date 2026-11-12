"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter your login details.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex bg-background text-on-background font-body-md">
      {/* Left Section (Empowering Artwork & Mission) - exactly 50% width on desktop */}
      <section className="hidden lg:flex w-1/2 h-full relative flex-col justify-between p-16 overflow-hidden bg-primary shrink-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay z-0"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsQXJA9bhEcwpeeFbF_kk-Y1Ra0eVGFr_m62bSTcon6HkwhEC4UoGJi0OhcPSwJpsqFXlAb7Ks5YjC7Q-6_-YxKg4GxrxgIrH4EywTdhEoWGAPA07RK8KEu3-VdI3jo-xNGa_TvNRXrE5aGH2hv8jrQjdvUOmlu-HXZ2kj2sLy2fE_ViGw4KqRuKYDk5z2jyqlg1mUoGo2LnvL4IEqU8kcjEiNTv2PnpX79FhePuvzdnPN1hIaJPjR')",
          }}
        ></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full justify-between text-white">
          <div>
            <h1 className="font-display-lg text-4xl font-extrabold tracking-wider">
              WOMEN SAFETY SYSTEM
            </h1>
          </div>
          <div className="max-w-md space-y-4">
            <h2 className="font-headline-md text-3xl font-bold">Secure. Support. Empower.</h2>
            <p className="font-body-lg text-lg text-white/90 leading-relaxed">
              Join a community dedicated to your safety. <br/>Access emergency tools, trusted resources, and a network of support,<br/> all in one secure place.
            </p>
          </div>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-0 pointer-events-none"></div>
      </section>

      {/* Right Section (Login Form) - exactly 50% width on desktop */}
      <section className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 relative bg-surface-container-low/20 overflow-y-auto shrink-0">
        <div className="absolute inset-0 bg-surface/50 backdrop-blur-[100px] -z-10"></div>
        
        {/* Form Container: Guaranteed 400px width on desktop, responsive on mobile */}
        <div className="w-[400px] max-w-full flex flex-col gap-6 relative z-10">
          
          {/* Mobile Brand Header (Visible only on mobile) */}
          <div className="lg:hidden text-center">
            <h1 className="font-headline-md text-2xl text-primary font-extrabold tracking-wider">
              WOMEN SAFETY SYSTEM
            </h1>
          </div>

          {/* Glassmorphic Login Card */}
          <div className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-3xl p-8 relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-1">Welcome Back</h2>
              <p className="font-body-md text-on-surface-variant text-sm">Please log in to continue.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-container/30 border border-error-container/40 rounded-xl text-error text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Input Field: Mobile/Email */}
              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="identifier">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
                    person
                  </span>
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/30 text-on-surface font-body-md rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner placeholder:text-outline/70 text-sm"
                    id="identifier"
                    placeholder="Enter your phone or email"
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Input Field: Password */}
              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/30 text-on-surface font-body-md rounded-xl py-3 pl-11 pr-11 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner placeholder:text-outline/70 text-sm"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end text-xs">
                <Link href="#" className="font-label-bold text-primary font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-surface-tint text-on-primary font-label-bold text-sm font-bold py-3.5 rounded-full shadow-[0_4px_14px_rgba(64,98,123,0.3)] hover:shadow-[0_6px_20px_rgba(64,98,123,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 text-center relative z-10 text-xs">
              <p className="font-body-md text-on-surface-variant">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-label-bold text-primary font-bold hover:underline underline-offset-4">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
