import { useState, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Use CDN for the worker to avoid Vite bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ThumbnailData {
  pageNumber: number;
  imageData: string;
}

export const usePdfThumbnails = (file: File | null, maxWidth: number = 150) => {
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateThumbnails = useCallback(async () => {
    if (!file) {
      setThumbnails([]);
      setPageCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const count = pdf.numPages;
      setPageCount(count);

      const newThumbnails: ThumbnailData[] = [];

      for (let i = 1; i <= count; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          
          // Calculate scale to fit maxWidth
          const scale = maxWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          // Create canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          if (!context) {
            throw new Error("Could not get canvas context");
          }

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;

          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;

          // Convert to data URL
          const imageData = canvas.toDataURL("image/jpeg", 0.8);
          
          newThumbnails.push({
            pageNumber: i,
            imageData,
          });
        } catch (pageError) {
          console.warn(`Error rendering page ${i}:`, pageError);
          // Add placeholder for failed pages
          newThumbnails.push({
            pageNumber: i,
            imageData: "",
          });
        }
      }

      setThumbnails(newThumbnails);
    } catch (err) {
      console.error("Error generating thumbnails:", err);
      setError("Error al generar las miniaturas del PDF");
      setThumbnails([]);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [file, maxWidth]);

  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  return { thumbnails, pageCount, isLoading, error };
};
