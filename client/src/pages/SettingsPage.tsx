import { Bell, Moon, Shield, User } from "lucide-react";

const settings = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your name, bio, and profile information.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Choose when Lore should remind you about your reading.",
  },
  {
    icon: Moon,
    title: "Appearance",
    description: "Customize the look and feel of your reading space.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "Control what other readers can see.",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f5f2ea]">
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#c4a46a]">
          Preferences
        </p>

        <h1 className="mt-3 font-display text-5xl">
          Settings
        </h1>

        <div className="mt-12 space-y-3">
          {settings.map((setting) => {
            const Icon = setting.icon;

            return (
              <button
                key={setting.title}
                className="flex w-full items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c4a46a]/10">
                  <Icon className="size-5 text-[#c4a46a]" />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-white/80">
                    {setting.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/25">
                    {setting.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}