import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import PageThumbnail from "@/components/PageThumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Status = "idle" | "processing" | "success" | "error";

const SplitPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState("");
  const [splitMode, setSplitMode] = useState<"select" | "range" | "all">("select");

  useEffect(() => {
    const loadPdfInfo = async () => {
      if (files.length === 0) {
        setPageCount(0);
        setSelectedPages([]);
        return;
      }

      try {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        setPageCount(count);
        setSelectedPages([]);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setStatus("error");
        setStatusMessage("Error al cargar el PDF.");
      }
    };

    loadPdfInfo();
  }, [files]);

  const togglePage = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const parseRange = (range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(",").map((s) => s.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= pageCount) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= pageCount && !pages.includes(num)) {
          pages.push(num);
        }
      }
    }

    return pages.sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (files.length === 0) return;

    let pagesToExtract: number[] = [];

    if (splitMode === "select") {
      pagesToExtract = selectedPages.sort((a, b) => a - b);
    } else if (splitMode === "range") {
      pagesToExtract = parseRange(rangeInput);
    } else if (splitMode === "all") {
      pagesToExtract = Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    if (pagesToExtract.length === 0) {
      setStatus("error");
      setStatusMessage("Selecciona al menos una página.");
      return;
    }

    setStatus("processing");
    setStatusMessage("Extrayendo páginas...");

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);

      if (splitMode === "all") {
        // Split into individual PDFs
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(originalPdf, [i]);
          newPdf.addPage(page);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          saveAs(blob, `pagina_${i + 1}.pdf`);
        }
      } else {
        // Extract selected pages into one PDF
        const newPdf = await PDFDocument.create();
        const pageIndices = pagesToExtract.map((p) => p - 1);
        const pages = await newPdf.copyPages(originalPdf, pageIndices);
        pages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        saveAs(blob, "paginas_extraidas.pdf");
      }

      setStatus("success");
      setStatusMessage("¡Páginas extraídas con éxito!");
    } catch (error) {
      console.error("Error splitting PDF:", error);
      setStatus("error");
      setStatusMessage("Error al dividir el PDF.");
    }
  };

  return (
    <ToolLayout
      title="Dividir PDF"
      description="Extrae páginas específicas o divide tu PDF en archivos individuales."
      icon={Scissors}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          title="Arrastra tu archivo PDF aquí"
          description="o haz clic para seleccionar"
        />

        {pageCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Tabs defaultValue="select" onValueChange={(v) => setSplitMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="select">Seleccionar páginas</TabsTrigger>
                <TabsTrigger value="range">Por rango</TabsTrigger>
                <TabsTrigger value="all">Dividir todo</TabsTrigger>
              </TabsList>

              <TabsContent value="select" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Haz clic en las páginas que deseas extraer ({selectedPages.length} seleccionadas)
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  <AnimatePresence>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <PageThumbnail
                        key={i + 1}
                        pageNumber={i + 1}
                        isSelected={selectedPages.includes(i + 1)}
                        onSelect={() => togglePage(i + 1)}
                        showCheckbox
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="range" className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="range">Rango de páginas</Label>
                    <Input
                      id="range"
                      placeholder="Ej: 1-3, 5, 7-10"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Ingresa páginas individuales o rangos separados por comas. Total: {pageCount} páginas.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                <div className="bg-muted/50 p-6 rounded-xl text-center">
                  <p className="text-foreground font-medium">
                    Se crearán {pageCount} archivos PDF individuales
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cada página se guardará como un archivo separado
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        <ProcessingStatus status={status} message={statusMessage} />

        {pageCount > 0 && status !== "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground gap-2 px-8 shadow-glow hover:shadow-large transition-shadow"
              onClick={handleSplit}
            >
              <Download className="w-5 h-5" />
              Dividir y Descargar
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default SplitPDF;
