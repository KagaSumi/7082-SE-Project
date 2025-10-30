// url = /question/[id]

import React from "react";

// Components
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import QuestionCard from "../../../components/QuestionCard/QuestionCard";

// Models and Types
import {
  QuestionWithAnswerModel,
  QuestionWithAnswer,
} from "../../../model/QuestionModel";

export default async function QuestionIdPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3000/api/questions/${params.id}`);

  if (!res.ok) throw new Error("Failed to fetch Question");
  const questionJson = await res.json();

  console.log(questionJson);
  questionJson.isAnonymous = !!questionJson.isAnonymous;
  if (Array.isArray(questionJson.answers)) {
    for (let i = 0; i < questionJson.answers.length; i++) {
      questionJson.answers[i].isAnonymous =
        !!questionJson.answers[i].isAnonymous;
    }
  }
  // validate JSON
  const result = QuestionWithAnswerModel.safeParse(questionJson);
  if (!result.success) {
    console.error(result.error);
    console.log(questionJson);
    throw new Error("Invalid thread data received from API");
  }

  const question: QuestionWithAnswer = result.data;
  const title: string =
    question.title.charAt(0).toUpperCase() + question.title.slice(1);
  const totalVotes: number = question.upVotes - question.downVotes;

  // const answers = question.answers;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Sidebar />

        <div className="flex flex-col gap-5">
          <QuestionCard question={question} currentUserId={question.userId} />
        </div>
      </main>
    </div>
  );
}
