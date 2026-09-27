import { BookOpen, Flame, Star } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#c4a46a]/10 font-display text-2xl text-[#c4a46a]">
              D
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
                Reader
              </p>

              <h1 className="mt-2 font-display text-4xl">
                Denim
              </h1>

              <p className="mt-2 text-sm text-white/30">
                Building a library one story at a time.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8">
            <Stat icon={<BookOpen />} value="24" label="Books" />
            <Stat icon={<Star />} value="18" label="Reviews" />
            <Stat icon={<Flame />} value="12" label="Streak" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-9 items-center justify-center text-[#c4a46a]">
        {icon}
      </div>

      <p className="mt-2 font-display text-2xl">
        {value}
      </p>

      <p className="text-xs text-white/25">
        {label}
      </p>
    </div>
  );
}