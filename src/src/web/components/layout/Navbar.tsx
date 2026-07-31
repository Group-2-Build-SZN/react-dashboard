import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import logo from "../../assets/images/logo-icon.svg";
import avatar from "../../assets/images/Ellipse 20.png";
import { useAuth } from "../../lib/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Properties", to: "/search" },
  { label: "Map", to: "/map" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

interface NavbarProps {
  variant?: "landing" | "marketing";
}

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="My Ulo" className="h-9 w-9" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-body text-neutral-700 transition-colors hover:text-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {isLoading ? (
          <div className="hidden h-10 w-[200px] lg:block" />
        ) : isLoggedIn ? (
          <div className="hidden items-center gap-4 lg:flex">
            <Link to="/dashboard">
              <Button variant="primary">List Property</Button>
            </Link>
            <button
              aria-label="Notifications"
              className="text-neutral-500 hover:text-neutral-700"
            >
              <Bell size={20} />
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)}>
                <img
                  src={user?.avatarUrl || avatar}
                  alt={user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User avatar' : 'User avatar'}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-md">
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-small text-neutral-700 hover:bg-neutral-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-small text-error hover:bg-neutral-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : variant === "landing" ? (
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login">
              <Button variant="secondary">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/dashboard">
              <Button variant="primary">List Property</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </div>
        )}

        <button
          type="button"
          className="p-2 text-neutral lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="text-body text-neutral-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            {isLoading ? null : isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="primary" fullWidth>
                    List Property
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="secondary" fullWidth>
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-center text-small text-error"
                >
                  Log Out
                </button>
              </>
            ) : variant === "landing" ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="secondary" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="primary" fullWidth>
                    List Property
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="secondary" fullWidth>
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
