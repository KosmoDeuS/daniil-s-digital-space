/**
 * EN: Root application component. Sets up routing, global providers (React Query, Tooltips),
 *     and toast notification systems. All pages are registered here as routes.
 * RU: Корневой компонент приложения. Настраивает маршрутизацию, глобальные провайдеры
 *     (React Query, Tooltips) и системы уведомлений (toast). Все страницы регистрируются здесь как маршруты.
 *
 * EN: Interacts with:
 *   - src/pages/Index.tsx — home page (portfolio)
 *   - src/pages/TaskManagerPage.tsx — task manager page
 *   - src/pages/NotFound.tsx — 404 fallback page
 *   - src/components/ui/toaster.tsx, sonner.tsx, tooltip.tsx — UI providers
 * RU: Взаимодействует с:
 *   - src/pages/Index.tsx — главная страница (портфолио)
 *   - src/pages/TaskManagerPage.tsx — страница менеджера задач
 *   - src/pages/NotFound.tsx — страница 404
 *   - src/components/ui/toaster.tsx, sonner.tsx, tooltip.tsx — UI-провайдеры
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TaskManagerPage from "./pages/TaskManagerPage";
import LiliPage from "./pages/LiliPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* EN: Home page — portfolio / RU: Главная страница — портфолио */}
          <Route path="/" element={<Index />} />
          {/* EN: Task Manager page / RU: Страница менеджера задач */}
          <Route path="/tasks" element={<TaskManagerPage />} />
          {/* EN: Catch-all 404 route — must be last / RU: Маршрут-ловушка 404 — должен быть последним */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
