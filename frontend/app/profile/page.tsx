"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card/Card";
import ViewPostCard from "../../components/ViewPostCard";
import PillButton from "../../components/Card/PillButton";

import { QuestionWithAnswerModel, QuestionWithAnswer } from "../../model/QuestionModel";

// Placeholder user data (for static fields)
const staticUser = {
  role: "BsACS Student",
  term: "1st Term",
  questions: 5,
  answers: 10,
  reputation: 666,
  studentNo: "A012345678",
  age: 100,
  gender: "F",
  tags: ["Game Dev", "Calc", "Algorithms"],
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=140&auto=format&fit=crop",
  about: "Comp student",
};


const userId = 1;


export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ first_name: string; last_name: string; email: string } | null>(null);

  useEffect(() => {
    async function fetchQuestionsAndUser() {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await fetch("http://localhost:3000/api/users/1");
        if (userRes.ok) {
          setUser(await userRes.json());
        } else {
          setUser(null);
        }

        // Fetch questions
        const res = await fetch("http://localhost:3000/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const questionsJson: any[] = await res.json();

        // Only show questions asked by user 1
        const userQuestions = questionsJson.filter(q => q.userId === userId);

        // Only show answers given by user 1 (from all questions)
        const userAnswers: Array<{ answer: any; questionTitle: string; questionId: number }> = [];
        questionsJson.forEach((question) => {
          question.isAnonymous = !!question.isAnonymous;
          const result = QuestionWithAnswerModel.safeParse(question);
          if (result.success && Array.isArray(result.data.answers)) {
            result.data.answers.forEach((answer) => {
              if (answer.userId === userId) {
                userAnswers.push({ answer, questionTitle: question.title, questionId: question.questionId });
              }
            });
          }
        });

        setUserQuestions(userQuestions);
        setUserAnswers(userAnswers);
      } catch (err) {
        setUserQuestions([]);
        setUserAnswers([]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestionsAndUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* Main Feed */}
        <section className="space-y-6">
          {/* Recent Posts */}
          <Card>
            <div className="flex flex-col gap-4 p-2">
              <h2 className="pl-2 text-xl font-semibold text-slate-900">
                Recent Posts
              </h2>
              <div className="p-1 flex flex-col gap-5">
                {loading ? (
                  <span className="text-slate-500">Loading posts...</span>
                ) : userQuestions.length === 0 ? (
                  <span className="text-slate-500">No posts found.</span>
                ) : (
                  userQuestions.map((p) => (
                    <ViewPostCard
                      key={p.questionId}
                      questionId={p.questionId}
                      title={p.title}
                      tag={(p as any).tags || (p as any).tag || []}
                      content={p.content}
                      username={user ? `${user.first_name} ${user.last_name}` : "User"}
                      createdAt={p.createdAt}
                      upvote={p.upVotes}
                      views={p.viewCount}
                      replyCount={p.answerCount}
                    />
                  ))
                )}
              </div>
            </div>
          </Card>
          {/* Recent Answers */}
          <Card>
            <div className="flex flex-col gap-4 p-2">
              <h2 className="pl-2 text-xl font-semibold text-slate-900">
                Recent Answers
              </h2>
              <div className="p-1 flex flex-col gap-5">
                {loading ? (
                  <span className="text-slate-500">Loading answers...</span>
                ) : userAnswers.length === 0 ? (
                  <span className="text-slate-500">No answers found.</span>
                ) : (
                  userAnswers.map(({ answer, questionTitle, questionId }) => (
                    <ViewPostCard
                      key={answer.answerId}
                      questionId={questionId}
                      title={questionTitle}
                      tag={[]}
                      content={answer.content}
                      username={user ? `${user.first_name} ${user.last_name}` : "User"}
                      createdAt={answer.createdAt}
                      upvote={answer.upVotes}
                      views={0}
                      replyCount={0}
                    />
                  ))
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Profile Panel */}
        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
            <img
              alt={user ? `${user.first_name} ${user.last_name}` : "User avatar"}
              className="h-28 w-28 rounded-full object-cover mb-4"
              src={staticUser.avatar}
            />
            <div className="w-full text-center">
              <div className="text-base font-semibold text-slate-800 mb-1">
                {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
              </div>
              <div className="text-sm text-gray-500 mb-2">{staticUser.about}</div>
              {/* <div className="font-semibold text-slate-900">{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</div> */}
              <div className="text-sm text-gray-500 mb-2">{staticUser.term}</div>
              <div className="text-sm text-gray-500 mb-1">{user ? user.email : ""}</div>
              {/* <div className="font-medium text-slate-800">{staticUser.role}</div> */}              
              <div className="flex justify-between text-sm text-slate-700 mb-2">
                <span>Questions {staticUser.questions}</span>
                <span>Answers {staticUser.answers}</span>
                <span>Reputation {staticUser.reputation}</span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Student no: {staticUser.studentNo}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Age: {staticUser.age}
                <br />
                Gender: {staticUser.gender}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Saved tags: {staticUser.tags.join(", ")}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <PillButton>Edit Details</PillButton>
                <PillButton
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  style={{ backgroundColor: '#e53e3e' }}
                >
                  Logout
                </PillButton>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}