// Packages
import React from "react";
import Link from "next/link";

// Components
import ViewPostCard from "../components/ViewPostCard";
import Card from "../components/Card/Card";
import Navbar from "../components/Navbar";
import PillButton from "../components/Card/PillButton";
import Stat from "../components/Card/Stat";
import Sidebar from "../components/Sidebar";

const posts = [
  {
    id: 1,
    title: "How do I solve this integral?",
    tag: ["Calculus", "MATH 1050"],
    author: "User123",
    time: "2h ago",
    content:
      "I'm having trouble evaluating ∫u dv using integration by parts. What am I doing wrong?",
    votes: 10,
    replies: 2,
    views: 13,
  },
  {
    id: 2,
    title: "Best way to learn Python for beginners?",
    tag: ["Programming"],
    author: "AliceB",
    time: "7h ago",
    content:
      "I'm new to programming and looking for a good starting point to learn Python. Any suggestions?",
    votes: 21,
    replies: 3,
    views: 5,
  },
  {
    id: 3,
    title: "Best way to learn Python for beginners?",
    tag: ["Programming"],
    author: "AliceB",
    time: "7h ago",
    content:
      "I'm new to programming and looking for a good starting point to learn Python. Any suggestions?",
    votes: 21,
    replies: 3,
    views: 5,
  },
  {
    id: 4,
    title: "Best way to learn Python for beginners?",
    tag: ["Programming"],
    author: "AliceB",
    time: "7h ago",
    content:
      "I'm new to programming and looking for a good starting point to learn Python. Any suggestions?",
    votes: 21,
    replies: 3,
    views: 5,
  },
  {
    id: 5,
    title: "Best way to learn Python for beginners?",
    tag: ["Programming"],
    author: "AliceB",
    time: "7h ago",
    content:
      "I'm new to programming and looking for a good starting point to learn Python. Any suggestions?",
    votes: 21,
    replies: 3,
    views: 5,
  },
];

export default function PraxisPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <Navbar />

      {/* Content */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr_320px] lg:px-8">
        {/* Left Sidebar */}
        <Sidebar>
          <Card>
            <div className="mb-3 text-md font-semibold text-slate-900">
              Filter
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Programming",
                "Calculus",
                "Math 101",
                "History 150",
                "Biology 250",
              ].map((c) => (
                <li key={c}>
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-slate-700">{c}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <p className="text-slate-700 text-sm underline cursor-pointer">
                Show more filters
              </p>
            </div>

            <div className="mt-4">
              <PillButton>Apply</PillButton>
            </div>
          </Card>
        </Sidebar>

        {/* Main Feed */}
        <section className="space-y-6">
          <Card>
            <div className="flex flex-row gap-3">
              <input
                placeholder="Ask a new question..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-600 focus:ring-2"
              />

              <button
                title="Create a question"
                aria-label="New Question"
                className="hidden rounded-xl border bg-blue-600 border-slate-200 p-2 cursor-pointer hover:bg-blue-700 md:block"
              >
                <svg
                  width="30"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 p-2">
              <h2 className="pl-2 text-xl font-semibold text-slate-900">
                Newest Questions
              </h2>
              <div className="p-1 flex flex-col gap-5">
                {posts.map((p) => (
                  <ViewPostCard
                    key={p.id}
                    questionId={p.id}
                    title={p.title}
                    tag={p.tag}
                    content={p.content}
                    username={p.author}
                    createdAt={p.time}
                    upvote={p.votes}
                    views={p.views}
                    replyCount={p.replies}
                  />
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Right Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <Card>
              <div className="flex items-center gap-4">
                <img
                  alt="Jane Smith"
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=140&auto=format&fit=crop"
                />
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    Jane Smith
                  </div>
                  <div className="text-xs text-slate-500">Student</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Questions" value={5} />
                <Stat label="Answers" value={20} />
                <Stat label="Reputation" value={128} />
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
      </main>
    </div>
  );
}
