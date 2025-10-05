'use client'
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card/Card";
import ViewPostCard from "../../components/ViewPostCard";

// Placeholder data
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
];

const posts = [
  {
    id: 1,
    title: "How do you create prefabs in unity?",
    tag: ["Game Dev"],
    author: "Sarah Howard",
    time: "2h ago",
    content:
      "I am making a spider survival game and i really need to get the animations looking good! But animations are very tricky for our 8 legged friends.",
    votes: 12,
    replies: 3,
    views: 25,
    course: "COMP 1510",
  },
  {
    id: 2,
    title: "What’s the difference between logical and relative memory addresses?",
    tag: ["Programming"],
    author: "Sarah Howard",
    time: "5h ago",
    content:
      "I know what absolute memory addresses are but I don't really understand the distinctions between logical and relative addresses. They seem to be almost the same thing to me? If anyone could give me a concrete example that would be amazing.",
    votes: 8,
    replies: 2,
    views: 14,
    course: "COMP 1537",
  },
  {
    id: 3,
    title: "What is the chain rule?",
    tag: ["Calculus"],
    author: "Alex Kim",
    time: "1d ago",
    content:
      "Can someone explain the chain rule in calculus with a simple example?",
    votes: 5,
    replies: 1,
    views: 10,
    course: "MATH 3042",
  },
  {
    id: 4,
    title: "How to study for Math 1050?",
    tag: ["Math"],
    author: "Jamie Lee",
    time: "3d ago",
    content:
      "Any tips for preparing for the Math 1050 final exam?",
    votes: 2,
    replies: 0,
    views: 7,
    course: "COMP 2510",
  },
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const filteredPosts = selectedCourse
    ? posts.filter((post) => post.course === selectedCourse)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {selectedCourse ? `Posts for ${selectedCourse}` : "Select a Course"}
            </h2>
            {/* Course List */}
            {!selectedCourse && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <li key={course}>
                    <button
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-base font-medium text-slate-800 shadow hover:bg-blue-50 transition"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* Posts List */}
            {selectedCourse && (
              <div>
                <button
                  className="mb-4 text-blue-600 hover:underline text-sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  ← Back to courses
                </button>
                {filteredPosts.length === 0 ? (
                  <div className="text-slate-500 px-4 py-8 text-center">
                    No posts found for this course.
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {filteredPosts.map((p) => (
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
                )}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}