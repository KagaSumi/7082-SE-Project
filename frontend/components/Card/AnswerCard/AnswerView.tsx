"use client";

// model
import { Answer } from "../../../model/AnswerModel";

export default function AnswerView({
  answer,
  isOwner,
  onEdit,
  onDelete,
}: {
  answer: Answer;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const totalVotes = answer.upVotes - answer.downVotes;

  return (
    <div className="relative flex flex-col gap-5 p-1">
      <div className="grid grid-cols-[50px_1fr] gap-5">
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

        <div className="flex flex-col gap-5">
          <div className="min-h-25">
            <p>
              {answer.content} <br />
            </p>
          </div>
        </div>
      </div>

      <div className="pt-5 text-slate-500 text-sm flex flex-row justify-between">
        <div>
          {/* if owner, allow edit and delete */}
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
            </div>
          ) : null}
        </div>

        <div>
          <p>answered at {answer.createdAt}</p>
          <p className="cursor-pointer text-blue-500">
            {answer.firstname} {answer.lastname}
          </p>
        </div>
      </div>
    </div>
  );
}
