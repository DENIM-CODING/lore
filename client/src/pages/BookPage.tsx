import {
  ArrowLeft,
  Bookmark,
  Heart,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getBookByGoogleId,
  getBookById,
  getLibraryEntry,
  type Book,
} from "@/lib/api";

import type { LibraryEntry } from "@/types/library";

export default function BookPage() {
  const {
    id,
    externalId,
  } = useParams<{
    id?: string;
    externalId?: string;
  }>();

  const [book, setBook] =
    useState<Book | null>(null);

  const [libraryEntry, setLibraryEntry] =
    useState<LibraryEntry | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBook() {
      if (!id && !externalId) {
        setError("Book not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        /*
         * Load the actual book independently
         * from the user's library state.
         */
        const loadedBook = id
          ? await getBookById(id)
          : await getBookByGoogleId(
              externalId!,
            );

        if (!isMounted) {
          return;
        }

        setBook(loadedBook);

        /*
         * Library membership is separate from
         * book information.
         *
         * A 404 simply means the user hasn't
         * added this book to their library.
         */
        if (loadedBook.id) {
          const entry =
            await getLibraryEntry(
              loadedBook.id,
            );

          if (isMounted) {
            setLibraryEntry(entry);
          }
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Failed to load book:",
          error,
        );

        setError(
          "We couldn't load this book. Please try again.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id, externalId]);

  if (isLoading) {
    return (
      <BookPageSkeleton />
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <Link
            to={
              id
                ? "/library"
                : "/discover"
            }
            className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />

            {id
              ? "Back to library"
              : "Back to discover"}
          </Link>

          <div className="mt-20 text-center">
            <h1 className="font-display text-3xl">
              Book not found
            </h1>

            <p className="mt-3 text-sm text-white/30">
              We couldn't find the book you're
              looking for.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const publishedYear =
    book.publishedAt
      ? new Date(
          book.publishedAt,
        ).getFullYear()
      : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <Link
          to={
            id
              ? "/library"
              : "/discover"
          }
          className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />

          {id
            ? "Back to library"
            : "Back to discover"}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Cover */}
          <div>
            <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.03]">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/20">
                  No cover available
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
              Book
            </p>

            <h1 className="mt-4 font-display text-5xl leading-tight tracking-[-0.03em] sm:text-6xl">
              {book.title}
            </h1>

            <p className="mt-3 text-lg text-white/35">
              {book.author}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
              {book.externalRating ? (
                <>
                  <span className="flex items-center gap-1.5 text-[#c4a46a]">
                    <Star className="size-4 fill-current" />
                    {book.externalRating.toFixed(
                      1,
                    )}
                  </span>

                  <span className="text-white/20">
                    •
                  </span>
                </>
              ) : null}

              {book.pageCount ? (
                <>
                  <span className="text-white/35">
                    {book.pageCount} pages
                  </span>

                  <span className="text-white/20">
                    •
                  </span>
                </>
              ) : null}

              {publishedYear ? (
                <span className="text-white/35">
                  {publishedYear}
                </span>
              ) : null}
            </div>

            {book.description && (
              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/40">
                {book.description}
              </p>
            )}

            {/* Library actions */}
            <div className="mt-9 flex flex-wrap gap-3">
              {libraryEntry ? (
                <div className="rounded-xl border border-[#c4a46a]/20 bg-[#c4a46a]/10 px-6 py-3 text-sm font-medium text-[#c4a46a]">
                  {getStatusLabel(
                    libraryEntry.status,
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="rounded-xl bg-[#f5f2ea] px-6 py-3 text-sm font-medium text-[#11110f] transition-colors hover:bg-white"
                >
                  Add to library
                </button>
              )}

              <button
                type="button"
                aria-label="Add to favorites"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Heart className="size-4" />
              </button>

              <button
                type="button"
                aria-label="Bookmark book"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Bookmark className="size-4" />
              </button>

              <button
                type="button"
                aria-label="More actions"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            {/* Reading progress */}
            {libraryEntry &&
              libraryEntry.status ===
                "READING" &&
              book.pageCount ? (
              <ReadingProgress
                currentPage={
                  libraryEntry.currentPage
                }
                pageCount={
                  book.pageCount
                }
              />
            ) : null}

            {/* Metadata */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              <Meta
                label="Published"
                value={
                  book.publishedAt
                    ? new Date(
                        book.publishedAt,
                      ).toLocaleDateString()
                    : "Unknown"
                }
              />

              <Meta
                label="Pages"
                value={
                  book.pageCount
                    ? book.pageCount.toString()
                    : "Unknown"
                }
              />

              <Meta
                label="Language"
                value={
                  book.language?.toUpperCase() ??
                  "Unknown"
                }
              />

              <Meta
                label="ISBN"
                value={
                  book.isbn ?? "Unknown"
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getStatusLabel(
  status: LibraryEntry["status"],
) {
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

function ReadingProgress({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  const percentage = Math.min(
    100,
    Math.round(
      (currentPage / pageCount) * 100,
    ),
  );

  return (
    <div className="mt-8 max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">
          Reading progress
        </p>

        <p className="text-sm text-[#c4a46a]">
          {percentage}%
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-[#c4a46a] transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-white/30">
        {currentPage} of {pageCount} pages
      </p>
    </div>
  );
}

function BookPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded bg-white/[0.05]" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div className="aspect-[2/3] rounded-2xl bg-white/[0.04]" />

            <div className="flex flex-col justify-center">
              <div className="h-3 w-20 rounded bg-white/[0.05]" />

              <div className="mt-5 h-16 max-w-xl rounded bg-white/[0.05]" />

              <div className="mt-4 h-5 w-40 rounded bg-white/[0.04]" />

              <div className="mt-8 h-5 w-72 rounded bg-white/[0.04]" />

              <div className="mt-8 h-24 max-w-2xl rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-2 truncate text-xs text-white/60">
        {value}
      </p>
    </div>
  );
}