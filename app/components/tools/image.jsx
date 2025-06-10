import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Download, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImageTool({ config }) {
  // Initialize with config values or defaults
  const {
    width = 800,
    height = 600,
    unit = "px",
    dpi = 72,
    percentage = 100,
    targetSize = 500,
    quality = 80,
    format = "jpeg",
    rotate = 0,
    maintainAspectRatio = true,
  } = config || {};

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeMethod, setResizeMethod] = useState("dimensions");
  const [resizedImageSize, setResizedImageSize] = useState(0); // Store the resized file size
  const [resizeSettings, setResizeSettings] = useState({
    width,
    height,
    unit,
    dpi,
    percentage,
    targetSize,
    quality,
    format,
    rotate,
    maintainAspectRatio,
  });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle unit conversion
  const unitValue = resizeSettings.unit;
  const dpiValue = resizeSettings.dpi ?? 72;

  const inchToPx = (value) => value * dpiValue;
  const cmToPx = (value) => (value / 2.54) * dpiValue;

  const getPixelValue = (value) => {
    if (unitValue === "in") return inchToPx(value);
    if (unitValue === "cm") return cmToPx(value);
    return value;
  };

  const pixelWidth = getPixelValue(resizeSettings.width);
  const pixelHeight = getPixelValue(resizeSettings.height);

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  // Load image and get original dimensions when uploaded
  useEffect(() => {
    if (uploadedImage) {
      const imgUrl = URL.createObjectURL(uploadedImage);
      setUploadedImageUrl(imgUrl);

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height,
        });

        // Set initial dimensions based on the uploaded image
        if (resizeMethod === "dimensions") {
          setResizeSettings((prev) => ({
            ...prev,
            width:
              unitValue === "px"
                ? img.width
                : unitValue === "in"
                  ? img.width / dpiValue
                  : (img.width / dpiValue) * 2.54,
            height:
              unitValue === "px"
                ? img.height
                : unitValue === "in"
                  ? img.height / dpiValue
                  : (img.height / dpiValue) * 2.54,
          }));
        }
      };
      img.src = imgUrl;
    }
  }, [uploadedImage, resizeMethod, unitValue, dpiValue]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    setUploadedImage(file);
    setPreviewImage(null); // Reset preview when new image is uploaded
    setResizedImageSize(0); // Reset resized image size
  };

  // Handle resize button click - browser-based processing
  const handleResize = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);

    try {
      // Create a canvas for processing
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Create an image object to draw on canvas
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions based on resize method
        let targetWidth, targetHeight;

        if (resizeMethod === "dimensions") {
          targetWidth = getPixelValue(resizeSettings.width);
          targetHeight = getPixelValue(resizeSettings.height);

          // Maintain aspect ratio if needed
          if (resizeSettings.maintainAspectRatio) {
            const aspectRatio = img.width / img.height;

            // Determine which dimension to adjust
            if (targetWidth / targetHeight > aspectRatio) {
              targetWidth = targetHeight * aspectRatio;
            } else {
              targetHeight = targetWidth / aspectRatio;
            }
          }
        } else if (resizeMethod === "percentage") {
          const scale = resizeSettings.percentage / 100;
          targetWidth = img.width * scale;
          targetHeight = img.height * scale;
        } else {
          // filesize method - start with original size and adjust quality later
          targetWidth = img.width;
          targetHeight = img.height;
        }

        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Handle rotation if needed
        if (resizeSettings.rotate && resizeSettings.rotate !== 0) {
          const angleInRadians = (resizeSettings.rotate * Math.PI) / 180;

          // Adjust canvas size for rotation
          if (resizeSettings.rotate % 180 !== 0) {
            // Swap dimensions for 90/270 degree rotations
            canvas.width = targetHeight;
            canvas.height = targetWidth;
          }

          // Translate and rotate
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(angleInRadians);
          ctx.drawImage(
            img,
            -targetWidth / 2,
            -targetHeight / 2,
            targetWidth,
            targetHeight,
          );
        } else {
          // No rotation, just resize
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }

        // Convert canvas to blob with proper format and quality
        const mimeType = `image/${resizeSettings.format === "jpg" ? "jpeg" : resizeSettings.format}`;

        // For filesize method, we need to iteratively adjust quality
        if (resizeMethod === "filesize") {
          // Start with a high quality and decrease until target size is reached
          let quality = 0.9;
          const targetBytes = resizeSettings.targetSize * 1024; // Convert KB to bytes

          const reduceQualityUntilSize = () => {
            canvas.toBlob(
              (blob) => {
                if (blob.size > targetBytes && quality > 0.1) {
                  quality -= 0.05; // Reduce quality
                  reduceQualityUntilSize(); // Try again
                } else {
                  // We have a blob with acceptable size
                  handleProcessedBlob(blob);
                }
              },
              mimeType,
              quality,
            );
          };

          reduceQualityUntilSize();
        } else {
          // Use specified quality for other methods
          canvas.toBlob(
            (blob) => handleProcessedBlob(blob),
            mimeType,
            resizeSettings.quality / 100,
          );
        }
      };

      // Load the image
      img.src = URL.createObjectURL(uploadedImage);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessing(false);
    }
  };

  // Handle the processed image blob
  const handleProcessedBlob = (blob) => {
    const imageUrl = URL.createObjectURL(blob);
    setPreviewImage(imageUrl);
    setResizedImageSize(blob.size); // Store the size of the resized image
    setIsProcessing(false);
  };

  // Handle download button click
  const handleDownload = () => {
    if (!previewImage) return;

    // Create extension based on format
    const extension =
      resizeSettings.format === "jpg" ? "jpeg" : resizeSettings.format;

    // Create file name
    const originalName = uploadedImage.name.split(".")[0] || "image";
    const fileName = `${originalName}-resized.${extension}`;

    const link = document.createElement("a");
    link.href = previewImage;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              {!uploadedImage ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">
                    Upload Your Image
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <Button variant="outline">Select File</Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded image preview"
                    className="max-h-[300px] mx-auto rounded-md object-contain"
                  />
                  <div className="mt-2 text-sm text-muted-foreground overflow-scroll">
                    {uploadedImage.name} ({formatFileSize(uploadedImage.size)})
                    <br />
                    {originalDimensions.width} × {originalDimensions.height} px
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>

            {uploadedImage && (
              <div className="text-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setUploadedImage(null);
                    setUploadedImageUrl(null);
                    setPreviewImage(null);
                    setResizedImageSize(0);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Settings and Controls */}
          <div className="space-y-6">
            <Tabs defaultValue="dimensions" onValueChange={setResizeMethod}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="percentage">Percentage</TabsTrigger>
                <TabsTrigger value="filesize">File Size</TabsTrigger>
              </TabsList>

              {/* Dimensions Tab */}
              <TabsContent value="dimensions" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width ({resizeSettings.unit})</Label>
                    <Input
                      id="width"
                      type="number"
                      value={resizeSettings.width}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          width: parseInt(e.target.value) || 0,
                          height:
                            resizeSettings.maintainAspectRatio &&
                            originalDimensions.width
                              ? Math.round(
                                  ((parseInt(e.target.value) || 0) *
                                    originalDimensions.height) /
                                    originalDimensions.width,
                                )
                              : resizeSettings.height,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">
                      Height ({resizeSettings.unit})
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={resizeSettings.height}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          height: parseInt(e.target.value) || 0,
                          width:
                            resizeSettings.maintainAspectRatio &&
                            originalDimensions.height
                              ? Math.round(
                                  ((parseInt(e.target.value) || 0) *
                                    originalDimensions.width) /
                                    originalDimensions.height,
                                )
                              : resizeSettings.width,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={resizeSettings.unit}
                      onValueChange={(value) =>
                        setResizeSettings({
                          ...resizeSettings,
                          unit: value,
                          // Convert current values to new unit
                          width:
                            value === "px"
                              ? pixelWidth
                              : value === "in"
                                ? pixelWidth / dpiValue
                                : (pixelWidth / dpiValue) * 2.54,
                          height:
                            value === "px"
                              ? pixelHeight
                              : value === "in"
                                ? pixelHeight / dpiValue
                                : (pixelHeight / dpiValue) * 2.54,
                        })
                      }
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">Pixels (px)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dpi">DPI</Label>
                    <Input
                      id="dpi"
                      type="number"
                      value={resizeSettings.dpi}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          dpi: parseInt(e.target.value) || 72,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Percentage Tab */}
              <TabsContent value="percentage" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="percentage">
                      Resize to {resizeSettings.percentage}%
                    </Label>
                    <span className="text-muted-foreground">
                      {resizeSettings.percentage}%
                    </span>
                  </div>
                  <Slider
                    id="percentage"
                    min={1}
                    max={100}
                    step={1}
                    value={[resizeSettings.percentage]}
                    onValueChange={(value) =>
                      setResizeSettings({
                        ...resizeSettings,
                        percentage: value[0],
                      })
                    }
                  />
                </div>
              </TabsContent>

              {/* File Size Tab */}
              <TabsContent value="filesize" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="filesize">
                      Target File Size: {resizeSettings.targetSize} KB
                    </Label>
                    <span className="text-muted-foreground">
                      {resizeSettings.targetSize} KB
                    </span>
                  </div>
                  <Slider
                    id="filesize"
                    min={10}
                    max={1000}
                    step={10}
                    value={[resizeSettings.targetSize]}
                    onValueChange={(value) =>
                      setResizeSettings({
                        ...resizeSettings,
                        targetSize: value[0],
                      })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Common Settings */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="rotate">Rotate (°)</Label>
                <Select
                  value={resizeSettings.rotate.toString()}
                  onValueChange={(value) =>
                    setResizeSettings({
                      ...resizeSettings,
                      rotate: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="rotate">
                    <SelectValue placeholder="Select rotation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No rotation</SelectItem>
                    <SelectItem value="90">90° clockwise</SelectItem>
                    <SelectItem value="180">180° rotation</SelectItem>
                    <SelectItem value="270">270° clockwise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resizeMethod !== "filesize" && (
                <div className="space-y-2">
                  <Label htmlFor="quality">
                    Quality: {resizeSettings.quality}%
                  </Label>
                  <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={1}
                    value={[resizeSettings.quality]}
                    onValueChange={(value) =>
                      setResizeSettings({
                        ...resizeSettings,
                        quality: value[0],
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select
                  value={resizeSettings.format}
                  onValueChange={(value) =>
                    setResizeSettings({ ...resizeSettings, format: value })
                  }
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resizeMethod === "dimensions" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aspect-ratio"
                    checked={resizeSettings.maintainAspectRatio}
                    onCheckedChange={(checked) =>
                      setResizeSettings({
                        ...resizeSettings,
                        maintainAspectRatio: !!checked,
                      })
                    }
                  />
                  <label
                    htmlFor="aspect-ratio"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Maintain aspect ratio
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section - UPDATED with file size */}
        {previewImage && !isProcessing && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="flex flex-col items-center">
              <div className="bg-muted rounded-md p-2">
                <img
                  src={previewImage}
                  alt="Preview of resized image"
                  className="max-h-[300px] rounded object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground mt-2 text-center">
                <p>Resized image preview</p>
                <p>
                  File size:{" "}
                  <span className="font-semibold">
                    {formatFileSize(resizedImageSize)}
                  </span>
                </p>
                {resizeMethod === "dimensions" && (
                  <p>
                    Dimensions:{" "}
                    <span className="font-semibold">
                      {Math.round(pixelWidth)}px × {Math.round(pixelHeight)}px
                    </span>
                  </p>
                )}
                {uploadedImage && resizedImageSize > 0 && (
                  <p className="mt-1 text-xs">
                    Original: {formatFileSize(uploadedImage.size)} → New:{" "}
                    {formatFileSize(resizedImageSize)}(
                    {Math.round((resizedImageSize / uploadedImage.size) * 100)}%
                    of original)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 mt-6 pt-4 border-t">
          <Button
            onClick={handleResize}
            disabled={!uploadedImage || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Resize Image
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!previewImage || isProcessing}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Resized Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
