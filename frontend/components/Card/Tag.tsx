import React from "react";

export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600">
      {children}
    </span>
  );
}
