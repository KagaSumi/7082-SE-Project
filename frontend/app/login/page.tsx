"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import Card from "../../components/Card/Card";
import PillButton from "../../components/Card/PillButton";

const users = [
  { username: "alice", password: "123" },
  { username: "alex", password: "letmein" },
];
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setSuccess(true);
      setError(null);
      login();
      setTimeout(() => {
        router.push("/");
      }, 1000); // Optional: show success for a moment before redirect
    } else {
      setError("Invalid username or password.");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Logo and heading */}
      <div className="flex flex-col items-center mt-12 mb-6">
        <Link href="/" className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white text-3xl font-bold">
              π
            </div>
            <span className="text-3xl font-semibold text-slate-900">Praxis</span>
          </div>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800 mt-2 mb-2">
          Log in to your account
        </h1>
      </div>
      {/* Login Card */}
      <Card>
        <form
          className="flex flex-col gap-6 min-w-[320px] px-4 py-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">
              Login successful!
            </div>
          )}
          <div>
            <PillButton type="submit">Login</PillButton>
          </div>
        </form>
      </Card>
      <div className="mt-4 text-center text-slate-700">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-blue-700 hover:underline font-medium"
        >
          Sign up
        </a>
      </div>
    </div>
  );
}