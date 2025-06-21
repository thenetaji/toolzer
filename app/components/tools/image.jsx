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
import {
  Upload,
  Download,
  Image as ImageIcon,
  Loader2,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [resizedImageSize, setResizedImageSize] = useState(0);
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

  // Helper component for tooltips
  const InfoTooltip = ({ text }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground ml-1 inline cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        {!uploadedImage ? (
          /* Step 1: Upload Image - Simple, focused interface */
          <div className="text-center space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Image Resizer</h2>
              <p className="text-muted-foreground">
                Resize, compress, and convert your images easily
              </p>
            </div>
            
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mx-auto cursor-pointer hover:bg-muted/50 transition-colors max-w-md"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex flex-col items-center justify-center py-8">
                <Upload className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-2">
                  Click to upload an image
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  or drag and drop image here
                </p>
                <Button size="lg" className="px-8">
                  Select Image
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Supports JPG, PNG, WebP and other image formats
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          /* Step 2: Edit Image - After upload */
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Your Image</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadedImage(null);
                  setUploadedImageUrl(null);
                  setPreviewImage(null);
                  setResizedImageSize(0);
                }}
              >
                Upload a different image
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Original Image */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    Original Image
                  </h3>
                  <div className="relative flex justify-center bg-checkerboard rounded-md overflow-hidden">
                    <img
                      src={uploadedImageUrl}
                      alt="Original image"
                      className="max-h-[300px] object-contain"
                    />
                  </div>
                  <div className="mt-3 text-sm">
                    <p><strong>File:</strong> {uploadedImage.name}</p>
                    <p><strong>Size:</strong> {formatFileSize(uploadedImage.size)}</p>
                    <p><strong>Dimensions:</strong> {originalDimensions.width} × {originalDimensions.height} pixels</p>
                  </div>
                </div>

                {/* Preview (if available) */}
                {previewImage && !isProcessing && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      New Image
                      <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full px-2 py-0.5">
                        Preview
                      </span>
                    </h3>
                    <div className="relative flex justify-center bg-checkerboard rounded-md overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview of resized image"
                        className="max-h-[300px] object-contain"
                      />
                    </div>
                    <div className="mt-3 text-sm">
                      <p><strong>New size:</strong> {formatFileSize(resizedImageSize)}</p>
                      {resizeMethod === "dimensions" && (
                        <p><strong>New dimensions:</strong> {Math.round(pixelWidth)} × {Math.round(pixelHeight)} pixels</p>
                      )}
                      <p className="mt-1 text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {Math.round(((uploadedImage.size - resizedImageSize) / uploadedImage.size) * 100)}% smaller
                        </span> than original
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleDownload} 
                      className="w-full mt-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download This Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column - Editing Controls */}
              <div className="space-y-6">
                {/* Simple Options for Beginners */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">How do you want to resize?</h3>
                  
                  <Tabs defaultValue="simple" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="simple" onClick={() => setResizeMethod("percentage")}>
                        Simple
                      </TabsTrigger>
                      <TabsTrigger value="advanced" onClick={() => setResizeMethod("dimensions")}>
                        Custom Size
                      </TabsTrigger>
                      <TabsTrigger value="compress" onClick={() => setResizeMethod("filesize")}>
                        Compress
                      </TabsTrigger>
                    </TabsList>

                    {/* Simple Tab (Percentage) */}
                    <TabsContent value="simple" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="percentage" className="text-base">
                              Image Size
                              <InfoTooltip text="Adjust the slider to make your image smaller or larger" />
                            </Label>
                            <span className="font-medium">
                              {resizeSettings.percentage}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Smaller</span>
                            <Slider
                              id="percentage"
                              min={10}
                              max={100}
                              step={5}
                              value={[resizeSettings.percentage]}
                              onValueChange={(value) =>
                                setResizeSettings({
                                  ...resizeSettings,
                                  percentage: value[0],
                                })
                              }
                              className="flex-1"
                            />
                            <span className="text-xs">Original</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {resizeSettings.percentage < 100
                              ? `Image will be ${resizeSettings.percentage}% of the original size`
                              : "Original size"}
                          </p>
                        </div>

                        {/* Format Selection */}
                        <div className="mt-4">
                          <Label htmlFor="format" className="text-base">
                            Image Format
                            <InfoTooltip text="JPEG for photos, PNG for screenshots or graphics, WebP for best compression" />
                          </Label>
                          <Select
                            value={resizeSettings.format}
                            onValueChange={(value) =>
                              setResizeSettings({ ...resizeSettings, format: value })
                            }
                          >
                            <SelectTrigger id="format" className="mt-2">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jpeg">JPEG - Best for Photos</SelectItem>
                              <SelectItem value="png">PNG - Best for Graphics</SelectItem>
                              <SelectItem value="webp">WebP - Smallest File Size</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Advanced Tab (Dimensions) */}
                    <TabsContent value="advanced" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width" className="flex items-center">
                            Width
                            <InfoTooltip text="Enter the desired width for your image" />
                          </Label>
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
                          <Label htmlFor="height" className="flex items-center">
                            Height
                            <InfoTooltip text="Enter the desired height for your image" />
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
                      </div>

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
                          className="text-sm font-medium"
                        >
                          Keep proportions
                          <InfoTooltip text="When checked, the image dimensions will stay proportional to avoid distortion" />
                        </label>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="format" className="flex items-center">
                          File Format
                          <InfoTooltip text="JPEG for photos, PNG for screenshots or graphics, WebP for best compression" />
                        </Label>
                        <Select
                          value={resizeSettings.format}
                          onValueChange={(value) =>
                            setResizeSettings({ ...resizeSettings, format: value })
                          }
                        >
                          <SelectTrigger id="format" className="mt-2">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jpeg">JPEG - Best for Photos</SelectItem>
                            <SelectItem value="png">PNG - Best for Graphics</SelectItem>
                            <SelectItem value="webp">WebP - Smallest File Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    {/* Compress Tab (File Size) */}
                    <TabsContent value="compress" className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="filesize" className="flex items-center text-base">
                            Target File Size
                            <InfoTooltip text="Adjust to set your desired file size. The image will be compressed to be close to this size." />
                          </Label>
                          <span className="font-medium">
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
                        <p className="text-xs text-muted-foreground mt-2">
                          Drag the slider to set your target file size
                        </p>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="format" className="flex items-center">
                          File Format
                          <InfoTooltip text="For best compression, WebP is recommended" />
                        </Label>
                        <Select
                          value={resizeSettings.format}
                          onValueChange={(value) =>
                            setResizeSettings({ ...resizeSettings, format: value })
                          }
                        >
                          <SelectTrigger id="format" className="mt-2">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jpeg">JPEG - Good Compression</SelectItem>
                            <SelectItem value="webp">WebP - Best Compression</SelectItem>
                            <SelectItem value="png">PNG - Less Compression</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Optional Adjustments */}
                <div className="border rounded-lg p-4">
                  <details>
                    <summary className="text-lg font-medium cursor-pointer mb-4">
                      Extra Options
                    </summary>
                    
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="rotate" className="flex items-center">
                          Rotate Image
                          <InfoTooltip text="Rotate your image if needed" />
                        </Label>
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
                            <SelectItem value="90">Rotate right (90°)</SelectItem>
                            <SelectItem value="180">Upside down (180°)</SelectItem>
                            <SelectItem value="270">Rotate left (270°)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {resizeMethod !== "filesize" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="quality" className="flex items-center">
                              Image Quality
                              <InfoTooltip text="Higher quality means larger file size, lower quality means smaller file size" />
                            </Label>
                            <span className="text-sm">{resizeSettings.quality}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Lower</span>
                            <Slider
                              id="quality"
                              min={10}
                              max={100}
                              step={5}
                              value={[resizeSettings.quality]}
                              onValueChange={(value) =>
                                setResizeSettings({
                                  ...resizeSettings,
                                  quality: value[0],
                                })
                              }
                              className="flex-1"
                            />
                            <span className="text-xs">Higher</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                </div>

                {/* Process Button */}
                <Button
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing your image...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" />
                      {previewImage ? "Update Image" : "Process Image"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Text */}
        {!uploadedImage && (
          <div className="mt-10 text-sm text-muted-foreground">
            <h3 className="font-medium mb-2">What you can do with this tool:</h3>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Resize images to specific dimensions</li>
              <li>Make images smaller or larger by percentage</li>
              <li>Compress images to a target file size</li>
              <li>Convert between image formats (JPEG, PNG, WebP)</li>
              <li>Rotate images as needed</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}