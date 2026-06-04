/**
 * EN: 404 Not Found page — shown when the user navigates to a non-existent route.
 *     Logs the invalid path to the console for debugging.
 * RU: Страница 404 — отображается при переходе на несуществующий маршрут.
 *     Логирует некорректный путь в консоль для отладки.
 *
 * EN: Interacts with: src/App.tsx (registered as the catch-all "*" route)
 * RU: Взаимодействует с: src/App.tsx (зарегистрирована как маршрут-ловушка "*")
 */

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 pb-16 pt-24">
      <div className="max-w-md rounded-xl border border-border bg-card/80 p-8 text-center">
        <p className="mb-2 font-mono-display text-sm uppercase tracking-wider text-primary">404</p>
        <h1 className="mb-4 text-4xl font-bold">Page not found</h1>
        <p className="mb-6 text-muted-foreground">This route does not exist, but the app is still here.</p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
