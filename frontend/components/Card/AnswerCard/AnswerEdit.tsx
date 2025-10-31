"use client";

import { useState } from "react";

// model
import { Answer } from "../../../model/AnswerModel";

export default function AnswerEdit({
  answer,
  onSave,
  onCancel,
}: {
  answer: Answer;
  onSave: (question: Answer) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(answer.content);
  const [isAnonymous, setIsAnonymous] = useState(
    (answer as any).isAnonymous ?? false,
  );

  const totalVotes = answer.upVotes - answer.downVotes;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 p-3">
        <div className="grid grid-cols-[50px_1fr] gap-5">
          {/** Upvote / Downvote */}
          <div className="flex flex-col items-center gap-2">
            {/* Upvote */}
            <div className="rounded-full border border-gray-300 cursor-pointer hover:bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                width="30px"
                viewBox="0 -960 960 960"
                fill="--color-black"
              >
                <path d="m280-400 200-200 200 200H280Z" />
              </svg>
            </div>
            <p className="text-xl">{totalVotes}</p>
            {/* Downvote */}
            <div className="rounded-full border border-gray-300 cursor-pointer hover:bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                width="30px"
                viewBox="0 -960 960 960"
                fill="--color-black"
              >
                <path d="M480-360 280-560h400L480-360Z" />
              </svg>
            </div>
          </div>

          {/** Content Section */}
          <div className="flex flex-col gap-5">
            <div className="min-h-25">
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className=" text-slate-500 text-sm flex flex-row gap-2 pl-2 items-center">
            <input
              id="answer-anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="answer-anonymous" className="text-sm text-slate-600 mr-4">
              Post anonymously
            </label>
            <form
              className="flex flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                answer.content = content;
                (answer as any).isAnonymous = isAnonymous;
                onSave(answer);
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
