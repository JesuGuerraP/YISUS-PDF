import { useState } from "react";
import mammoth from "mammoth";
import { motion } from "framer-motion";
import { FileText, Download, Loader2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

const PDFToWord = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setStatusMessage("Esta función requiere un servicio de backend para conversión completa. Por ahora, descargando el PDF original...");

    // Note: Full PDF to Word conversion requires server-side processing
    // For now, we'll show a message about this limitation
    setTimeout(() => {
      setStatus("error");
      setStatusMessage("La conversión de PDF a Word requiere procesamiento del servidor. Esta función estará disponible próximamente.");
    }, 2000);
  };

  return (
    <ToolLayout
      title="PDF a Word"
      description="Convierte tus archivos PDF a documentos Word editables."
      icon={FileText}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          title="Arrastra tu archivo PDF aquí"
          description="o haz clic para seleccionar"
        />

        <ProcessingStatus status={status} message={statusMessage} />

        {files.length > 0 && status !== "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground gap-2 px-8 shadow-glow hover:shadow-large transition-shadow"
              onClick={handleConvert}
            >
              <Download className="w-5 h-5" />
              Convertir a Word
            </Button>
          </motion.div>
        )}

        <div className="bg-muted/50 p-6 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Nota:</strong> La conversión completa de PDF a Word con formato preservado requiere procesamiento del servidor. Esta función estará disponible próximamente.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PDFToWord;
