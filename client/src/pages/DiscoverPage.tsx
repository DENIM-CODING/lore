import {
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { searchBooks, type Book } from "@/lib/api";

const genres = [
  "All",
  "Fantasy",
  "Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "History",
];

export default function DiscoverPage() {
  
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const results = await searchBooks(trimmedQuery);

      setBooks(results);
    } catch (error) {
      console.error("Book search failed:", error);

      setBooks([]);
      setError(
        "Something went wrong while searching. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    handleSearch();
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-2 text-[#c4a46a]">
            <Sparkles className="size-4" />

            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Discover
            </span>
          </div>

          <h1 className="font-display text-5xl tracking-[-0.03em] sm:text-6xl">
            Find your next
            <br />
            <span className="text-[#c4a46a]">great story.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/35 sm:text-base">
            Search millions of books, explore new worlds, and
            discover stories that deserve a place on your shelf.
          </p>
        </motion.div>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-3xl"
        >
          <div className="flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 transition-colors focus-within:border-[#c4a46a]/30">
            <Search className="ml-4 size-5 shrink-0 text-white/25" />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search books, authors, ISBN..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="rounded-xl bg-[#f5f2ea] px-5 py-3 text-sm font-medium text-[#11110f] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Genre filters */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {genres.map((genre, index) => (
            <button
              key={genre}
              type="button"
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-colors ${
                index === 0
                  ? "border-[#c4a46a]/30 bg-[#c4a46a]/10 text-[#c4a46a]"
                  : "border-white/[0.07] text-white/35 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Section heading */}
        <div className="mt-16 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/20">
              {query.trim() ? "Search results" : "Discover"}
            </p>

            <h2 className="mt-2 font-display text-2xl text-white/90">
              {query.trim()
                ? `Stories matching "${query}"`
                : "Find something you'll love"}
            </h2>
          </div>

          {books.length > 0 && (
            <button
              type="button"
              className="hidden items-center gap-2 text-sm text-white/30 hover:text-white sm:flex"
            >
              View all
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/[0.04] px-5 py-4 text-sm text-red-300/70"
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] rounded-2xl bg-white/[0.04]" />

                <div className="mt-4 h-4 w-4/5 rounded bg-white/[0.05]" />

                <div className="mt-2 h-3 w-3/5 rounded bg-white/[0.04]" />

                <div className="mt-3 h-3 w-2/5 rounded bg-white/[0.03]" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          query.trim() &&
          books.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-20 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#c4a46a]/10">
                <BookOpen className="size-6 text-[#c4a46a]/70" />
              </div>

              <h3 className="mt-5 font-display text-2xl text-white/80">
                No stories found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                We couldn't find any books matching your search.
                Try a different title, author, or ISBN.
              </p>
            </motion.div>
          )}

        {/* Initial state */}
        {!isLoading &&
          !error &&
          !query.trim() &&
          books.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-20 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#c4a46a]/10">
                <Search className="size-6 text-[#c4a46a]/70" />
              </div>

              <h3 className="mt-5 font-display text-2xl text-white/80">
                What are you in the mood for?
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                Search for a book, author, or ISBN and we'll
                bring the story to you.
              </p>
            </motion.div>
          )}

        {/* Books */}
        {!isLoading && books.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {books.map((book, index) => (
              <motion.article
                key={book.externalId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
                className="group"
              >
                <Link
                  to={`/book/google/${book.externalId}`}
                  className="block cursor-pointer"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.03]">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white/[0.03] px-5 text-center">
                        <BookOpen className="size-8 text-white/10" />

                        <span className="text-xs text-white/20">
                          No cover available
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-white/90 py-2.5 text-xs font-medium text-black opacity-0 backdrop-blur-md transition-all group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      Add to library
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="truncate text-sm font-medium text-white/85">
                      {book.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-white/30">
                      {book.author}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="truncate pr-2 text-[10px] uppercase tracking-wider text-white/20">
                        {book.pageCount
                          ? `${book.pageCount} pages`
                          : "Book"}
                      </span>

                      {book.externalRating ? (
                        <span className="flex shrink-0 items-center gap-1 text-[11px] text-[#c4a46a]">
                          <Star className="size-3 fill-current" />
                          {book.externalRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/20">
                          No rating
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}