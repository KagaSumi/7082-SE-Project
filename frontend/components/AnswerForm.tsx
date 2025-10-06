"use client";

import React from "react";
import { useState } from "react";

import PillButton from "./Card/PillButton";

function useAnswerForm() {
  const [content, setContent] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return { content, setContent, submitting, setSubmitting, isAnon, setIsAnon };
}

export default function AnswerForm({ questionId }: { questionId: number }) {
  const { content, setContent, submitting, setSubmitting, isAnon, setIsAnon } =
    useAnswerForm();

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsAnon(e.target.checked);
  }

  async function onSubmit(e: React.FormEvent) {
    console.log("this works here");
    // e.preventDefault(); 
    // add so the page does not refresh later
    
    const trimmed = content.trim();
    if (!trimmed) return;
    setContent(trimmed);

    setSubmitting(true);
    try {
      const body = JSON.stringify({
        content: content,
        questionId: questionId,
        isAnonymous: isAnon,
        userId: 1, // to be changed when db and auth is set up
      });

      const res = await fetch("http://localhost:3000/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      if (!res.ok) throw new Error("Failed");
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <details className="pt-5 group flex flex-col gap-3">
      <summary className="select-none size-fit rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-blue-700">
        Click to answer
      </summary>
      <form
        onSubmit={onSubmit}
        className="opacity-0 group-open:opacity-100 transition-opacity duration-500 ease-in-out "
      >
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Add answer in detail"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="flex flex-col gap-2">
          <div className="pl-1">
            <input
              onChange={handleCheckboxChange}
              type="checkbox"
              id="setAnon"
              name="setAnon"
              checked={isAnon}
            />
            <label htmlFor="setAnon" className="pl-2">
              Set anonymous
            </label>
          </div>
          <div>
            <PillButton type="submit" disabled={submitting}>
              Answer
            </PillButton>
          </div>
        </div>
      </form>
    </details>
  );
}
