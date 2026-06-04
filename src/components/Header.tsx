import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  isRoute: boolean;
};

const navItems: NavItem[] = [
  { label: "About", href: "#about", isRoute: false },
  { label: "Skills", href: "#skills", isRoute: false },
  { label: "Projects", href: "#projects", isRoute: false },
  { label: "Personal Blog", href: "/blog", isRoute: true },
  { label: "Contact", href: "#contact", isRoute: false },
  { label: "Tasks", href: "/tasks", isRoute: true },
  { label: "Lili ♥", href: "/lili", isRoute: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const scrollDirection = useScrollDirection();
  const headerHidden = scrollDirection === "down" && !mobileOpen;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const renderLink = (item: NavItem, onClick?: () => void) => {
    const className = "text-sm text-muted-foreground hover:text-foreground transition-colors";

    if (item.isRoute) {
      return (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={onClick}
          className={({ isActive }) => cn(className, isActive && "text-foreground")}
        >
          {item.label}
        </NavLink>
      );
    }

    const href = isHome ? item.href : `/${item.href}`;

    return (
      <a key={item.href} href={href} onClick={onClick} className={className}>
        {item.label}
      </a>
    );
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg transition-transform duration-300 ease-out focus-within:translate-y-0",
        headerHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-mono-display text-lg font-bold text-primary">
          DR.
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => renderLink(item))}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="flex flex-col gap-3 border-b border-border bg-background px-6 py-4 md:hidden">
          {navItems.map((item) => renderLink(item, () => setMobileOpen(false)))}
        </div>
      )}
    </header>
  );
};

export default Header;
