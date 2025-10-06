'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Card from "../../../components/Card/Card";
import PillButton from "../../../components/Card/PillButton";

const courses = [//need to do this until course backend stuff is ready
       { id: 1510, name: "COMP 1510" },
       { id: 1537, name: "COMP 1537" },
       { id: 2510, name: "COMP 2510" },
       { id: 2521, name: "COMP 2521" },
       { id: 3042, name: "MATH 3042" },
       { id: 1140, name: "COMM 1140" },
       { id: 2216, name: "COMM 2216" },
       { id: 2150, name: "BUSA 2150" },
       { id: 1197, name: "OPMT 1197" },
       { id: 7001, name: "LIBS 7001" },
       { id: 3717, name: "COMP 3717" },
       { id: 4736, name: "COMP 4736" },
       { id: 4916, name: "COMP 4916" },
       { id: 7000, name: "COMP 7000" },
       { id: 8001, name: "COMP 8001" },
];


export default function CreateQuestionPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [course, setCourse] = useState("");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: ensure a course is selected
        if (!course) {
            alert("Please select a course.");
            return;
        }

        try {
            const numericCourseId = Number(course);//need to do this until course backend stuff is ready
            const res = await fetch("http://localhost:3000/api/questions/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: body,
                    userId: 1,
                    courseId: numericCourseId,
                    isAnonymous: anonymous,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to create question.");
                return;
            }

            const data = await res.json();
            // Redirect to the new question page
            console.log("Question created with ID:", data);
            if (data && data.questionId) {
                router.push(`/question/${data.questionId}`);
            } else {
                alert("Question posted, but could not get question ID.");
            }
        } catch (err) {
            alert("Network error. Please try again.");
        }
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
                                    <option key={c.id} value={c.id}>
                                        {c.name}
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