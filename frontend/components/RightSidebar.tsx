"use client";
import React, { useEffect, useState } from "react";
import Card from "../components/Card/Card";
import Stat from "../components/Card/Stat";
import Link from "next/dist/client/link";

export default function RightSidebar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [user, setUser] = useState<{ first_name: string; last_name: string; email: string } | null>(null);
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`http://localhost:3000/api/users/${JSON.parse(localStorage.getItem("user")).userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-6">
        <Card>
          <div className="flex items-center gap-4">
            <img
              alt={user ? `${user.first_name} ${user.last_name}` : "User avatar"}
              className="h-16 w-16 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=140&auto=format&fit=crop"
            />
            <Link href="/profile">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                </div>
                <div className="text-xs text-slate-500">
                  {user ? user.email : ""}
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Questions" value={5} />
            <Stat label="Answers" value={0} />
            <Stat label="Reputation" value={666} />
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-sm font-semibold text-slate-900">
            Recent Activity
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-slate-500">Answered:</div>
              <a href="#" className="text-slate-800 hover:underline">
                Integration by parts
              </a>
            </div>
            <div>
              <div className="text-slate-500">Asked:</div>
              <a href="#" className="text-slate-800 hover:underline">
                Why does B.I.O matter in algorithms?
              </a>
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}
