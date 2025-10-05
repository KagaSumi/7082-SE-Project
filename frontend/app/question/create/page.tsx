'use client'
import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Card from "../../../components/Card/Card";
import PillButton from "../../../components/Card/PillButton";

const courses = [
  "COMP 1510",
  "COMP 1537",
  "COMP 2510",
  "COMP 2521",
  "MATH 3042",
  "COMM 1140",
  "COMM 2216",
  "BUSA 2150",
  "OPMT 1197",
  "LIBS 7001",
  "COMP 3717",
  "COMP 4736",
  "COMP 4916",
  "COMP 7000",
  "COMP 8001",
];

export default function CreateQuestionPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [course, setCourse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here (e.g., API call)
    alert(
      `Title: ${title}\nBody: ${body}\nAnonymous: ${anonymous}\nCourse: ${course}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Card>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ask a New Question
            </h2>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your question title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Body
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe your question in detail"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>
            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {/* Anonymous */}
            <div className="flex items-center gap-2">
              <input
                id="anonymous"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="anonymous" className="text-sm text-slate-700">
                Post anonymously
              </label>
            </div>
            {/* Submit */}
            <div>
              <PillButton type="submit">Post Question</PillButton>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}