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
}

export default function ImageEditor({
  sourceImage,
  onSave,
  onClose,
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

  // Helper to ensure a value stays within [min, max]
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Initialize image from source prop
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
      // If in crop mode and a preview exists (and not dragging), display the preview.
      const previewImg = new Image();
      previewImg.onload = () => {
        canvas.width = previewImg.width;
        canvas.height = previewImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(previewImg, 0, 0);
      };
      previewImg.src = previewDataUrl;
    } else {
      // Draw the original image with adjustments (if not cropping) or with crop overlay while dragging.
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      if (!cropMode) {
        applyAdjustments(ctx, canvas.width, canvas.height);
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

  const applyAdjustments = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const brightness = adjustments.brightness / 100;
    const contrast = adjustments.contrast / 100;
    const saturation = adjustments.saturation / 100;

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      data[i] = Math.min(255, Math.max(0, data[i] * brightness));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * brightness));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * brightness));

      // Apply contrast
      const factor =
        (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(
        255,
        Math.max(0, factor * (data[i + 1] - 128) + 128)
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, factor * (data[i + 2] - 128) + 128)
      );

      // Apply saturation
      const gray =
        0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.min(255, Math.max(0, gray + saturation * (data[i] - gray)));
      data[i + 1] = Math.min(
        255,
        Math.max(0, gray + saturation * (data[i + 1] - gray))
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, gray + saturation * (data[i + 2] - gray))
      );
    }
    ctx.putImageData(imageData, 0, 0);

    // Apply vignette effect
    if (adjustments.vignette > 0) {
      const vignette = adjustments.vignette / 100;
      ctx.save();
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.5, "rgba(0,0,0,0)");
      gradient.addColorStop(1, `rgba(0,0,0,${vignette})`);
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

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

    // Draw overlay outside crop area
    ctx.fillRect(0, 0, canvasWidth, y);
    ctx.fillRect(0, y, x, height);
    ctx.fillRect(x + width, y, canvasWidth - (x + width), height);
    ctx.fillRect(0, y + height, canvasWidth, canvasHeight - (y + height));
  };

  // This function computes the crop preview and sets it in state.
  const updateCropPreview = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Clamp the crop coordinates to ensure they remain within bounds.
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
    // Draw the current canvas area into the temp canvas.
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    const croppedDataUrl = tempCanvas.toDataURL("image/png");
    setPreviewDataUrl(croppedDataUrl);
  };

  // Mouse handlers for cropping
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

  // Touch handlers for cropping (mobile support)
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

  // Crop preset functions
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

  // When the user clicks "Apply Crop", commit the preview.
  const handleApplyCrop = () => {
    if (!previewDataUrl) return;
    const newImg = new Image();
    newImg.onload = () => {
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
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl text-gray-800 dark:text-white">
            Edit Profile Picture
          </CardTitle>
          <Button variant="outline" onClick={onClose}>
            Close Editor
          </Button>
        </CardHeader>

        <CardContent className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[400px] mx-auto"
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

            <div>
              <Tabs defaultValue="adjustments">
                <TabsList className="w-full mb-4 bg-gray-50 dark:bg-gray-700">
                  <TabsTrigger
                    value="adjustments"
                    className="flex-1 text-gray-800 dark:text-gray-200"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Adjustments
                  </TabsTrigger>
                  <TabsTrigger
                    value="crop"
                    className="flex-1 text-gray-800 dark:text-gray-200"
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Crop
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="adjustments" className="space-y-6">
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

                <TabsContent value="crop" className="space-y-4">
                  {cropMode && (
                    <div className="flex gap-2 mb-2">
                      <Button variant="outline" onClick={setPresetSquare}>
                        Square
                      </Button>
                      <Button variant="outline" onClick={setPreset16_9}>
                        16:9
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {!cropMode ? (
                      <Button
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
                          Drag or use presets to select crop area. Preview shown
                          below.
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={handleApplyCrop} className="flex-1">
                            Apply Crop
                          </Button>
                          <Button
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
