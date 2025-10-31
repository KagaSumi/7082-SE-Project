'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Card from "../../../components/Card/Card";
import PillButton from "../../../components/Card/PillButton";

export default function CreateQuestionPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [course, setCourse] = useState("");
    const [courses, setCourses] = useState<Array<{ course_id: number; name: string }>>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [availableTags, setAvailableTags] = useState<Array<{ tag_id: number; name: string }>>([]);
    const [tagsLoading, setTagsLoading] = useState<boolean>(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState<string>("");
    const router = useRouter();

    // Fetch courses from backend (DB)
    useEffect(() => {
        async function fetchCourses() {
            setCoursesLoading(true);
            try {
                const res = await fetch("http://localhost:3000/api/courses");
                if (!res.ok) throw new Error("Failed to fetch courses");
                const data = await res.json();
                const normalized = data.map((c: any) => ({
                    course_id: c.course_id ?? c.id ?? c.courseId,
                    name: c.name ?? c.title ?? c.code ?? "Unnamed Course",
                }));
                setCourses(normalized);

                // Optional: print retrieved courses for debugging
                console.log("Create Question - Courses from DB:", normalized);
                console.table(normalized);
            } catch (err) {
                console.error("Error loading courses:", err);
                setCourses([]);
            } finally {
                setCoursesLoading(false);
            }
        }
        fetchCourses();
    }, []);

    // Fetch available tags from backend
    useEffect(() => {
        async function fetchTags() {
            setTagsLoading(true);
            try {
                const res = await fetch("http://localhost:3000/api/tags");
                if (!res.ok) throw new Error("Failed to fetch tags");
                const data = await res.json();
                const normalized = (data || []).map((t: any) => ({
                    tag_id: t.tag_id ?? t.id ?? t.tagId,
                    name: (t.name ?? "").toString(),
                }));
                setAvailableTags(normalized);
            } catch (err) {
                console.error("Error loading tags:", err);
                setAvailableTags([]);
            } finally {
                setTagsLoading(false);
            }
        }
        fetchTags();
    }, []);

    // allows user to type in multiple words and treats each word as a tag
    function addTypedTags(input: string) {
        const parts = input
            .split(/\s+/)
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
        if (parts.length === 0) return;
        setSelectedTags((prev) => {
            const set = new Set(prev.map((t) => t.toLowerCase()));
            parts.forEach((p) => set.add(p));
            return Array.from(set);
        });
        setTagsInput("");
    }

    function toggleExistingTag(tagName: string) {
        const name = tagName.trim().toLowerCase();
        setSelectedTags((prev) =>
            prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
        );
    }

    function removeSelectedTag(tagName: string) {
        const name = tagName.trim().toLowerCase();
        setSelectedTags((prev) => prev.filter((t) => t !== name));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ensure a course is selected
        if (!course) {
            alert("Please select a course.");
            return;
        }

        try {
            const numericCourseId = Number(course);//need to do this until course backend stuff is ready
            const storedUser = localStorage.getItem("user");//use local storage until user JWT tokens are implemented
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const userId = parsedUser?.userId;
            if (!userId) {
                alert("You must be signed in to post a question.");
                return;
            }
            const res = await fetch("http://localhost:3000/api/questions/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: body,
                    userId,
                    courseId: numericCourseId,
                    isAnonymous: anonymous,
                    tags: selectedTags,
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
                                <option value="">{coursesLoading ? "Loading courses..." : "Select a course"}</option>
                                {!coursesLoading && courses.map((c) => (
                                    <option key={c.course_id} value={c.course_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-3">
                            <label className="block text-sm font-medium text-slate-700">
                                Tags
                            </label>
                            {/* Available tags selector */}
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-xs text-slate-500 mb-2">
                                    {tagsLoading ? "Loading available tags..." : "Select existing tags:"}
                                </p>
                                {!tagsLoading && availableTags.length > 0 ? (
                                    <div className="flex flex-row flex-wrap gap-3">
                                        {availableTags.map((t) => {
                                            const name = t.name.toLowerCase();
                                            const checked = selectedTags.includes(name);
                                            return (
                                                <label key={t.tag_id} className="inline-flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        checked={checked}
                                                        onChange={() => toggleExistingTag(name)}
                                                    />
                                                    <span className="px-2 py-1 rounded-full border border-slate-300 bg-slate-50">
                                                        {t.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : !tagsLoading ? (
                                    <p className="text-sm text-slate-500">No tags available.</p>
                                ) : null}
                            </div>

                            {/* Free-form tag input */}
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-xs text-slate-500 mb-2">
                                    Type one or more words separated by whitespace; each word becomes a tag.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTypedTags(tagsInput);
                                            }
                                        }}
                                        placeholder="e.g. arrays sorting dp"
                                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                                        onClick={() => addTypedTags(tagsInput)}
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Selected tags */}
                                {selectedTags.length > 0 && (
                                    <div className="mt-3 flex flex-row flex-wrap gap-2">
                                        {selectedTags.map((t) => (
                                            <span key={t} className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-slate-300 bg-white text-sm">
                                                {t}
                                                <button
                                                    type="button"
                                                    className="text-slate-500 hover:text-slate-700"
                                                    onClick={() => removeSelectedTag(t)}
                                                    aria-label={`Remove tag ${t}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
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
