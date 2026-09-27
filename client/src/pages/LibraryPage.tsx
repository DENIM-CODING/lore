import { BookOpen, Check, Clock3, Pause, Plus, X } from "lucide-react";
import { useState } from "react";

const tabs = [
  { label: "All", icon: BookOpen },
  { label: "Want to Read", icon: Clock3 },
  { label: "Reading", icon: BookOpen },
  { label: "On Hold", icon: Pause },
  { label: "Completed", icon: Check },
  { label: "Dropped", icon: X },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
            Your collection
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-5xl tracking-[-0.03em]">
                My Library
              </h1>

              <p className="mt-4 text-sm text-white/30">
                0 books in your personal collection.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#f5f2ea] px-4 py-3 text-sm font-medium text-[#11110f]">
              <Plus className="size-4" />
              Add a book
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex gap-2 overflow-x-auto border-b border-white/[0.06] pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs transition-colors ${
                  activeTab === tab.label
                    ? "bg-white/[0.07] text-white"
                    : "text-white/30 hover:bg-white/[0.03] hover:text-white/70"
                }`}
              >
                <Icon className="size-3.5" />

                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
            <BookOpen className="size-6 text-[#c4a46a]" />
          </div>

          <h2 className="mt-6 font-display text-2xl text-white/85">
            Your shelf is waiting.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/25">
            Books you add to Lore will appear here. Start exploring and build a
            collection that feels like yours.
          </p>

          <button className="mt-7 rounded-xl border border-white/[0.08] px-5 py-3 text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white">
            Discover books
          </button>
        </div>
      </main>
    </div>
  );
}