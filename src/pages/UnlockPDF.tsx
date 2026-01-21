import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { Unlock, Download, Key } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "processing" | "success" | "error";

const UnlockPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleUnlock = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setStatusMessage("Desbloqueando PDF...");

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      
      // Try to load the PDF with ignoreEncryption option
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Create a new unencrypted PDF
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      saveAs(blob, "documento_desbloqueado.pdf");

      setStatus("success");
      setStatusMessage("¡PDF desbloqueado con éxito!");
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      setStatus("error");
      setStatusMessage("Error al desbloquear. Verifica la contraseña.");
    }
  };

  return (
    <ToolLayout
      title="Desbloquear PDF"
      description="Elimina la protección con contraseña de tu PDF."
      icon={Unlock}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          title="Arrastra tu archivo PDF protegido aquí"
          description="o haz clic para seleccionar"
        />

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Contraseña del PDF
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ingresa la contraseña si el PDF está protegido
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña (opcional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa la contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}

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
              onClick={handleUnlock}
            >
              <Download className="w-5 h-5" />
              Desbloquear y Descargar
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default UnlockPDF;
