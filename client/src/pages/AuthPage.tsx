import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const isRegister = mode === "register";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register(
          name.trim(),
          trimmedEmail,
          password,
        );
      } else {
        await login(trimmedEmail, password);
      }

      navigate("/discover", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-28 sm:px-6">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[15%] top-[15%] size-72 rounded-full bg-[#c4a46a]/[0.045] blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] size-80 rounded-full bg-[#6e5aa0]/[0.035] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5"
          >
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#c4a46a]/20 bg-[#c4a46a]/10 transition-colors duration-300 group-hover:border-[#c4a46a]/30 group-hover:bg-[#c4a46a]/15">
              <BookOpen className="size-4 text-[#c4a46a]" />
            </div>

            <span className="font-display text-2xl font-semibold tracking-tight text-[#f5f2ea]">
              lore
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-display text-3xl font-medium tracking-tight text-[#f5f2ea]">
              {isRegister
                ? "Create your account"
                : "Welcome back"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/45">
              {isRegister
                ? "Start building your personal reading universe."
                : "Continue exploring your reading universe."}
            </p>
          </div>

          {/* Mode switch */}
          <div className="mb-7 grid grid-cols-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-2.5 text-sm transition-all duration-300 ${
                !isRegister
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-lg py-2.5 text-sm transition-all duration-300 ${
                isRegister
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm leading-5 text-red-300"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isRegister && (
              <Field
                label="Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Your name"
                autoComplete="name"
                disabled={isSubmitting}
              />
            )}

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-white/65"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete={
                    isRegister
                      ? "new-password"
                      : "current-password"
                  }
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-white/[0.09] bg-black/20 px-3.5 pr-11 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-[#c4a46a]/40 focus:bg-white/[0.025] focus:ring-1 focus:ring-[#c4a46a]/20 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  disabled={isSubmitting}
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white/70 disabled:pointer-events-none"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {isRegister && (
                <p className="mt-2 text-xs text-white/30">
                  Use at least 8 characters.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f5f2ea] text-sm font-medium text-[#11110f] transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isRegister
                    ? "Creating account..."
                    : "Signing in..."}
                </>
              ) : (
                <>
                  {isRegister
                    ? "Create account"
                    : "Sign in"}

                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-5 text-white/30">
            By continuing, you agree to use Lore responsibly
            and keep your account credentials secure.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/30">
          <Link
            to="/"
            className="transition-colors hover:text-white/60"
          >
            ← Back to Lore
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={label.toLowerCase()}
        className="mb-2 block text-sm text-white/65"
      >
        {label}
      </label>

      <input
        id={label.toLowerCase()}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-white/[0.09] bg-black/20 px-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-[#c4a46a]/40 focus:bg-white/[0.025] focus:ring-1 focus:ring-[#c4a46a]/20 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}