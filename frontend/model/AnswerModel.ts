import { z } from "zod";

const AnswerModel = z.object({
  answerId: z.number(),
  content: z.string(),
  upVotes: z.number(),
  downVotes: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isAnonymous: z.boolean(),
  userId: z.number(),
});

type Answer = z.infer<typeof AnswerModel>;

export { AnswerModel };
export type { Answer };
