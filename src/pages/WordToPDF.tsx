import { useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { FileUp, Download } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

const WordToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setStatusMessage("Convirtiendo Word a PDF...");

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      
      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Create PDF from HTML content
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Parse HTML and add to PDF
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";

      // Add text to PDF with word wrapping
      const lines = doc.splitTextToSize(textContent, 180);
      let y = 20;
      const pageHeight = 280;

      for (const line of lines) {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 7;
      }

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const fileName = files[0].name.replace(/\.(docx?|doc)$/i, ".pdf");
      saveAs(pdfBlob, fileName);

      setStatus("success");
      setStatusMessage("¡Documento convertido con éxito!");
    } catch (error) {
      console.error("Error converting to PDF:", error);
      setStatus("error");
      setStatusMessage("Error al convertir. Verifica que el archivo sea válido.");
    }
  };

  return (
    <ToolLayout
      title="Word a PDF"
      description="Convierte tus documentos Word a formato PDF."
      icon={FileUp}
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          accept={{
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"],
          }}
          title="Arrastra tu archivo Word aquí"
          description="Formatos soportados: .docx, .doc"
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
              Convertir a PDF
            </Button>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};

export default WordToPDF;
