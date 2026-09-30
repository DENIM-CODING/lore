import type { Book } from "@/lib/api";

export const READING_STATUSES = [
  "WANT_TO_READ",
  "READING",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
] as const;

export type ReadingStatus =
  (typeof READING_STATUSES)[number];

export interface LibraryEntry {
  id: string;
  status: ReadingStatus;
  currentPage: number;
  startedAt: string | null;
  finishedAt: string | null;
  isFavorite: boolean;
  addedAt: string;
  updatedAt: string;
  userId: string;
  bookId: string;
  book: Book;
}