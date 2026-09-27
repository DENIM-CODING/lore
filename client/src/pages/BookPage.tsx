import {
  ArrowLeft,
  Bookmark,
  Heart,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BookPage() {
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
            <div className="aspect-[2/3] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=90"
                alt="The Midnight Library"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
              Fiction
            </p>

            <h1 className="mt-4 font-display text-5xl leading-tight tracking-[-0.03em] sm:text-6xl">
              The Midnight Library
            </h1>

            <p className="mt-3 text-lg text-white/35">
              Matt Haig
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-[#c4a46a]">
                <Star className="size-4 fill-current" />
                4.2
              </span>

              <span className="text-white/20">•</span>

              <span className="text-white/35">
                304 pages
              </span>

              <span className="text-white/20">•</span>

              <span className="text-white/35">
                2020
              </span>
            </div>

            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/40">
              Between life and death there is a library, and within that
              library, the shelves go on forever. The Midnight Library explores
              the infinite possibilities of the lives we might have lived.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button className="rounded-xl bg-[#f5f2ea] px-6 py-3 text-sm font-medium text-[#11110f]">
                Add to library
              </button>

              <button className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white">
                <Heart className="size-4" />
              </button>

              <button className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white">
                <Bookmark className="size-4" />
              </button>

              <button className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white">
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            {/* Metadata */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              <Meta label="Published" value="2020" />
              <Meta label="Pages" value="304" />
              <Meta label="Language" value="English" />
              <Meta label="ISBN" value="9780525559474" />
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