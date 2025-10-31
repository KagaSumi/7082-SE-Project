// revamping question page yuhh
import React from "react";

// Components
import Card from "../../../components/Card/Card";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import QuestionCard from "../../../components/Card/QuestionCard/QuestionCard";
import AnswerCard from "../../../components/Card/AnswerCard/AnswerCard";

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

  // probably add some error catching thing here
  if (!res.ok) throw new Error("Failed to fetch Question");
  const questionJson = await res.json();

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
  const answers = question.answers;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Sidebar />

        <div className="flex flex-col gap-8">
          {/* access local storage for now i suppose to get the user id */}
          <QuestionCard question={question} currentUserId={question.userId} />

          <div className="flex flex-col gap-4">
            <div className="px-3">
              <p className="text-xl font-semibold text-slate-900">
                {answers.length} Answers
              </p>
            </div>

            <Card>
              <div className="py-5 flex flex-col gap-10">
                {answers.map((answer) => {
                  return (
                    <AnswerCard
                      key={answer.answerId}
                      answer={answer}
                      currentUserId={answer.userId}
                    />
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
