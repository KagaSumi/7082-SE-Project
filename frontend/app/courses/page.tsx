'use client'
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card/Card";
import ViewPostCard from "../../components/ViewPostCard";


const courses = [
  { id: 1, name: "MATH 3042 (Calculus)" },
  { id: 2, name: "COMP 1537 (Web Dev)" },
  { id: 3, name: "PHYS 3560 (Quantum Mechanics)" },
];


import { useEffect } from "react";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = selectedCourse
    ? posts.filter((post) => post.courseId === selectedCourse)
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
                  <li key={course.id}>
                    <button
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-base font-medium text-slate-800 shadow hover:bg-blue-50 transition"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      {course.name}
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
                {loading ? (
                  <div className="text-slate-500 px-4 py-8 text-center">Loading...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-slate-500 px-4 py-8 text-center">
                    No posts found for this course.
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {filteredPosts.map((p) => (
                      <ViewPostCard
                        key={p.questionId}
                        questionId={p.questionId}
                        title={p.title}
                        tag={p.tag || []}
                        content={p.content}
                        username={p.userId}
                        createdAt={p.createdAt}
                        upvote={p.upVotes}
                        views={p.viewCount}
                        replyCount={0}
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