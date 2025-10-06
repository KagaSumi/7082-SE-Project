import React from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card/Card";
import ViewPostCard from "../../components/ViewPostCard";
import PillButton from "../../components/Card/PillButton";
// Placeholder user data
const user = {
  name: "Sarah Heward",
  email: "Sara.heward@my.bcit.ca",
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

const posts = [
  {
    id: 1,
    title: "How do you create prefabs in unity?",
    tag: ["Game Dev"],
    author: "Sarah Heward",
    time: "2h ago",
    content:
      "I am making a spider survival game and i really need to get the animations looking good! But animations are very tricky for our 8 legged friends.",
    votes: 12,
    replies: 3,
    views: 25,
  },
  {
    id: 2,
    title: "What’s the difference between logical and relative memory addresses?",
    tag: ["Programming"],
    author: "Sarah Heward",
    time: "5h ago",
    content:
      "I know what absolute memory addresses are but I dont really understand the distinctions between logical and relative addresses. They seem to be almost the same thing to me? If anyone could give me a concrete example that would be amazing.",
    votes: 8,
    replies: 2,
    views: 14,
  },
];

const answers = [
  {
    id: 1,
    title: "How do you create prefabs in unity?",
    tag: ["Game Dev"],
    author: "Sarah Heward",
    time: "1h ago",
    content:
      "I am making a spider survival game and i really need to get the animations looking good! But animations are very tricky for our 8 legged friends.",
    votes: 5,
    replies: 1,
    views: 10,
  },
  {
    id: 2,
    title: "What’s the difference between logical and relative memory addresses?",
    tag: ["Programming"],
    author: "Sarah Heward",
    time: "3h ago",
    content:
      "I know what absolute memory addresses are but I dont really understand the distinctions between logical and relative addresses. They seem to be almost the same thing to me? If anyone could give me a concrete example that would be amazing.",
    votes: 3,
    replies: 0,
    views: 7,
  },
];

export default function ProfilePage() {
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
                {posts.map((p) => (
                  <ViewPostCard
                    key={p.id}
                    questionId={p.id}
                    title={p.title}
                    tag={p.tag}
                    content={p.content}
                    username={p.author}
                    createdAt={p.time}
                    upvote={p.votes}
                    views={p.views}
                    replyCount={p.replies}
                  />
                ))}
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
                {answers.map((a) => (
                  <ViewPostCard
                    key={a.id}
                    questionId={a.id}
                    title={a.title}
                    tag={a.tag}
                    content={a.content}
                    username={a.author}
                    createdAt={a.time}
                    upvote={a.votes}
                    views={a.views}
                    replyCount={a.replies}
                  />
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Profile Panel */}
        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
            <img
              alt={user.name}
              className="h-28 w-28 rounded-full object-cover mb-4"
              src={user.avatar}
            />
            <div className="w-full text-center">
              <div className="text-base font-semibold text-slate-800 mb-1">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 mb-2">{user.about}</div>
              <div className="font-semibold text-slate-900">{user.name}</div>
              <div className="text-sm text-gray-500 mb-2">{user.term}</div>
              <div className="text-sm text-gray-500 mb-1">{user.email}</div>
              {/* <div className="font-medium text-slate-800">{user.role}</div> */}              
              <div className="flex justify-between text-sm text-slate-700 mb-2">
                <span>Questions {user.questions}</span>
                <span>Answers {user.answers}</span>
                <span>Reputation {user.reputation}</span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Student no: {user.studentNo}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Age: {user.age}
                <br />
                Gender: {user.gender}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Saved tags: {user.tags.join(", ")}
              </div>
              <div className="mt-4">
                <PillButton>Edit Details</PillButton>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}