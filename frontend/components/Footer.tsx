"use client"

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-700 px-6 py-3 text-xs text-slate-400 flex justify-between">
      <div>© 2025 CargoOptix. All rights reserved.</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-slate-200">
          Help
        </a>
        <a href="#" className="hover:text-slate-200">
          Docs
        </a>
        <a href="#" className="hover:text-slate-200">
          API
        </a>
      </div>
    </footer>
  )
}
