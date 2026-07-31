import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo-icon.svg";
import avatar from "../../assets/images/Ellipse 20.png";
import { useAuth } from "../../lib/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Search", to: "/search" },
  { label: "Map", to: "/map" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

export function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
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

        <div className="flex items-center gap-4">
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
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-md">
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
      </div>
    </header>
  );
}
