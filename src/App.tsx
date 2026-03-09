import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BarChart3, Settings } from "lucide-react";
import Index from "./pages/Index";
import CaseWorkspace from "./pages/CaseWorkspace";
import CasesPage from "./pages/CasesPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import AgentsPage from "./pages/AgentsPage";
import DocumentsPage from "./pages/DocumentsPage";
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
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" icon={BarChart3} description="Track processing metrics, automation rates, and team performance." />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin" icon={Settings} description="Manage users, roles, departments, and integration settings." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
