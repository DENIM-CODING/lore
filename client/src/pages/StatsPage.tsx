import {
  BookOpen,
  Clock3,
  Flame,
  Library,
} from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "24",
    label: "Books read",
  },
  {
    icon: Library,
    value: "7,842",
    label: "Pages read",
  },
  {
    icon: Clock3,
    value: "91h",
    label: "Reading time",
  },
  {
    icon: Flame,
    value: "12",
    label: "Day streak",
  },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
          Your journey
        </p>

        <h1 className="mt-3 font-display text-5xl tracking-[-0.03em]">
          Reading statistics
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-white/30">
          A look back at the stories, pages, and moments that made up your
          reading year.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
              >
                <Icon className="size-5 text-[#c4a46a]" />

                <p className="mt-7 font-display text-4xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-white/25">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Reading activity */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="font-display text-2xl">
              Reading activity
            </h2>

            <div className="mt-10 flex h-56 items-end gap-2">
              {[35, 52, 42, 75, 48, 90, 62, 72, 45, 85, 68, 95].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-lg bg-[#c4a46a]/50 transition-colors group-hover:bg-[#c4a46a]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ),
              )}
            </div>

            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-wider text-white/20">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Goal */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/20">
              2026 goal
            </p>

            <div className="mt-5 flex items-end justify-between">
              <h2 className="font-display text-4xl">
                24
                <span className="text-white/20"> / 30</span>
              </h2>

              <span className="text-sm text-[#c4a46a]">
                80%
              </span>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[80%] rounded-full bg-[#c4a46a]" />
            </div>

            <p className="mt-5 text-sm leading-6 text-white/25">
              Six more books to reach your yearly reading goal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}