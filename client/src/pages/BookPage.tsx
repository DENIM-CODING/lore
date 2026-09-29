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
  addBookToLibrary,
  getBookByGoogleId,
  getBookById,
  getLibraryEntry,
  updateLibraryEntry,
  type Book,
} from "@/lib/api";
import type {
  LibraryEntry,
  ReadingStatus,
} from "@/types/library";

export default function BookPage() {
  const {
    id,
    externalId,
  } = useParams<{
    id?: string;
    externalId?: string;
  }>();

  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const [book, setBook] = useState<Book | null>(null);

  const [libraryEntry, setLibraryEntry] = useState<LibraryEntry | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

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

  async function handleProgressChange(
  currentPage: number,
) {
    if (
      !book ||
      !libraryEntry ||
      isUpdatingProgress
    ) {
      return;
    }

    if (
      currentPage === libraryEntry.currentPage
    ) {
      return;
    }

    try {
      setIsUpdatingProgress(true);
      setActionError(null);

      const updatedEntry =
        await updateLibraryEntry(
          book.id,
          { currentPage },
        );

      setLibraryEntry(updatedEntry);
    } catch (error) {
      console.error(
        "Failed to update reading progress:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update reading progress",
      );
    } finally {
      setIsUpdatingProgress(false);
    }
  }


    async function handleStatusChange(
      status: ReadingStatus,
    ) {
      if (
        !libraryEntry ||
        isUpdatingStatus ||
        status === libraryEntry.status
      ) {
        return;
      }

      try {
        setIsUpdatingStatus(true);
        setActionError(null);

        const updatedEntry =
          await updateLibraryEntry(
            book!.id,
            { status },
          );

        setLibraryEntry(updatedEntry);
      } catch (error) {
        console.error(
          "Failed to update reading status:",
          error,
        );

        setActionError(
          error instanceof Error
            ? error.message
            : "Failed to update reading status",
        );
      } finally {
        setIsUpdatingStatus(false);
      }
    }

  async function handleAddToLibrary() {
    if (!book || libraryEntry || isAddingToLibrary) {
      return;
    }

    try {
      setIsAddingToLibrary(true);
      setActionError(null);

      const entry = await addBookToLibrary(
        book.id,
      );

      setLibraryEntry(entry);
    } catch (error) {
      console.error(
        "Failed to add book to library:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to add book to library",
      );
    } finally {
      setIsAddingToLibrary(false);
    }
  }

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
            <div className="mt-9">
              <div className="flex flex-wrap gap-3">
                {libraryEntry ? (
                  <div className="relative">
                    <select
                      value={libraryEntry.status}
                      onChange={(event) =>
                        handleStatusChange(
                          event.target.value as ReadingStatus,
                        )
                      }
                      disabled={isUpdatingStatus}
                      aria-label="Reading status"
                      className="appearance-none rounded-xl border border-[#c4a46a]/20 bg-[#c4a46a]/10 px-6 py-3 pr-10 text-sm font-medium text-[#c4a46a] outline-none transition-all hover:border-[#c4a46a]/35 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="WANT_TO_READ">
                        Want to Read
                      </option>

                      <option value="READING">
                        Reading
                      </option>

                      <option value="ON_HOLD">
                        On Hold
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="DROPPED">
                        Dropped
                      </option>
                    </select>

                    {isUpdatingStatus && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                        ...
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToLibrary}
                    disabled={isAddingToLibrary}
                    className="rounded-xl bg-[#f5f2ea] px-6 py-3 text-sm font-medium text-[#11110f] transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAddingToLibrary
                      ? "Adding..."
                      : "Add to library"}
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

              {actionError && (
                <p className="mt-3 text-sm text-red-300">
                  {actionError}
                </p>
              )}
            </div>


            {/* Reading progress */}
            {libraryEntry &&
              libraryEntry.status ===
                "READING" &&
              book.pageCount ? (
              <ReadingProgress
                currentPage={libraryEntry.currentPage}
                pageCount={book.pageCount}
                onUpdate={handleProgressChange}
                isUpdating={isUpdatingProgress}
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

// function getStatusLabel(
//   status: LibraryEntry["status"],
// ) {
//   switch (status) {
//     case "WANT_TO_READ":
//       return "Want to Read";

//     case "READING":
//       return "Reading";

//     case "ON_HOLD":
//       return "On Hold";

//     case "COMPLETED":
//       return "Completed";

//     case "DROPPED":
//       return "Dropped";
//   }
// }

function ReadingProgress({
  currentPage,
  pageCount,
  onUpdate,
  isUpdating,
}: {
  currentPage: number;
  pageCount: number;
  onUpdate: (currentPage: number) => void;
  isUpdating: boolean;
}) {
  const [page, setPage] =
    useState(currentPage.toString());

  useEffect(() => {
    setPage(currentPage.toString());
  }, [currentPage]);

  const percentage = Math.min(
    100,
    Math.round(
      (currentPage / pageCount) * 100,
    ),
  );

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const parsedPage = Number(page);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 0
    ) {
      return;
    }

    onUpdate(parsedPage);
  }

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

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center justify-between gap-4"
      >
        <p className="text-xs text-white/30">
          {currentPage} of {pageCount} pages
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="current-page"
            className="sr-only"
          >
            Current page
          </label>

          <input
            id="current-page"
            type="number"
            min={0}
            max={pageCount}
            value={page}
            onChange={(event) =>
              setPage(event.target.value)
            }
            disabled={isUpdating}
            className="w-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-right text-xs text-white/80 outline-none transition-colors focus:border-[#c4a46a]/40 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={
              isUpdating ||
              Number(page) === currentPage
            }
            className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating
              ? "Saving..."
              : "Update"}
          </button>
        </div>
      </form>
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