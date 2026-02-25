import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "#about", isRoute: false },
  { label: "Skills", href: "#skills", isRoute: false },
  { label: "Projects", href: "#projects", isRoute: false },
  { label: "Contact", href: "#contact", isRoute: false },
  { label: "Tasks", href: "/tasks", isRoute: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const renderLink = (item: typeof navItems[0], onClick?: () => void) => {
    const cls = "text-sm text-muted-foreground hover:text-foreground transition-colors";

    if (item.isRoute) {
      return (
        <Link key={item.href} to={item.href} onClick={onClick} className={cls}>
          {item.label}
        </Link>
      );
    }

    // If on home page, use anchor. Otherwise link back to home with hash.
    const href = isHome ? item.href : `/${item.href}`;
    return (
      <a key={item.href} href={href} onClick={onClick} className={cls}>
        {item.label}
      </a>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-mono-display font-bold text-lg text-primary">
          DR.
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => renderLink(item))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-3">
          {navItems.map((item) => renderLink(item, () => setMobileOpen(false)))}
        </div>
      )}
    </header>
  );
};

export default Header;
