import {
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

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

const books = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    rating: 4.2,
    pages: 304,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "2",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    rating: 4.7,
    pages: 662,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    rating: 4.6,
    pages: 688,
    cover:
      "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "4",
    title: "The Secret History",
    author: "Donna Tartt",
    genre: "Mystery",
    rating: 4.4,
    pages: 559,
    cover:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "5",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    rating: 4.1,
    pages: 180,
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "6",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    rating: 4.8,
    pages: 432,
    cover:
      "https://images.unsplash.com/photo-1518373714866-3f1472890ccf?auto=format&fit=crop&w=700&q=85",
  },
];

export default function DiscoverPage() {
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
            Search millions of books, explore new worlds, and discover stories
            that deserve a place on your shelf.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mt-10 max-w-3xl">
          <div className="flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 transition-colors focus-within:border-[#c4a46a]/30">
            <Search className="ml-4 size-5 text-white/25" />

            <input
              placeholder="Search books, authors, ISBN..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
            />

            <button className="rounded-xl bg-[#f5f2ea] px-5 py-3 text-sm font-medium text-[#11110f]">
              Search
            </button>
          </div>
        </div>

        {/* Genre filters */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {genres.map((genre, index) => (
            <button
              key={genre}
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
              Curated for you
            </p>

            <h2 className="mt-2 font-display text-2xl text-white/90">
              Stories worth discovering
            </h2>
          </div>

          <button className="hidden items-center gap-2 text-sm text-white/30 hover:text-white sm:flex">
            View all
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Books */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {books.map((book, index) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.03]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <button className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-xl bg-white/90 py-2.5 text-xs font-medium text-black opacity-0 backdrop-blur-md transition-all group-hover:translate-y-0 group-hover:opacity-100">
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
                  <span className="text-[10px] uppercase tracking-wider text-white/20">
                    {book.genre}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-[#c4a46a]">
                    <Star className="size-3 fill-current" />
                    {book.rating}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}