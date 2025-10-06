// Question and Answer Card
import React from "react";

// Components
import PillButton from "./Card/PillButton";
import AnswerForm from "./AnswerForm";

enum QA {
  Answer,
  Question,
}

export default function QACard({
  questionId,
  type,
  totalVotes,
  content,
  createdAt,
  username,
}: {
  questionId: number;
  type: QA;
  totalVotes: number;
  content: string;
  createdAt?: string;
  username?: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[50px_1fr] gap-5">
        {/** Upvote / Downvote */}
        <div className="flex flex-col items-center gap-2">
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
              {content} <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
              eveniet eos veniam blanditiis dicta pariatur ad minus. Doloribus
              fuga quo deserunt facilis! Ipsum, molestias? Veniam sequi iusto
              obcaecati mollitia eveniet!
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              hic provident perspiciatis! Exercitationem, doloribus, est
              asperiores deserunt id placeat quasi vel nesciunt velit optio
              sapiente quod tenetur molestiae? Aliquam, ab.{" "}
            </p>
          </div>

          {type === QA.Answer ? (
            <div className="pt-5 text-slate-500 text-sm flex flex-row justify-between">
              <div>
                <p className="cursor-pointer">Edit</p>
                {/* <p>Delete</p> implemented after auth*/}
              </div>
              <div>
                <p>answered at {createdAt}</p>
                <p className="cursor-pointer text-blue-500">username goes here</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/** If queston */}
      {type === QA.Question ? <AnswerForm questionId={questionId} /> : null}
    </div>
  );
}

export { QA };
