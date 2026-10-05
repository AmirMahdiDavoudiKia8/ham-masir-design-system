"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MatchQuizAnswers {
  track: string;
  goal: string;
  distraction: string;
  mainProblem: string;
  studyTime: string;
  wastedTime: string;
}

const EMPTY_ANSWERS: MatchQuizAnswers = {
  track: "",
  goal: "",
  distraction: "",
  mainProblem: "",
  studyTime: "",
  wastedTime: "",
};

/**
 * "هدفت بیشتر چیه؟" is the one quiz question that maps to a rank filter
 * instead of (or alongside) a mentor tag: wanting a top/specific university
 * means wanting a mentor who actually got a top rank, and "قبولی در هر
 * شرایطی" is the opposite signal — a rank that isn't necessarily elite still
 * counts as a real, relatable success story. "رشته‌ی خاص" alone says nothing
 * about rank, so it's left unfiltered.
 */
export function goalToRankFilter(goal: string): { rankMin?: number; rankMax?: number } {
  if (goal === "دانشگاه برتر" || goal === "دانشگاه و رتبه خاص") return { rankMax: 999 };
  if (goal === "قبولی در هر شرایطی") return { rankMin: 1000 };
  return {};
}

interface MatchQuizState {
  answers: MatchQuizAnswers;
  setAnswers: (answers: MatchQuizAnswers) => void;
}

/**
 * Answers to the "چند سؤال کوتاه، یه لیست دقیق" match quiz (MatchQuizFlow),
 * reached from the mentors list. `track` (forwarded to
 * /student/discover?track=...), `goal` (via goalToRankFilter), and
 * `mainProblem`/`distraction` (matched against each mentor's own
 * Mentor.matchTags — see lib/mentorFilters) all drive real filtering on
 * /student/discover once the quiz is done. `studyTime`/`wastedTime` are
 * persisted here rather than thrown away — no mentor's bio addresses either,
 * so there's nothing honest to tag them against yet — so a future matching
 * pass (or a "دوباره پرشون کن" on the profile screen) has them to read.
 */
export const useMatchQuizStore = create<MatchQuizState>()(
  persist(
    (set) => ({
      answers: EMPTY_ANSWERS,
      setAnswers: (answers) => set({ answers }),
    }),
    { name: "hammasir-match-quiz" },
  ),
);
