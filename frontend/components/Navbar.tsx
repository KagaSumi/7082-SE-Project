import React from "react";

// components
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/** Site header */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <span className="text-lg font-bold">π</span>
            </div>
          </Link>
          <Link href="/">
            <span className="text-lg font-semibold text-slate-900">Praxis</span>
          </Link>
        </div>

        {/** Search bar */}
        <div className="min-w-[70%] lg:min-w-[50%]">
          <input
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-600 focus:ring-2"
          />
        </div>

        {/** Profie / Create new question */}
        <div className="ml-4 flex items-center gap-3">
          <button
            title="Create a question"
            aria-label="New Question"
            className="hidden rounded-xl border border-slate-200 p-2 cursor-pointer hover:bg-slate-100 md:block"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-700"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <img
            alt="User avatar"
            className="h-9 w-9 rounded-full object-cover cursor-pointer"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=140&auto=format&fit=crop"
          />
        </div>
      </div>
    </header>
  );
}
