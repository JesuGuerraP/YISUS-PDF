import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  title?: string;
  description?: string;
}

const FileUploader = ({
  files,
  onFilesChange,
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  maxFiles = 10,
  title = "Arrastra tus archivos aquí",
  description = "o haz clic para seleccionar",
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        onFilesChange(newFiles);
      } else {
        onFilesChange(acceptedFiles.slice(0, 1));
      }
    },
    [files, multiple, maxFiles, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const dropzoneProps = getRootProps();

  return (
    <div className="space-y-4">
      <motion.div
        onClick={dropzoneProps.onClick}
        onKeyDown={dropzoneProps.onKeyDown}
        onFocus={dropzoneProps.onFocus}
        onBlur={dropzoneProps.onBlur}
        onDragEnter={dropzoneProps.onDragEnter}
        onDragLeave={dropzoneProps.onDragLeave}
        onDragOver={dropzoneProps.onDragOver}
        onDrop={dropzoneProps.onDrop}
        tabIndex={dropzoneProps.tabIndex}
        role={dropzoneProps.role}
        className={`upload-zone cursor-pointer ${isDragActive ? "active" : ""}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Button variant="outline" className="mt-2">
            Seleccionar archivos
          </Button>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-soft"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
