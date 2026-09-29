import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import type { LibraryEntry } from "@/types/library";

interface LibraryBookCardProps {
  entry: LibraryEntry;
}

function getProgress(entry: LibraryEntry): number {
  if (!entry.book.pageCount) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (entry.currentPage /
        entry.book.pageCount) *
        100,
    ),
  );
}

function getStatusLabel(
  status: LibraryEntry["status"],
): string {
  switch (status) {
    case "WANT_TO_READ":
      return "Want to Read";

    case "READING":
      return "Reading";

    case "ON_HOLD":
      return "On Hold";

    case "COMPLETED":
      return "Completed";

    case "DROPPED":
      return "Dropped";
  }
}

export function LibraryBookCard({
  entry,
}: LibraryBookCardProps) {
  const progress = getProgress(entry);

  return (
    <article className="group min-w-0">
      <Link
        to={`/book/${entry.book.id}`}
        className="block"
        aria-label={`View ${entry.book.title}`}
      >
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {entry.book.coverUrl ? (
            <img
              src={entry.book.coverUrl}
              alt={entry.book.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="size-8 text-white/20" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {entry.status === "READING" &&
            entry.book.pageCount && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-[#c4a46a]"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-1.5 text-[11px] text-white/70">
                  {entry.currentPage} /{" "}
                  {entry.book.pageCount} pages
                </p>
              </div>
            )}
        </div>

        {/* Book information */}
        <h2 className="mt-4 truncate text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-white">
          {entry.book.title}
        </h2>

        <p className="mt-1 truncate text-xs text-white/35">
          {entry.book.author}
        </p>

        {/* Status */}
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span
            className={
              entry.status === "READING"
                ? "text-[#c4a46a]"
                : entry.status === "COMPLETED"
                  ? "text-white/45"
                  : "text-white/30"
            }
          >
            {getStatusLabel(entry.status)}
          </span>

          {entry.status === "READING" &&
            entry.book.pageCount && (
              <>
                <span className="text-white/15">
                  ·
                </span>

                <span className="text-white/25">
                  {progress}%
                </span>
              </>
            )}
        </div>

        {/* Reading progress */}
        {entry.status === "READING" &&
          entry.book.pageCount && (
            <div className="mt-3">
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-[#c4a46a] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
      </Link>
    </article>
  );
}