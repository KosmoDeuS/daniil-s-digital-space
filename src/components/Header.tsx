/**
 * EN: Fixed navigation header — displays site logo and nav links.
 *     Supports both anchor links (scroll to section on home page) and router links (navigate to /tasks).
 *     Includes a responsive mobile hamburger menu.
 * RU: Фиксированная навигационная шапка — отображает логотип и навигационные ссылки.
 *     Поддерживает якорные ссылки (прокрутка к секции на главной) и роутер-ссылки (переход на /tasks).
 *     Включает адаптивное мобильное меню-бургер.
 *
 * EN: Interacts with:
 *   - src/pages/Index.tsx, src/pages/TaskManagerPage.tsx — used in both page layouts
 *   - src/components/Hero.tsx, About.tsx, Skills.tsx, Projects.tsx, Contact.tsx — anchor targets (#about, #skills, etc.)
 * RU: Взаимодействует с:
 *   - src/pages/Index.tsx, src/pages/TaskManagerPage.tsx — используется в обоих макетах страниц
 *   - src/components/Hero.tsx, About.tsx, Skills.tsx, Projects.tsx, Contact.tsx — якорные цели (#about, #skills и т.д.)
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

/**
 * EN: Navigation items config. isRoute=true means it uses React Router <Link>, otherwise an anchor <a>.
 * RU: Конфигурация пунктов навигации. isRoute=true — используется <Link> React Router, иначе — якорная ссылка <a>.
 */
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

  /**
   * EN: Renders the correct link type — <Link> for routes, <a> for anchors.
   *     If not on the home page, anchor links redirect to home with the hash.
   * RU: Отрисовывает правильный тип ссылки — <Link> для маршрутов, <a> для якорей.
   *     Если не на главной, якорные ссылки перенаправляют на главную с хэшем.
   */
  const renderLink = (item: typeof navItems[0], onClick?: () => void) => {
    const cls = "text-sm text-muted-foreground hover:text-foreground transition-colors";

    if (item.isRoute) {
      return (
        <Link key={item.href} to={item.href} onClick={onClick} className={cls}>
          {item.label}
        </Link>
      );
    }

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
        {/* EN: Logo — links back to home / RU: Логотип — ведёт на главную */}
        <Link to="/" className="font-mono-display font-bold text-lg text-primary">
          DR.
        </Link>

        {/* EN: Desktop nav links / RU: Навигация для десктопа */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => renderLink(item))}
        </div>

        {/* EN: Mobile menu toggle / RU: Кнопка мобильного меню */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* EN: Mobile dropdown menu / RU: Выпадающее мобильное меню */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-3">
          {navItems.map((item) => renderLink(item, () => setMobileOpen(false)))}
        </div>
      )}
    </header>
  );
};

export default Header;
