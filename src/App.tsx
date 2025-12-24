import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import Brief from "./pages/Brief";
import Resources from "./pages/Resources";
import Checklist from "./pages/Checklist";
import Thanks from "./pages/Thanks";
import ThanksChecklist from "./pages/ThanksChecklist";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/brief" element={<Brief />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/ai-systems-launch-checklist" element={<Checklist />} />
            <Route path="/thanks" element={<Thanks />} />
            <Route path="/thanks-checklist" element={<ThanksChecklist />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
