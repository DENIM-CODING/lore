import {
  BookOpen,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isLoading, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  async function handleLogout() {
    setProfileOpen(false);
    setMobileOpen(false);

    try {
      await logout();
    } finally {
      navigate("/auth", {
        replace: true,
      });
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between">
            {/* ─────────────────────────────────────────
                Logo
            ───────────────────────────────────────── */}

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex items-center gap-2.5"
              aria-label="Lore home"
            >
              <div className="flex size-9 items-center justify-center rounded-xl border border-[#c4a46a]/20 bg-[#c4a46a]/10 transition-all duration-300 group-hover:border-[#c4a46a]/30 group-hover:bg-[#c4a46a]/15">
                <BookOpen className="size-4 text-[#c4a46a]" />
              </div>

              <span className="font-display text-xl font-semibold tracking-tight text-[#f5f2ea]">
                lore
              </span>
            </Link>

            {/* ─────────────────────────────────────────
                Desktop Navigation
            ───────────────────────────────────────── */}

            <div className="hidden items-center gap-8 md:flex">
              <NavLink
                to="/discover"
                active={isActive("/discover")}
              >
                Discover
              </NavLink>

              <NavLink
                to="/library"
                active={isActive("/library")}
              >
                My Library
              </NavLink>

              <NavLink
                to="/stats"
                active={isActive("/stats")}
              >
                Statistics
              </NavLink>
            </div>

            {/* ─────────────────────────────────────────
                Desktop Actions
            ───────────────────────────────────────── */}

            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                aria-label="Search"
                className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/55 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                <Search className="size-4" />
              </button>

              {!isLoading &&
                (user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setProfileOpen(
                          (value) => !value,
                        )
                      }
                      aria-expanded={profileOpen}
                      aria-haspopup="menu"
                      className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
                    >
                      <div className="flex size-7 items-center justify-center rounded-lg bg-[#c4a46a]/15 text-xs font-medium text-[#c4a46a]">
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="max-w-24 truncate text-sm text-white/75">
                        {user.name}
                      </span>

                      <ChevronDown
                        className={`size-3.5 text-white/40 transition-transform duration-200 ${
                          profileOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {profileOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 top-[calc(100%+0.5rem)] w-52 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]/95 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl"
                      >
                        <div className="border-b border-white/[0.07] px-3 py-2.5">
                          <p className="truncate text-sm font-medium text-white/90">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-white/35">
                            {user.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <DropdownLink
                            to="/profile"
                            icon={User}
                            onClick={() =>
                              setProfileOpen(
                                false,
                              )
                            }
                          >
                            Profile
                          </DropdownLink>

                          <DropdownLink
                            to="/settings"
                            icon={Settings}
                            onClick={() =>
                              setProfileOpen(
                                false,
                              )
                            }
                          >
                            Settings
                          </DropdownLink>
                        </div>

                        <div className="border-t border-white/[0.07] pt-1">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={
                              handleLogout
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300/80 transition-colors hover:bg-red-400/[0.06] hover:text-red-300"
                          >
                            <LogOut className="size-4" />
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="rounded-xl bg-[#f5f2ea] px-4 py-2 text-sm font-medium text-[#11110f] transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                  >
                    Get started
                  </Link>
                ))}
            </div>

            {/* ─────────────────────────────────────────
                Mobile Menu Button
            ───────────────────────────────────────── */}

            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              onClick={() =>
                setMobileOpen(
                  (value) => !value,
                )
              }
              className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white md:hidden"
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>

          {/* ─────────────────────────────────────────
              Mobile Navigation
          ───────────────────────────────────────── */}

          {mobileOpen && (
            <div className="mt-4 border-t border-white/[0.08] pt-4 md:hidden">
              <div className="flex flex-col gap-1">
                <MobileNavLink
                  to="/discover"
                  active={isActive(
                    "/discover",
                  )}
                  onClick={closeMobileMenu}
                >
                  Discover
                </MobileNavLink>

                <MobileNavLink
                  to="/library"
                  active={isActive("/library")}
                  onClick={closeMobileMenu}
                >
                  My Library
                </MobileNavLink>

                <MobileNavLink
                  to="/stats"
                  active={isActive("/stats")}
                  onClick={closeMobileMenu}
                >
                  Statistics
                </MobileNavLink>

                {!isLoading &&
                  (user ? (
                    <>
                      <MobileNavLink
                        to="/profile"
                        active={isActive(
                          "/profile",
                        )}
                        onClick={
                          closeMobileMenu
                        }
                      >
                        Profile
                      </MobileNavLink>

                      <MobileNavLink
                        to="/settings"
                        active={isActive(
                          "/settings",
                        )}
                        onClick={
                          closeMobileMenu
                        }
                      >
                        Settings
                      </MobileNavLink>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl border-t border-white/[0.08] px-3 py-3 pt-4 text-left text-sm text-red-300/80 transition-all duration-300 hover:bg-red-400/[0.06] hover:text-red-300"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={
                        closeMobileMenu
                      }
                      className="mt-3 flex items-center justify-center rounded-xl bg-[#f5f2ea] px-4 py-3 text-sm font-medium text-[#11110f] transition-all duration-300 hover:bg-white"
                    >
                      Start exploring
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   Desktop Navigation Link
───────────────────────────────────────── */

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`relative text-sm transition-colors duration-300 ${
        active
          ? "text-white"
          : "text-white/45 hover:text-white"
      }`}
    >
      {children}

      {active && (
        <span className="absolute -bottom-2 left-1/2 h-px w-5 -translate-x-1/2 bg-[#c4a46a]" />
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────
   Mobile Navigation Link
───────────────────────────────────────── */

function MobileNavLink({
  to,
  active,
  onClick,
  children,
}: {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-sm transition-all duration-300 ${
        active
          ? "bg-[#c4a46a]/10 text-[#c4a46a]"
          : "text-white/55 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

/* ─────────────────────────────────────────
   Profile Dropdown Link
───────────────────────────────────────── */

function DropdownLink({
  to,
  icon: Icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
    >
      <Icon className="size-4" />

      {children}
    </Link>
  );
}