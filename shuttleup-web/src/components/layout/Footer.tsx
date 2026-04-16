import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white pt-10 pb-8 py-12 md:py-16 mt-auto">
      <div className="container flex flex-col md:flex-row px-4 mx-auto justify-between gap-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 flex-1">
          <span className="font-bold text-xl flex items-center">
            🏸 ShuttleUp
          </span>
          <p className="text-sm text-slate-500 max-w-xs mt-2">
            The easiest way to find local badminton courts, join active sessions, and match with equal-skill players in your city.
          </p>
        </div>

        <div className="flex gap-16 flex-1 justify-end md:justify-around">
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Platform</h4>
            <Link href="/sessions" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Find Sessions</Link>
            <Link href="/courts" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Browse Courts</Link>
            <Link href="/dashboard/sessions/new" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Host a Session</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Legal</h4>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between">
        <p>© {new Date().getFullYear()} ShuttleUp. All rights reserved.</p>
        <p className="mt-4 sm:mt-0">Made with ❤️ for badminton lovers.</p>
      </div>
    </footer>
  );
}
