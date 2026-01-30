import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, Reorder } from "framer-motion";
import { ArrowUpDown, Download, GripVertical, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";

type Status = "idle" | "processing" | "success" | "error";

interface PageItem {
  id: string;
  originalIndex: number;
  pageNumber: number;
  imageData?: string;
}

const ReorderPages = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [pages, setPages] = useState<PageItem[]>([]);

  const { thumbnails, isLoading: loadingThumbnails } = usePdfThumbnails(
    files.length > 0 ? files[0] : null
  );

  useEffect(() => {
    if (thumbnails.length > 0) {
      setPages(
        thumbnails.map((thumb, i) => ({
          id: `page-${i}`,
          originalIndex: i,
          pageNumber: thumb.pageNumber,
          imageData: thumb.imageData,
        }))
      );
    } else if (files.length === 0) {
      setPages([]);
    }
  }, [thumbnails, files]);

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

        {loadingThumbnails && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Cargando miniaturas...</span>
          </div>
        )}

        {!loadingThumbnails && pages.length > 0 && (
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
                    <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    {page.imageData ? (
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={page.imageData} 
                          alt={`Página ${page.pageNumber}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {page.pageNumber}
                        </span>
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground">
                        Página {page.pageNumber}
                      </span>
                      {page.originalIndex !== index && (
                        <span className="ml-2 text-xs text-primary">
                          (movida)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex-shrink-0">
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
