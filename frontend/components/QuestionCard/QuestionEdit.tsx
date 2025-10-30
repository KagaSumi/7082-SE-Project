"use client";

import { useState } from "react";

// componrnt
import Card from "../Card/Card";
import Tag from "../Card/Tag";
import AnswerForm from "../AnswerForm";

// model
import { QuestionWithAnswer } from "../../model/QuestionModel";

export default function QuestionEdit({
  question,
  onSave,
  onCancel,
}: {
  question: QuestionWithAnswer;
  onSave: (question: QuestionWithAnswer) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(question.title);
  const [content, setContent] = useState(question.content);

  const totalVotes = question.upVotes - question.downVotes;

  return (
    // header section
    <div className="flex flex-col gap-5">
      <Card>
        <div className="pl-2 flex flex-col gap-2">
          <input
            className="text-2xl font-semibold text-slate-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex flex-row align-center gap-10">
            <p className="text-sm text-slate-500">
              Asked: <span className="font-semibold">{question.createdAt}</span>
            </p>
            <p className="text-sm text-slate-500">
              Modified:{" "}
              <span className="font-semibold">{question.updatedAt}</span>
            </p>
            <p className="text-sm text-slate-500">
              Views: <span className="font-semibold">{question.viewCount}</span>
            </p>
          </div>

          {/** Tags */}
          <div className="mt-3 flex flex-row flex-wrap gap-1">
            {((question as any).tags || (question as any).tag || []).map(
              (t: string) => (
                <Tag key={t}>{t}</Tag>
              ),
            )}
          </div>
          {question.isAnonymous ? (
            <div className="text-sm text-slate-600">Anonymous</div>
          ) : (
            <a
              href={`/profile/${question.userId}`}
              className="text-sm text-slate-600 underline "
            >
              {question.firstname} {question.lastname}
            </a>
          )}
        </div>
      </Card>

      <Card>
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
            <div className=" text-slate-500 text-sm flex flex-row gap-2 pl-2">
              <form
                className="flex flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  question.title = title;
                  question.content = content;
                  onSave(question);
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
      </Card>
    </div>
  );
}
