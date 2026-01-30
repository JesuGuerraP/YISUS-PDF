import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import PageThumbnail from "@/components/PageThumbnail";
import { Button } from "@/components/ui/button";
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";

type Status = "idle" | "processing" | "success" | "error";

const DeletePages = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);

  const { thumbnails, pageCount, isLoading: loadingThumbnails } = usePdfThumbnails(
    files.length > 0 ? files[0] : null
  );

  useEffect(() => {
    setPagesToDelete([]);
  }, [files]);

  const togglePage = (page: number) => {
    setPagesToDelete((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const handleDelete = async () => {
    if (files.length === 0 || pagesToDelete.length === 0) return;

    if (pagesToDelete.length >= pageCount) {
      setStatus("error");
      setStatusMessage("No puedes eliminar todas las páginas.");
      return;
    }

    setStatus("processing");
    setStatusMessage("Eliminando páginas...");

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pagesToKeep = Array.from({ length: pageCount }, (_, i) => i)
        .filter((i) => !pagesToDelete.includes(i + 1));

      const pages = await newPdf.copyPages(originalPdf, pagesToKeep);
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      saveAs(blob, "documento_editado.pdf");

      setStatus("success");
      setStatusMessage("¡Páginas eliminadas con éxito!");
    } catch (error) {
      console.error("Error deleting pages:", error);
      setStatus("error");
      setStatusMessage("Error al eliminar las páginas.");
    }
  };

  const remainingPages = pageCount - pagesToDelete.length;

  return (
    <ToolLayout
      title="Eliminar Páginas"
      description="Selecciona las páginas que deseas eliminar de tu PDF."
      icon={Trash2}
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

        {!loadingThumbnails && pageCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Haz clic en las páginas que deseas eliminar
              </p>
              <div className="text-sm">
                <span className="text-destructive font-medium">
                  {pagesToDelete.length} para eliminar
                </span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-foreground font-medium">
                  {remainingPages} restantes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              <AnimatePresence>
                {thumbnails.map((thumb) => (
                  <motion.div
                    key={thumb.pageNumber}
                    className={pagesToDelete.includes(thumb.pageNumber) ? "opacity-50" : ""}
                  >
                    <PageThumbnail
                      pageNumber={thumb.pageNumber}
                      isSelected={pagesToDelete.includes(thumb.pageNumber)}
                      onSelect={() => togglePage(thumb.pageNumber)}
                      showCheckbox
                      imageData={thumb.imageData}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <ProcessingStatus status={status} message={statusMessage} />

        {pageCount > 0 && pagesToDelete.length > 0 && status !== "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground gap-2 px-8 shadow-glow hover:shadow-large transition-shadow"
              onClick={handleDelete}
            >
              <Download className="w-5 h-5" />
              Eliminar y Descargar
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default DeletePages;
