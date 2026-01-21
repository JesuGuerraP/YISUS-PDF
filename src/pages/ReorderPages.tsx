import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, Reorder } from "framer-motion";
import { ArrowUpDown, Download, GripVertical } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

interface PageItem {
  id: string;
  originalIndex: number;
  pageNumber: number;
}

const ReorderPages = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [pages, setPages] = useState<PageItem[]>([]);

  useEffect(() => {
    const loadPdfInfo = async () => {
      if (files.length === 0) {
        setPages([]);
        return;
      }

      try {
        const arrayBuffer = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        
        setPages(
          Array.from({ length: count }, (_, i) => ({
            id: `page-${i}`,
            originalIndex: i,
            pageNumber: i + 1,
          }))
        );
      } catch (error) {
        console.error("Error loading PDF:", error);
        setStatus("error");
        setStatusMessage("Error al cargar el PDF.");
      }
    };

    loadPdfInfo();
  }, [files]);

  const handleReorder = async () => {
    if (files.length === 0 || pages.length === 0) return;

    setStatus("processing");
    setStatusMessage("Reordenando páginas...");

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const newOrder = pages.map((p) => p.originalIndex);
      const copiedPages = await newPdf.copyPages(originalPdf, newOrder);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      saveAs(blob, "documento_reordenado.pdf");

      setStatus("success");
      setStatusMessage("¡Páginas reordenadas con éxito!");
    } catch (error) {
      console.error("Error reordering pages:", error);
      setStatus("error");
      setStatusMessage("Error al reordenar las páginas.");
    }
  };

  const hasChanges = pages.some((page, index) => page.originalIndex !== index);

  return (
    <ToolLayout
      title="Reordenar Páginas"
      description="Arrastra y suelta para cambiar el orden de las páginas."
      icon={ArrowUpDown}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          title="Arrastra tu archivo PDF aquí"
          description="o haz clic para seleccionar"
        />

        {pages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GripVertical className="w-4 h-4" />
              <span>Arrastra las páginas para reordenarlas</span>
            </div>

            <Reorder.Group
              axis="y"
              values={pages}
              onReorder={setPages}
              className="space-y-2"
            >
              {pages.map((page, index) => (
                <Reorder.Item
                  key={page.id}
                  value={page}
                  className="bg-card p-4 rounded-xl border border-border shadow-soft cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-foreground">
                        Página {page.pageNumber}
                      </span>
                      {page.originalIndex !== index && (
                        <span className="ml-2 text-xs text-primary">
                          (movida)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Posición original: {page.pageNumber}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}

        <ProcessingStatus status={status} message={statusMessage} />

        {pages.length > 0 && hasChanges && status !== "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground gap-2 px-8 shadow-glow hover:shadow-large transition-shadow"
              onClick={handleReorder}
            >
              <Download className="w-5 h-5" />
              Reordenar y Descargar
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ReorderPages;
