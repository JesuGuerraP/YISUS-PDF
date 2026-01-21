import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion, Reorder } from "framer-motion";
import { Merge, Download, ArrowUpDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setStatusMessage("Combinando PDFs...");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      saveAs(blob, "documento_combinado.pdf");

      setStatus("success");
      setStatusMessage("¡PDFs combinados con éxito!");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setStatus("error");
      setStatusMessage("Error al combinar los PDFs. Verifica que sean válidos.");
    }
  };

  const handleReorder = (newOrder: File[]) => {
    setFiles(newOrder);
  };

  return (
    <ToolLayout
      title="Unir PDF"
      description="Combina múltiples archivos PDF en uno solo. Arrastra para reordenar."
      icon={Merge}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          multiple
          maxFiles={20}
          title="Arrastra tus archivos PDF aquí"
          description="o haz clic para seleccionar (máximo 20 archivos)"
        />

        {files.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
              <span>Arrastra para reordenar los archivos</span>
            </div>

            <Reorder.Group
              axis="y"
              values={files}
              onReorder={handleReorder}
              className="space-y-2"
            >
              {files.map((file, index) => (
                <Reorder.Item
                  key={file.name + file.size}
                  value={file}
                  className="bg-card p-4 rounded-xl border border-border shadow-soft cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground truncate">
                      {file.name}
                    </span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}

        <ProcessingStatus status={status} message={statusMessage} />

        {files.length >= 2 && status !== "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground gap-2 px-8 shadow-glow hover:shadow-large transition-shadow"
              onClick={handleMerge}
            >
              <Download className="w-5 h-5" />
              Unir y Descargar
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default MergePDF;
