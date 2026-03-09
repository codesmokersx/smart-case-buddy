import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Briefcase, GitBranch, Bot, FileText, BarChart3, Settings } from "lucide-react";
import Index from "./pages/Index";
import CaseWorkspace from "./pages/CaseWorkspace";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cases/:id" element={<CaseWorkspace />} />
          <Route path="/cases" element={<PlaceholderPage title="Cases" icon={Briefcase} description="Browse and manage all insurance cases across workflows." />} />
          <Route path="/workflows" element={<PlaceholderPage title="Workflows" icon={GitBranch} description="Build and manage automated insurance processing workflows." />} />
          <Route path="/agents" element={<PlaceholderPage title="AI Agents" icon={Bot} description="Monitor and configure AI agents processing your cases." />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" icon={FileText} description="Central document repository for all case files." />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" icon={BarChart3} description="Track processing metrics, automation rates, and team performance." />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin" icon={Settings} description="Manage users, roles, departments, and integration settings." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
