import { useState, useRef } from "react";
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
  const {
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
  } = config;

  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeMethod, setResizeMethod] = useState("dimensions");
  const [resizeSettings, setResizeSettings] = useState({
    width,
    height,
    unit,
    dpi,
    percentage,
    targetSize,
    quality,
    format,
    maintainAspectRatio,
  });
  const fileInputRef = useRef(null);
  let fileId = "";

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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedImage(e.target.files[0]);

    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    /**const reader = new FileReader();
    reader.onload = (e) => {
    };
    reader.readAsDataURL(file);**/
  };

  // Handle resize button click
  const handleResize = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", uploadedImage);

    const apiURL = process.env.API_URL ?? "http://13.235.79.119:2626";

    const uploadFile = await fetch(apiURL + "/upload", {
      method: "POST",
      body: formData,
    });
    const uploadFileRes = await uploadFile.json();
    if (uploadFileRes.data.fileId) {
      fileId = uploadFileRes.data.fileId;
    }

    const processImage = await fetch(apiURL + "/image", {
      method: "POST",
      body: JSON.stringify({
        fileId: fileId,
        action: {
          resize: {
            unit: resizeSettings.unit,
            dpi: resizeSettings.dpi,
            width: resizeSettings.width,
            height: resizeSettings.height,
          },
          rotate: resizeSettings.rotate,
          resizePercentage: resizeSettings.percentage,
          targetSize: resizeSettings.targetSize,
          quality: resizeSettings.quality,
          format: resizeSettings.format,
          maintainAspectRatio: resizeSettings.maintainAspectRatio,
        },
      }),
    });
    const imageBlob = await processImage.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    setPreviewImage(imageUrl);
    setIsProcessing(false);
  };

  // Handle download button click
  const handleDownload = () => {
    if (!previewImage) return;

    const link = document.createElement("a");
    link.href = previewImage;
    link.download = `resized-${uploadedImage.name}`;
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
                  {/**<img
                    src={uploadedImage.src}
                    alt="Uploaded image preview"
                    className="max-h-[300px] mx-auto rounded-md"
                  />**/}
                  <div className="mt-2 text-sm text-muted-foreground">
                    {uploadedImage.name} (
                    {Math.round(uploadedImage.size / 1024)} KB)
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
                    setPreviewImage(null);
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
                    <Label htmlFor="width">Width ({unit})</Label>
                    <Input
                      id="width"
                      type="number"
                      value={resizeSettings.width}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          width: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height ({unit})</Label>
                    <Input
                      id="height"
                      type="number"
                      value={resizeSettings.height}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          height: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <select
                      id="unit"
                      className="w-full border rounded px-3 py-2"
                      value={resizeSettings.unit}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          unit: e.target.value,
                        })
                      }
                    >
                      <option value="px">Pixels (px)</option>
                      <option value="in">Inches (in)</option>
                      <option value="cm">Centimeters (cm)</option>
                    </select>
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
                          dpi: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rotate">Rotate (°) optional</Label>
                    <input
                      id="rotate"
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      value={resizeSettings.rotate}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          rotate: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter angle e.g. 90"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Percentage Tab */}
              {percentage && (
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
              )}

              {/* File Size Tab */}
              {targetSize && (
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
              )}
            </Tabs>

            {/* Common Settings */}
            <div className="space-y-4 border-t pt-4">
              {resizeMethod &&
                resizeMethod !== "filesize" &&
                resizeSettings.quality != null && (
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aspect-ratio"
                  checked={resizeSettings.maintainAspectRatio}
                  onCheckedChange={(checked) =>
                    setResizeSettings({
                      ...resizeSettings,
                      maintainAspectRatio: checked,
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
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewImage && !isProcessing && uploadedImage && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="flex flex-col items-center">
              <div className="bg-muted rounded-md p-2">
                <NextImage
                  src={previewImage}
                  alt="Preview of resized image"
                  height={pixelHeight}
                  width={pixelWidth}
                  className="max-h-[300px] rounded"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Resized image preview <br /> Downloadable image will be in good
                quality, don't worry!
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4">
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
