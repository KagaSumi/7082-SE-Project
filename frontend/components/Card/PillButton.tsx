import React from "react";

export default function PillButton({
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
