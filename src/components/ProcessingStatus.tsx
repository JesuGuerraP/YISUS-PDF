import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type Status = "idle" | "processing" | "success" | "error";

interface ProcessingStatusProps {
  status: Status;
  message?: string;
}

const ProcessingStatus = ({ status, message }: ProcessingStatusProps) => {
  if (status === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl flex items-center gap-3 ${
        status === "processing"
          ? "bg-primary/10 text-primary"
          : status === "success"
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {status === "processing" && (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}
      {status === "success" && <CheckCircle className="w-5 h-5" />}
      {status === "error" && <XCircle className="w-5 h-5" />}
      <span className="font-medium">
        {message ||
          (status === "processing"
            ? "Procesando..."
            : status === "success"
            ? "¡Completado!"
            : "Error al procesar")}
      </span>
    </motion.div>
  );
};

export default ProcessingStatus;
