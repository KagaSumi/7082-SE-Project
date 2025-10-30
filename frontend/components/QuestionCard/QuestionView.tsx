"use client";
// componrnt
import Card from "../Card/Card";
import Tag from "../Card/Tag";
import AnswerForm from "../AnswerForm";

// model
import { QuestionWithAnswer } from "../../model/QuestionModel";

export default function QuestionView({
  question,
  isOwner,
  onEdit,
  onDelete,
}: {
  question: QuestionWithAnswer;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const totalVotes = question.upVotes - question.downVotes;

  return (
    // header section
    <div className="flex flex-col gap-5">
      <Card>
        <div className="pl-2 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            {question.title}
          </h1>
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
                <p>
                  {question.content} <br />
                </p>
              </div>
            </div>
          </div>

          {isOwner ? (
            <div className="flex flex-col">
              <div className=" text-slate-500 text-sm flex flex-row gap-2 pl-2">
                <button onClick={onEdit} className="cursor-pointer">
                  Edit
                </button>
                <button onClick={onDelete} className="cursor-pointer">
                  Delete
                </button>
              </div>

              <AnswerForm questionId={question.questionId} />
            </div>
          ) : (
            <AnswerForm questionId={question.questionId} />
          )}
        </div>
      </Card>
    </div>
  );
}
