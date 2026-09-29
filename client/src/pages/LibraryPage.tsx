import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getUserLibrary } from "@/lib/api";
import { LibraryBookCard } from "@/components/library/LibraryBookCard";
import { LibraryBookSkeleton } from "@/components/library/LibraryBookSkeleton";

import type {
  LibraryEntry,
  ReadingStatus,
} from "@/types/library";

const shelves: {
  label: string;
  value: ReadingStatus | undefined;
}[] = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Want to Read",
    value: "WANT_TO_READ",
  },
  {
    label: "Reading",
    value: "READING",
  },
  {
    label: "On Hold",
    value: "ON_HOLD",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Dropped",
    value: "DROPPED",
  },
];

const emptyStates: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  ALL: {
    title: "Your library is empty.",
    description:
      "Books you add to your library will appear here.",
  },
  WANT_TO_READ: {
    title: "Your reading list is waiting.",
    description:
      "Save books you want to read and they'll appear here.",
  },
  READING: {
    title: "Nothing you're reading right now.",
    description:
      "Books you start reading will appear here.",
  },
  ON_HOLD: {
    title: "No books are on hold.",
    description:
      "Books you pause will appear here.",
  },
  COMPLETED: {
    title: "No completed books yet.",
    description:
      "Books you finish will appear here.",
  },
  DROPPED: {
    title: "No dropped books.",
    description:
      "Books you decide not to continue will appear here.",
  },
};

export default function LibraryPage() {
  const [library, setLibrary] =
    useState<LibraryEntry[]>([]);

  const [activeShelf, setActiveShelf] =
    useState<ReadingStatus | undefined>(
      undefined,
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const activeShelfKey =
    activeShelf ?? "ALL";

  const emptyState =
    emptyStates[activeShelfKey];

  /*
   * Debounce the search input so we do not
   * request the API on every keystroke.
   */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    async function loadLibrary() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getUserLibrary(
            activeShelf,
            search,
          );

        if (isMounted) {
          setLibrary(data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your library",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLibrary();

    return () => {
      isMounted = false;
    };
  }, [activeShelf, search]);

  const hasSearch = search.length > 0;

  return (
    <main className="min-h-screen px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c4a46a]">
            Your collection
          </p>

          <h1 className="mt-3 font-display text-4xl tracking-tight text-[#f5f2ea] sm:text-5xl">
            My Library
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
            Keep track of the books you want to
            read, are reading, and have finished.
          </p>
        </header>

        {/* Search */}
        <div className="relative mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

          <input
            type="search"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search your library..."
            aria-label="Search your library"
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-sm text-white/85 outline-none placeholder:text-white/25 transition-colors focus:border-[#c4a46a]/40 focus:bg-white/[0.04]"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear library search"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="mt-8 overflow-x-auto border-b border-white/[0.08]">
          <div className="flex min-w-max gap-7">
            {shelves.map((shelf) => {
              const isActive =
                activeShelf === shelf.value;

              return (
                <button
                  key={shelf.label}
                  type="button"
                  onClick={() =>
                    setActiveShelf(shelf.value)
                  }
                  className={`relative pb-4 text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-[#f5f2ea]"
                      : "text-white/40 hover:text-white/75"
                  }`}
                >
                  {shelf.label}

                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-px h-px bg-[#c4a46a]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <LibraryBookSkeleton
                    key={index}
                  />
                ),
              )}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-6">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : library.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] px-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <BookOpen className="size-5 text-white/30" />
              </div>

              <h2 className="mt-5 text-sm font-medium text-white/75">
                {hasSearch
                  ? "No books found."
                  : emptyState.title}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                {hasSearch
                  ? `No books in ${
                      activeShelfKey === "ALL"
                        ? "your library"
                        : "this shelf"
                    } match "${search}".`
                  : emptyState.description}
              </p>

              {hasSearch ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                  }}
                  className="mt-5 text-xs font-medium text-[#c4a46a] transition-colors hover:text-[#d8bd83]"
                >
                  Clear search
                </button>
              ) : (
                activeShelf === undefined && (
                  <Link
                    to="/discover"
                    className="mt-5 text-xs font-medium text-[#c4a46a] transition-colors hover:text-[#d8bd83]"
                  >
                    Discover books →
                  </Link>
                )
              )}
            </div>
          ) : (
            <div>
              <p className="mb-6 text-sm text-white/40">
                {library.length}{" "}
                {library.length === 1
                  ? "book"
                  : "books"}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {library.map((entry) => (
                  <LibraryBookCard
                    key={entry.id}
                    entry={entry}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}