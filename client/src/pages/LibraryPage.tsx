import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import { getUserLibrary } from "@/lib/api";
import { LibraryBookCard } from "@/components/library/LibraryBookCard";
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

export default function LibraryPage() {
  const [library, setLibrary] = useState<
    LibraryEntry[]
  >([]);

  const [activeShelf, setActiveShelf] =
    useState<ReadingStatus | undefined>(
      undefined,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLibrary() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getUserLibrary(activeShelf);

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
  }, [activeShelf]);

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

        <div className="mt-10 overflow-x-auto border-b border-white/[0.08]">
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
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-white/40">
                Loading your library...
              </p>
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
                Nothing here yet
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                Books you add to this shelf will
                appear here.
              </p>
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