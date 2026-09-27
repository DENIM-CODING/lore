import { motion } from "motion/react";
import {
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[450px] -translate-x-1/2 rounded-full bg-[#c4a46a]/[0.06] blur-[120px] sm:size-[600px]" />

      {/* Fine grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2"
          >
            <Sparkles className="size-3.5 text-[#c4a46a]" />

            <span className="text-xs font-medium tracking-wide text-white/55">
              Your personal reading universe
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-balance font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#f5f2ea] sm:text-6xl lg:text-8xl"
          >
            Every story
            <br />
            <span className="text-[#c4a46a]">
              leaves a mark.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-white/40 sm:text-lg"
          >
            Discover books, build your personal library,
            track every chapter, and turn your reading
            journey into something worth remembering.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="group flex items-center rounded-2xl border border-white/[0.1] bg-white/[0.035] p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors duration-300 focus-within:border-[#c4a46a]/30">
              <Search className="ml-4 size-5 shrink-0 text-white/25" />

              <input
                type="text"
                placeholder="Search for a book, author, or ISBN..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 sm:text-base"
              />

              <button className="hidden items-center gap-2 rounded-xl bg-[#f5f2ea] px-5 py-3 text-sm font-medium text-[#11110f] transition-transform duration-300 hover:scale-[1.02] sm:flex">
                Search
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>

          {/* Search suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/20"
          >
            <span>Try</span>

            <Suggestion>fantasy</Suggestion>

            <span>·</span>

            <Suggestion>mystery</Suggestion>

            <span>·</span>

            <Suggestion>science fiction</Suggestion>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-3 border-y border-white/[0.07] py-7"
        >
          <HeroStat
            value="10M+"
            label="Books to discover"
          />

          <HeroStat
            value="∞"
            label="Stories to explore"
            bordered
          />

          <HeroStat
            value="24/7"
            label="Your reading space"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Suggestion({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="text-white/40 underline decoration-white/10 underline-offset-4 transition-colors hover:text-white/70">
      {children}
    </button>
  );
}

function HeroStat({
  value,
  label,
  bordered = false,
}: {
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`text-center ${
        bordered ? "border-x border-white/[0.07]" : ""
      }`}
    >
      <p className="font-display text-2xl text-[#f5f2ea] sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/25 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}