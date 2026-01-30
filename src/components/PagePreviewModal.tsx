import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface PagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string;
  pageNumber: number;
  totalPages: number;
  onNavigate?: (pageNumber: number) => void;
}

const PagePreviewModal = ({
  isOpen,
  onClose,
  imageData,
  pageNumber,
  totalPages,
  onNavigate,
}: PagePreviewModalProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const handlePrevious = () => {
    if (pageNumber > 1 && onNavigate) {
      onNavigate(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages && onNavigate) {
      onNavigate(pageNumber + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Página {pageNumber} de {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30 rounded-lg min-h-0">
          {imageData ? (
            <img
              src={imageData}
              alt={`Página ${pageNumber}`}
              className="max-w-full h-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No se pudo cargar la vista previa
            </div>
          )}
        </div>

        {onNavigate && totalPages > 1 && (
          <div className="flex-shrink-0 flex items-center justify-center gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={pageNumber >= totalPages}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PagePreviewModal;
