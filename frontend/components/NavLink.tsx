import React from 'react'

export default function NavLink({ label, url }: { label: string, url: string }) {
  return (
    <a
      href={url}
      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      {label}
    </a>
  );
}