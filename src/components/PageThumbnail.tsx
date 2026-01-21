import { motion } from "framer-motion";
import { GripVertical, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageThumbnailProps {
  pageNumber: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  showCheckbox?: boolean;
  imageData?: string;
}

const PageThumbnail = ({
  pageNumber,
  isSelected = false,
  isDraggable = false,
  onSelect,
  onDelete,
  showDeleteButton = false,
  showCheckbox = false,
  imageData,
}: PageThumbnailProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`page-thumbnail relative cursor-pointer ${
        isSelected ? "selected" : ""
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div className="absolute top-2 left-2 p-1 bg-background/80 rounded cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Checkbox */}
      {showCheckbox && (
        <div
          className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-primary border-primary"
              : "bg-background/80 border-muted-foreground/30"
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      )}

      {/* Page Preview */}
      <div className="aspect-[3/4] bg-muted flex items-center justify-center relative overflow-hidden">
        {imageData ? (
          <img
            src={imageData}
            alt={`Página ${pageNumber}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{pageNumber}</span>
            </div>
            <span className="text-xs text-muted-foreground">PDF</span>
          </div>
        )}
      </div>

      {/* Page Number */}
      <div className="p-2 text-center border-t border-border">
        <span className="text-sm font-medium text-foreground">
          Página {pageNumber}
        </span>
      </div>

      {/* Delete Button */}
      {showDeleteButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-10 right-2 h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
};

export default PageThumbnail;
