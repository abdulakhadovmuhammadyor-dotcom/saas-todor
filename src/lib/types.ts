export type LevelId = "beginner" | "intermediate" | "advanced" | "expert";
export type Plan = "free" | "pro";

export type ExerciseKind =
  | "quiz"
  | "task"
  | "grammar"
  | "spelling"
  | "speaking"
  | "listening"
  | "feedback";

export interface Level {
  id: LevelId;
  title: string;
  cefr: string;
  description: string;
  order: number;
}

export interface Topic {
  id: string;
  levelId: LevelId;
  title: string;
  description: string;
  pro: boolean;
}

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  hint?: string;
  targetPhrase?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  levelId: LevelId;
  title: string;
  description: string;
  pro: boolean;
  exercises: Exercise[];
}

export interface ProTokenPayload {
  anonId: string;
  customerId: string;
  subscriptionId: string;
  exp: number;
}
