"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden font-body-md bg-background text-on-background min-h-screen">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-primary-fixed leading-tight tracking-tight">
            A SAFELINE FOR EVERY WOMAN.
          </h1>
          <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            An integrated web portal providing facilities to register complaints and empower women&apos;s safety where other government portals are absent.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/dashboard"
              className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-bold text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-[#5b85a3]"
            >
              Get Started
            </Link>
            <Link
              href="/resources"
              className="glass-panel text-primary px-8 py-3.5 rounded-full font-label-bold text-sm font-bold hover:bg-white/50 transition-all border border-primary/20"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image / Art Illustration */}
        <div className="lg:w-1/2 w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl relative glass-panel border border-white/50 group">
          <img
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            alt="Empowered Women Standing Together"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCaHPqFKrlNVz337fgsazXnmeupuKhczLH0RxEfF2R3y7RWWUoZOFum35B6FLLttrKFyfrcLrwlUWHw_k34GgDz2vzSWaNludC4ma-ud4SkYQVIFs6WFFd_dqkDA14PRzABi-jIyCni7AS8MdrZvNS1A6A34VFsmfw8HxsjNQnGBJeC4ZczmtRUmBCBrzaYrRITTOy-fSUlhQJgQFZN0VJQwAgmNXqCw4L2FEboLVZ4qq8fmTqjzlm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-headline-md text-3xl font-bold text-primary">Our Core Safe-Hub Features</h2>
          <p className="text-on-surface-variant text-base">
            Access secure resources, emergency assistance, and robust case tracking at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Registration Card (Prominent - spans 2 columns on medium screens) */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-white/50 flex flex-col justify-between min-h-[250px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-container/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10 space-y-4">
              <span className="material-symbols-outlined text-primary text-5xl">app_registration</span>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface">Secure Registration</h3>
              <p className="font-body-md text-on-surface-variant max-w-md">
                Create a secure account to access personalized safety tools, add emergency contacts, and toggle live mobile tracking features.
              </p>
            </div>
            <Link
              href="/register"
              className="text-primary font-label-bold text-sm font-bold flex items-center gap-2 mt-6 group-hover:gap-3 transition-all cursor-pointer"
            >
              Register Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Service 1: File Complaint */}
          <Link
            href="/complaint/new"
            className="glass-card rounded-3xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-white/50 group"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4 text-on-primary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h4 className="font-label-bold text-lg font-bold text-on-surface mb-2">File Complaint</h4>
              <p className="text-sm text-on-surface-variant">
                Securely log incidents and grievances with absolute confidentiality.
              </p>
            </div>
            <span className="text-primary font-bold text-xs mt-6 flex items-center gap-1">
              File Report <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </Link>

          {/* Service 2: Track Case */}
          <Link
            href="/complaint/tracker"
            className="glass-card rounded-3xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-white/50 group"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-4 text-on-secondary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">track_changes</span>
              </div>
              <h4 className="font-label-bold text-lg font-bold text-on-surface mb-2">Track Case</h4>
              <p className="text-sm text-on-surface-variant">
                Check status logs and monitor real-time investigation progress.
              </p>
            </div>
            <span className="text-primary font-bold text-xs mt-6 flex items-center gap-1">
              Track Progress <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </Link>

          {/* Service 3: Community Forum */}
          <Link
            href="/community"
            className="glass-card rounded-3xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-white/50 group"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center mb-4 text-on-tertiary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <h4 className="font-label-bold text-lg font-bold text-on-surface mb-2">Community Forum</h4>
              <p className="text-sm text-on-surface-variant">
                Connect safely and share stories with moderated local support networks.
              </p>
            </div>
            <span className="text-primary font-bold text-xs mt-6 flex items-center gap-1">
              Join Forum <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </Link>

          {/* Service 4: Awareness & Library */}
          <Link
            href="/resources"
            className="glass-card rounded-3xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-white/50 group"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">library_books</span>
              </div>
              <h4 className="font-label-bold text-lg font-bold text-on-surface mb-2">Resource Library</h4>
              <p className="text-sm text-on-surface-variant">
                Empower yourself with rules, legal advice guidelines, and skill building.
              </p>
            </div>
            <span className="text-primary font-bold text-xs mt-6 flex items-center gap-1">
              View Resources <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
