import {
  ArrowLeft,
  Bookmark,
  Clock3,
  Heart,
  MoreHorizontal,
  Play,
  Square,
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
  removeBookFromLibrary,
  updateLibraryEntry,
  type Book,
  type ReadingSession,
} from "@/lib/api";

import type {
  LibraryEntry,
  ReadingStatus,
} from "@/types/library";

import {
  useReadingSession,
} from "@/context/ReadingSessionContext";

function formatReadingDate(
  date: string | null,
) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(date));
}

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

  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);

  const [showFinishSession, setShowFinishSession] = useState(false);

  const [finishPage, setFinishPage] = useState("");

  const {
    activeSession,
    sessionLoading,
    sessionActionLoading,
    startSession,
    finishSession,
    discardSession,
  } = useReadingSession();

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

//   useEffect(() => {
//   let isMounted = true;

//   async function loadActiveSession() {
//     try {
//       const session =
//         await getActiveReadingSession();

//       if (!isMounted) {
//         return;
//       }

//       setActiveSession(session);
//     } catch (error) {
//       if (!isMounted) {
//         return;
//       }

//       console.error(
//         "Failed to load active reading session:",
//         error,
//       );
//     } finally {
//       if (isMounted) {
//         setSessionLoading(false);
//       }
//     }
//   }

//   loadActiveSession();

//   return () => {
//     isMounted = false;
//   };
// }, []);

  const isCurrentBookSession = activeSession?.bookId === book?.id;

async function handleStartReadingSession() {
  if (
    !book ||
    !libraryEntry ||
    libraryEntry.status !== "READING" ||
    sessionLoading ||
    sessionActionLoading
  ) {
    return;
  }

  if (activeSession) {
    setActionError(
      activeSession.bookId === book.id
        ? "A reading session is already active for this book."
        : `You already have an active session for "${activeSession.book.title}".`,
    );

    return;
  }

  try {
    setActionError(null);

    await startSession(book.id);
  } catch (error) {
    console.error(
      "Failed to start reading session:",
      error,
    );

    setActionError(
      error instanceof Error
        ? error.message
        : "Failed to start reading session",
    );
  }
}


  async function handleRemoveFromLibrary() {
    if (
      !book ||
      !libraryEntry
    ) {
      return;
    }

    if (isCurrentBookSession) {
      setActionError(
        "Finish or discard your active reading session before removing this book.",
      );

      return;
    }

    try {
      setActionError(null);

      await removeBookFromLibrary(
        book.id,
      );

      setLibraryEntry(null);
    } catch (error) {
      console.error(
        "Failed to remove book from library:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to remove book from library",
      );
    }
  }

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

async function handleFinishReadingSession() {
  if (
    !activeSession ||
    !libraryEntry
  ) {
    return;
  }

  const parsedPage = Number(finishPage);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 0
  ) {
    setActionError(
      "Enter a valid ending page.",
    );

    return;
  }

  if (
    book?.pageCount !== null &&
    book?.pageCount !== undefined &&
    parsedPage > book.pageCount
  ) {
    setActionError(
      "Ending page cannot exceed the book's page count.",
    );

    return;
  }

  if (
    activeSession.startPage != null &&
    parsedPage < activeSession.startPage
  ) {
    setActionError(
      "Ending page cannot be before the session start page.",
    );

    return;
  }

  try {
    setActionError(null);

    const finishedSession =
      await finishSession(
        activeSession.id,
        parsedPage,
      );

    setShowFinishSession(false);
    setFinishPage("");

    if (finishedSession.endPage !== null) {
      setLibraryEntry((current) =>
        current
          ? {
              ...current,
              currentPage:
                finishedSession.endPage!,
            }
          : current,
      );
    }
  } catch (error) {
    console.error(
      "Failed to finish reading session:",
      error,
    );

    setActionError(
      error instanceof Error
        ? error.message
        : "Failed to finish reading session",
    );
  }
}


async function handleDiscardReadingSession() {
  if (!activeSession) {
    return;
  }

  const confirmed =
    window.confirm(
      "Discard this reading session? Your reading time and pages from this session will not be saved.",
    );

  if (!confirmed) {
    return;
  }

  try {
    setActionError(null);

    await discardSession(
      activeSession.id,
    );

    setShowFinishSession(false);
    setFinishPage("");
  } catch (error) {
    console.error(
      "Failed to discard reading session:",
      error,
    );

    setActionError(
      error instanceof Error
        ? error.message
        : "Failed to discard reading session",
    );
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

      if (
        isCurrentBookSession &&
        status !== "READING"
      ) {
        setActionError(
          "Finish or discard your active reading session before changing the reading status.",
        );

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

    async function handleFavoriteToggle() {
      if (
        !book ||
        !libraryEntry ||
        isUpdatingFavorite
      ) {
        return;
      }

      try {
        setIsUpdatingFavorite(true);
        setActionError(null);

        const updatedEntry =
          await updateLibraryEntry(
            book.id,
            {
              isFavorite:
                !libraryEntry.isFavorite,
            },
          );

        setLibraryEntry(updatedEntry);
      } catch (error) {
        console.error(
          "Failed to update favorite:",
          error,
        );

        setActionError(
          error instanceof Error
            ? error.message
            : "Failed to update favorite",
        );
      } finally {
        setIsUpdatingFavorite(false);
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
                      disabled={
                        isUpdatingStatus ||
                        isCurrentBookSession
                      }
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

                {libraryEntry?.status === "READING" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (isCurrentBookSession) {
                        setShowFinishSession(true);

                        setFinishPage(
                          libraryEntry.currentPage.toString(),
                        );

                        return;
                      }

                      handleStartReadingSession();
                    }}
                    disabled={
                      sessionLoading ||
                      sessionActionLoading ||
                      Boolean(
                        activeSession &&
                        !isCurrentBookSession,
                      )
                    }
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                      isCurrentBookSession
                        ? "border border-[#c4a46a]/30 bg-[#c4a46a]/10 text-[#c4a46a] hover:bg-[#c4a46a]/15"
                        : "bg-[#f5f2ea] text-[#11110f] hover:bg-white"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isCurrentBookSession ? (
                      <>
                        <Square className="size-3.5" />
                        Session active
                      </>
                    ) : activeSession ? (
                      "Another session active"
                    ) : (
                      <>
                        <Play className="size-3.5 fill-current" />
                        Start Reading
                      </>
                    )}
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  disabled={
                    !libraryEntry ||
                    isUpdatingFavorite
                  }
                  aria-label={
                    libraryEntry?.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  aria-pressed={
                    libraryEntry?.isFavorite ?? false
                  }
                  className={`flex size-11 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    libraryEntry?.isFavorite
                      ? "border-[#c4a46a]/30 bg-[#c4a46a]/10 text-[#c4a46a]"
                      : "border-white/[0.08] text-white/50 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Heart
                    className="size-4"
                    fill={
                      libraryEntry?.isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                <button
                  type="button"
                  aria-label="Bookmark book"
                  className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <Bookmark className="size-4" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    aria-label="More actions"
                    aria-expanded={moreOpen}
                    onClick={() =>
                      setMoreOpen((value) => !value)
                    }
                    className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>

                  {moreOpen && libraryEntry && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-48 rounded-xl border border-white/[0.08] bg-[#111113] p-1.5 shadow-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setMoreOpen(false);
                          handleRemoveFromLibrary();
                        }}
                        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-red-300/80 transition-colors hover:bg-red-400/[0.06] hover:text-red-300"
                      >
                        Remove from library
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {actionError && (
                <p className="mt-3 text-sm text-red-300">
                  {actionError}
                </p>
              )}
            </div>

            {isCurrentBookSession && activeSession ? (
            <ActiveReadingSession
              session={activeSession}
              showFinishSession={showFinishSession}
              finishPage={finishPage}
              onFinishPageChange={setFinishPage}
              onFinish={() => {
                setActionError(null);
                setShowFinishSession(true);

                setFinishPage(
                  libraryEntry?.currentPage.toString() ??
                    activeSession.startPage?.toString() ??
                    "0",
                );
              }}
              onConfirmFinish={handleFinishReadingSession}
              onDiscard={handleDiscardReadingSession}
              isLoading={sessionActionLoading}
            />
          ) : null}


            {/* Reading progress */}
            {libraryEntry &&
              libraryEntry.status === "READING" &&
              book.pageCount ? (
                <>
                  <ReadingProgress
                    currentPage={libraryEntry.currentPage}
                    pageCount={book.pageCount}
                    onUpdate={handleProgressChange}
                    onComplete={() =>
                      handleStatusChange("COMPLETED")
                    }
                    isUpdating={isUpdatingProgress}
                    isCompleting={isUpdatingStatus}
                  />

                  <ReadingDates
                    startedAt={libraryEntry.startedAt}
                    finishedAt={libraryEntry.finishedAt}
                  />
                </>
              ) : null}

            {libraryEntry &&
              libraryEntry.status === "COMPLETED" ? (
                <ReadingDates
                  startedAt={libraryEntry.startedAt}
                  finishedAt={libraryEntry.finishedAt}
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


function ReadingDates({
  startedAt,
  finishedAt,
}: {
  startedAt: string | null;
  finishedAt: string | null;
}) {
  const startedDate =
    formatReadingDate(startedAt);

  const finishedDate =
    formatReadingDate(finishedAt);

  if (!startedDate && !finishedDate) {
    return null;
  }

  return (
    <div className="mt-4 grid max-w-2xl grid-cols-2 gap-3">
      {startedDate ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
            Started
          </p>

          <p className="mt-1.5 text-sm text-white/65">
            {startedDate}
          </p>
        </div>
      ) : null}

      {finishedDate ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
            Finished
          </p>

          <p className="mt-1.5 text-sm text-white/65">
            {finishedDate}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ReadingProgress({
  currentPage,
  pageCount,
  onUpdate,
  onComplete,
  isUpdating,
  isCompleting,
}: {
  currentPage: number;
  pageCount: number;
  onUpdate: (currentPage: number) => void;
  onComplete: () => void;
  isUpdating: boolean;
  isCompleting: boolean;
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
      {currentPage === pageCount && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#c4a46a]/15 bg-[#c4a46a]/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#f5f2ea]">
              You've reached the end.
            </p>

            <p className="mt-1 text-xs text-white/35">
              Mark this book as completed when you're finished.
            </p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            disabled={isCompleting}
            className="shrink-0 rounded-lg bg-[#c4a46a] px-4 py-2 text-xs font-medium text-[#11110f] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCompleting
              ? "Finishing..."
              : "Mark as completed"}
          </button>
        </div>
      )}
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


function ActiveReadingSession({
  session,
  showFinishSession,
  finishPage,
  onFinishPageChange,
  onFinish,
  onConfirmFinish,
  onDiscard,
  isLoading,
}: {
  session: ReadingSession;
  showFinishSession: boolean;
  finishPage: string;
  onFinishPageChange: (value: string) => void;
  onFinish: () => void;
  onConfirmFinish: () => void;
  onDiscard: () => void;
  isLoading: boolean;
}) {
  const [elapsedSeconds, setElapsedSeconds] =
    useState(() =>
      Math.max(
        0,
        Math.floor(
          (Date.now() -
            new Date(
              session.startedAt,
            ).getTime()) /
            1000,
        ),
      ),
    );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              new Date(
                session.startedAt,
              ).getTime()) /
              1000,
          ),
        ),
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [session.startedAt]);

  const hours = Math.floor(
    elapsedSeconds / 3600,
  );

  const minutes = Math.floor(
    (elapsedSeconds % 3600) / 60,
  );

  const seconds =
    elapsedSeconds % 60;

  const formattedTime =
    hours > 0
      ? `${hours}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

  return (
    <div className="mt-8 max-w-2xl overflow-hidden rounded-2xl border border-[#c4a46a]/20 bg-[#c4a46a]/[0.05]">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#c4a46a]/10 text-[#c4a46a]">
            <Clock3 className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-white/85">
              Reading session
            </p>

            <p className="mt-0.5 text-xs text-white/35">
              Currently reading
            </p>
          </div>
        </div>

        <div className="font-mono text-lg tabular-nums text-[#c4a46a]">
          {formattedTime}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
            Started at
          </p>

          <p className="mt-1.5 text-sm text-white/65">
            {new Date(
              session.startedAt,
            ).toLocaleTimeString(
              undefined,
              {
                hour: "numeric",
                minute: "2-digit",
              },
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
            Starting page
          </p>

          <p className="mt-1.5 text-sm text-white/65">
            {session.startPage ?? "—"}
          </p>
        </div>
      </div>

      {showFinishSession ? (
        <div className="border-t border-white/[0.06] px-5 py-5">
          <p className="text-sm font-medium text-white/80">
            Finish reading session
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Enter the page you reached. Your session
            duration and pages read will be saved.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min={session.startPage ?? 0}
              value={finishPage}
              onChange={(event) =>
                onFinishPageChange(
                  event.target.value,
                )
              }
              disabled={isLoading}
              placeholder="Ending page"
              className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#c4a46a]/40"
            />

            <button
              type="button"
              onClick={onConfirmFinish}
              disabled={isLoading}
              className="rounded-xl bg-[#f5f2ea] px-5 py-3 text-sm font-medium text-[#11110f] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : "Finish Session"}
            </button>
          </div>

          <button
            type="button"
            onClick={onDiscard}
            disabled={isLoading}
            className="mt-3 text-xs text-red-300/60 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Discard session
          </button>
        </div>
      ) : (
        <div className="border-t border-white/[0.06] px-5 py-4">
          <button
            type="button"
            onClick={onFinish}
            disabled={isLoading}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finish Session
          </button>
        </div>
      )}
    </div>
  );
}