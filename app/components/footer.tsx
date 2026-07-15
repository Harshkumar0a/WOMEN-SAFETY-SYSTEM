import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-6">
        <div className="font-label-bold text-sm text-on-surface font-semibold text-center md:text-left">
          © {new Date().getFullYear()} WOMEN SAFETY SYSTEM. Secure. Support. Empower.
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link
            href="#"
            className="text-on-secondary-container/80 hover:text-primary underline underline-offset-4 transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-on-secondary-container/80 hover:text-primary underline underline-offset-4 transition-all"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-on-secondary-container/80 hover:text-primary underline underline-offset-4 transition-all font-semibold"
          >
            Emergency Contacts
          </Link>
          <Link
            href="#"
            className="text-on-secondary-container/80 hover:text-primary underline underline-offset-4 transition-all"
          >
            Global Hotlines
          </Link>
        </div>
      </div>
    </footer>
  );
}
