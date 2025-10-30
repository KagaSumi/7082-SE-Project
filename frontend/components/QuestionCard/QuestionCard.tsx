"use client";
import React, { useState } from "react";

// components
import Card from "../Card/Card";
import QuestionView from "./QuestionView";
import QuestionEdit from "./QuestionEdit";

// model
import {
  QuestionWithAnswer,
  QuestionWithAnswerModel,
} from "../../model/QuestionModel";

export default function QuestionCard({
  question,
  currentUserId,
}: {
  question: QuestionWithAnswer;
  currentUserId: number;
}) {
  const [isEditting, setIsEditting] = useState(false);
  const isOwner = question.userId == currentUserId;

  async function handleSave(newContent: QuestionWithAnswer) {
    if (!confirm("Save this edit?")) {
      return;
    }

    const newContentJson = JSON.stringify(newContent);
    console.log(question.questionId);
    console.log(newContentJson);

    await fetch(`http://localhost:3000/api/questions/${question.questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: newContentJson,
    });

    setIsEditting(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this question?")) {
      return;
    }

    await fetch(`http://localhost:3000/api/questions/${question.questionId}`, {
      method: "DELETE",
    });
  }

  if (isEditting) {
    return (
      <QuestionEdit
        question={question}
        onSave={handleSave}
        onCancel={() => setIsEditting(false)}
      />
    );
  }

  return (
    <QuestionView
      question={question}
      isOwner={isOwner}
      onEdit={() => setIsEditting(true)}
      onDelete={handleDelete}
    />
  );
}
