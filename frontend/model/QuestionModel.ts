import { z } from "zod";

const QuestionModel = z.object({
  questionId: z.number(),
  title: z.string(),
  content: z.string(),
  userId: z.number(),
  courseId: z.number(),
  viewCount: z.number(),
  upVotes: z.number(),
  downVotes: z.number(),
  isAnonymous: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type Question = z.infer<typeof QuestionModel>;

export { QuestionModel };
export type { Question };
