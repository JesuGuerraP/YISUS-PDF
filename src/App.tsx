import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import MergePDF from "./pages/MergePDF";
import SplitPDF from "./pages/SplitPDF";
import DeletePages from "./pages/DeletePages";
import ReorderPages from "./pages/ReorderPages";
import UnlockPDF from "./pages/UnlockPDF";
import PDFToWord from "./pages/PDFToWord";
import WordToPDF from "./pages/WordToPDF";
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
          <Route path="/unir-pdf" element={<MergePDF />} />
          <Route path="/dividir-pdf" element={<SplitPDF />} />
          <Route path="/eliminar-paginas" element={<DeletePages />} />
          <Route path="/reordenar-paginas" element={<ReorderPages />} />
          <Route path="/desbloquear-pdf" element={<UnlockPDF />} />
          <Route path="/pdf-a-word" element={<PDFToWord />} />
          <Route path="/word-a-pdf" element={<WordToPDF />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
