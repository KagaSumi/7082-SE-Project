import React from "react";

export default function PillButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-blue-700">
      {children}
    </button>
  );
}