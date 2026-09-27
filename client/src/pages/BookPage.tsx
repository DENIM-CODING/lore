import {
  ArrowLeft,
  Bookmark,
  Heart,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getBookByGoogleId,
  type Book,
} from "@/lib/api";

export default function BookPage() {
  const { externalId } = useParams<{
    externalId: string;
  }>();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBook() {
      if (!externalId) {
        setError("Book not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result =
          await getBookByGoogleId(externalId);

        setBook(result);
      } catch (error) {
        console.error("Failed to load book:", error);

        setError(
          "We couldn't load this book. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBook();
  }, [externalId]);

  if (isLoading) {
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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to discover
          </Link>

          <div className="mt-20 text-center">
            <h1 className="font-display text-3xl">
              Book not found
            </h1>

            <p className="mt-3 text-sm text-white/30">
              We couldn't find the book you're looking for.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const publishedYear = book.publishedAt
    ? new Date(book.publishedAt).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to discover
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
                    {book.externalRating.toFixed(1)}
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

            <div className="mt-9 flex flex-wrap gap-3">
              <button className="rounded-xl bg-[#f5f2ea] px-6 py-3 text-sm font-medium text-[#11110f]">
                Add to library
              </button>

              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Heart className="size-4" />
              </button>

              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Bookmark className="size-4" />
              </button>

              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            {/* Metadata */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              <Meta
                label="Published"
                value={book.publishedAt ?? "Unknown"}
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
                value={book.isbn ?? "Unknown"}
              />
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