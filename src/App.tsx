import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/SiteLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BlogPage from "@/pages/BlogPage";
import Index from "@/pages/Index";
import LiliPage from "@/pages/LiliPage";
import NotFound from "@/pages/NotFound";
import TaskManagerPage from "@/pages/TaskManagerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/tasks" element={<TaskManagerPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/lili" element={<LiliPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
