import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Crop, SlidersHorizontal } from "lucide-react";

interface ImageEditorProps {
  sourceImage: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
  onCancel: () => void;
}

export default function ImageEditor({
  sourceImage,
  onSave,
  onClose,
  onCancel,
}: ImageEditorProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    vignette: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to clamp values within [min, max]
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Load image from backend and treat it as the base image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setCropMode(false);
      setPreviewDataUrl(null);
      setAdjustments({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        vignette: 0,
      });
    };
    img.src = sourceImage;
  }, [sourceImage]);

  // Main canvas drawing effect
  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (cropMode && previewDataUrl && !isDragging) {
      // In crop mode, if there's a preview (and not dragging), draw the preview.
      const previewImg = new Image();
      previewImg.onload = () => {
        // Keep canvas dimensions equal to the base image.
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the preview stretched to fill the canvas.
        ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
      };
      previewImg.src = previewDataUrl;
    } else {
      // Draw the base image with new filters applied fresh.
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use canvas filters for brightness, contrast, and saturation.
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";

      // Then, apply vignette manually (drawn only once).
      if (adjustments.vignette > 0) {
        ctx.save();
        const vignette = adjustments.vignette / 100;
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2)
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.5, "rgba(0,0,0,0)");
        gradient.addColorStop(1, `rgba(0,0,0,${vignette})`);
        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      if (cropMode && isDragging) {
        drawCropOverlay(ctx);
      }
    }
  }, [
    image,
    cropMode,
    cropStart,
    cropEnd,
    isDragging,
    adjustments,
    previewDataUrl,
  ]);

  const drawCropOverlay = (ctx: CanvasRenderingContext2D) => {
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.fillRect(0, 0, canvasWidth, y);
    ctx.fillRect(0, y, x, height);
    ctx.fillRect(x + width, y, canvasWidth - (x + width), height);
    ctx.fillRect(0, y + height, canvasWidth, canvasHeight - (y + height));
  };

  // Compute crop preview using the current base image.
  const updateCropPreview = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Clamp coordinates
    const x = clamp(Math.min(cropStart.x, cropEnd.x), 0, canvas.width);
    const y = clamp(Math.min(cropStart.y, cropEnd.y), 0, canvas.height);
    const endX = clamp(Math.max(cropStart.x, cropEnd.x), 0, canvas.width);
    const endY = clamp(Math.max(cropStart.y, cropEnd.y), 0, canvas.height);
    const width = endX - x;
    const height = endY - y;
    if (width < 10 || height < 10) {
      setPreviewDataUrl(null);
      return;
    }
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    // Draw from the base image so that filters don’t stack.
    tempCtx.drawImage(image, x, y, width, height, 0, 0, width, height);
    const croppedDataUrl = tempCanvas.toDataURL("image/png");
    setPreviewDataUrl(croppedDataUrl);
  };

  // Mouse handlers (with clamping)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp((e.clientX - rect.left) * scaleX, 0, canvas.width);
    const y = clamp((e.clientY - rect.top) * scaleY, 0, canvas.height);
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode || !isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp((e.clientX - rect.left) * scaleX, 0, canvas.width);
    const y = clamp((e.clientY - rect.top) * scaleY, 0, canvas.height);
    setCropEnd({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (cropMode) {
      updateCropPreview();
    }
  };

  // Touch handlers (with clamping)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!cropMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp((touch.clientX - rect.left) * scaleX, 0, canvas.width);
    const y = clamp((touch.clientY - rect.top) * scaleY, 0, canvas.height);
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!cropMode || !isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp((touch.clientX - rect.left) * scaleX, 0, canvas.width);
    const y = clamp((touch.clientY - rect.top) * scaleY, 0, canvas.height);
    setCropEnd({ x, y });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (cropMode) {
      updateCropPreview();
    }
  };

  // Crop presets
  const setPresetSquare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const side = Math.min(cw, ch);
    const startX = (cw - side) / 2;
    const startY = (ch - side) / 2;
    setCropStart({ x: startX, y: startY });
    setCropEnd({ x: startX + side, y: startY + side });
    setTimeout(updateCropPreview, 0);
  };

  const setPreset16_9 = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const ratio = 16 / 9;
    let cropWidth, cropHeight;
    if (cw / ch > ratio) {
      cropHeight = ch;
      cropWidth = ch * ratio;
    } else {
      cropWidth = cw;
      cropHeight = cw / ratio;
    }
    const startX = (cw - cropWidth) / 2;
    const startY = (ch - cropHeight) / 2;
    setCropStart({ x: startX, y: startY });
    setCropEnd({ x: startX + cropWidth, y: startY + cropHeight });
    setTimeout(updateCropPreview, 0);
  };

  // Commit the crop preview when the user clicks "Apply Crop".
  const handleApplyCrop = () => {
    if (!previewDataUrl) return;
    const newImg = new Image();
    newImg.onload = () => {
      // Update the base image with the newly cropped image.
      setImage(newImg);
      setPreviewDataUrl(null);
      setCropMode(false);
    };
    newImg.src = previewDataUrl;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
    onClose();
  };

  return (
    <div id="image-editor-container" className="container mx-auto py-8 px-4 animate-fade-in">
      <Card id="image-editor-card" className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader id="image-editor-header" className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <CardTitle id="image-editor-title" className="text-2xl text-gray-800 dark:text-white">
            Edit Profile Picture
          </CardTitle>
        </CardHeader>

        <CardContent className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700">
                <canvas
                  id="image-editor-canvas"
                  ref={canvasRef}
                  className="max-w-full max-h-[400px] h-full mx-auto"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              </div>
            </div>

            <div id="image-editor-tabs">
              <Tabs defaultValue="adjustments">
                <TabsList className="w-full mb-4 bg-gray-50 dark:bg-gray-700">
                  <TabsTrigger id="adjustments-tab" value="adjustments" className="flex-1 text-gray-800 dark:text-gray-200">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Adjustments
                  </TabsTrigger>
                  <TabsTrigger id="crop-tab" value="crop" className="flex-1 text-gray-800 dark:text-gray-200">
                    <Crop className="h-4 w-4 mr-2" />
                    Crop
                  </TabsTrigger>
                </TabsList>

                <TabsContent id="adjustments-content" value="adjustments" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-800 dark:text-gray-200">
                          Brightness
                        </label>
                        <span className="text-sm text-gray-500">
                          {adjustments.brightness}%
                        </span>
                      </div>
                      <Slider
                        id="brightness-slider"
                        min={0}
                        max={200}
                        value={[adjustments.brightness]}
                        onValueChange={(value) =>
                          setAdjustments((prev) => ({
                            ...prev,
                            brightness: value[0],
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-800 dark:text-gray-200">
                          Contrast
                        </label>
                        <span className="text-sm text-gray-500">
                          {adjustments.contrast}%
                        </span>
                      </div>
                      <Slider
                        id="contrast-slider"
                        min={0}
                        max={200}
                        value={[adjustments.contrast]}
                        onValueChange={(value) =>
                          setAdjustments((prev) => ({
                            ...prev,
                            contrast: value[0],
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-800 dark:text-gray-200">
                          Saturation
                        </label>
                        <span className="text-sm text-gray-500">
                          {adjustments.saturation}%
                        </span>
                      </div>
                      <Slider
                        id="saturation-slider"
                        min={0}
                        max={200}
                        value={[adjustments.saturation]}
                        onValueChange={(value) =>
                          setAdjustments((prev) => ({
                            ...prev,
                            saturation: value[0],
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-gray-800 dark:text-gray-200">
                          Vignette
                        </label>
                        <span className="text-sm text-gray-500">
                          {adjustments.vignette}%
                        </span>
                      </div>
                      <Slider
                        id="vignette-slider"
                        min={0}
                        max={100}
                        value={[adjustments.vignette]}
                        onValueChange={(value) =>
                          setAdjustments((prev) => ({
                            ...prev,
                            vignette: value[0],
                          }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent id="crop-content" value="crop" className="space-y-4">
                  {cropMode && (
                    <div className="flex gap-2 mb-2">
                      <Button id="preset-square" variant="outline" onClick={setPresetSquare}>
                        Square
                      </Button>
                      <Button id="preset-16-9" variant="outline" onClick={setPreset16_9}>
                        16:9
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {!cropMode ? (
                      <Button
                        id="start-cropping-button"
                        onClick={() => {
                          setCropMode(true);
                          setPreviewDataUrl(null);
                        }}
                        className="w-full"
                      >
                        <Crop className="h-4 w-4 mr-2" />
                        Start Cropping
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Drag or use presets to select crop area. Preview shown below.
                        </p>
                        <div className="flex gap-2">
                          <Button id="apply-crop-button" onClick={handleApplyCrop} className="flex-1">
                            Apply Crop
                          </Button>
                          <Button
                            id="cancel-crop-button"
                            variant="outline"
                            onClick={() => {
                              setCropMode(false);
                              setPreviewDataUrl(null);
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between bg-white dark:bg-gray-800">
          <Button
            id="editor-cancel-button"
            variant="outline"
            onClick={onCancel}
            className="destructiveBtn"
          >
            Cancel
          </Button>
          <Button
            id="editor-save-button"
            onClick={handleSave}
            className="flex items-center gap-2 affimativeBtn"
          >
            <Download className="h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
