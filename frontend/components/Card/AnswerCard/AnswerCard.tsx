"use client";
import { useState } from "react";

// components
import AnswerView from "./AnswerView";
import AnswerEdit from "./AnswerEdit";

// model
import { Answer } from "../../../model/AnswerModel";

export default function AnswerCard({
  answer,
  currentUserId,
}: {
  answer: Answer;
  currentUserId: number;
}) {
  const [isEditting, setIsEditting] = useState(false);
  const isOwner = answer.userId == currentUserId;

  async function handleSave(newContent: Answer) {
    if (!confirm("Save this edit?")) {
      return;
    }

    console.log(newContent);

    const newContentJson = JSON.stringify(newContent);
    await fetch(`http://localhost:3000/api/answers/${answer.answerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: newContentJson,
    });

    setIsEditting(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) {
      return;
    }

    await fetch(`http://localhost:3000/api/answers/${answer.answerId}`, {
      method: "DELETE",
    });
  }

  if (isEditting) {
    return (
      <AnswerEdit
        answer={answer}
        onSave={handleSave}
        onCancel={() => setIsEditting(false)}
      />
    );
  }

  return (
    <AnswerView
      answer={answer}
      isOwner={isOwner}
      onEdit={() => setIsEditting(true)}
      onDelete={handleDelete}
    />
  );
}
