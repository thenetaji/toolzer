import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import { imageFullPath } from "../../utils/path.js";
import log from "../../utils/logger.js";

async function imageController(c) {
  try {
    const { fileId, action } = await c.req.json();
    const {
      resize,
      percentage,
      targetSize,
      quality,
      format,
      rotate,
      maintainAspectRatio,
    } = action;
    console.log(action)

    let image = sharp(imageFullPath(fileId));

    if (resize && Object.keys(resize).length !== 0) {
      const { width, height, unit = "px", dpi = 72 } = resize;
      const resizeParam = {};

      // Convert cm/inch to px if needed
      const convertToPixels = (value) => {
        if (!value) return undefined;
        switch (unit) {
          case "cm":
            return Math.round((value / 2.54) * dpi);
          case "in":
            return Math.round(value * dpi);
          case "px":
          default:
            return Math.round(value);
        }
      };

      if (percentage) {
        const imageMeta = await getImageMetadata(image);
        resizeParam.width = Math.round((imageMeta.width * percentage) / 100);
        resizeParam.height = Math.round((imageMeta.height * percentage) / 100);
      } else {
        resizeParam.width = convertToPixels(width);
        resizeParam.height = convertToPixels(height);
      }

      image = image.resize(
        resizeParam.width,
        resizeParam.height,
        { fit: maintainAspectRatio ? "inside" : "fill" },
      );
    }

    if (format) {
      const outputFormat = format.toLowerCase();
      const imgQuality = !(targetSize && targetSize != 0)
        ? parseInt(quality)
        : null;

      switch (outputFormat) {
        case "jpeg":
        case "jpg":
          image = image.jpeg({ quality: imgQuality });
          break;
        case "png":
          image = image.png({ quality: imgQuality });
          break;
        case "webp":
        case "webm":
          image = image.webp({ quality: imgQuality });
          break;
        case "avif":
          image = image.avif({ quality: imgQuality });
          break;
        default:
          return c.json(
            {
              success: false,
              error: {
                code: StatusCodes.BAD_REQUEST,
                message: "Unsupported file format " + outputFormat,
              },
              data: null,
            },
            StatusCodes.BAD_REQUEST,
          );
      }
    }

    if (targetSize && targetSize !== 0) {
      const targetSizeKB = targetSize;
      const imageFormat = format?.toLowerCase() || "jpeg";

      let min = 10;
      let max = 100;
      let bestBuffer = null;

      for (let i = 0; i < 7; i++) {
        const quality = Math.floor((min + max) / 2);
        const cloned = image.clone();

        let buffer;
        switch (imageFormat) {
          case "jpeg":
          case "jpg":
            buffer = await cloned.jpeg({ quality }).toBuffer();
            break;
          case "png":
            buffer = await cloned
              .png({
                compressionLevel: Math.round((9 * (100 - quality)) / 100),
              })
              .toBuffer();
            break;
          case "webp":
            buffer = await cloned.webp({ quality }).toBuffer();
            break;
          case "avif":
            buffer = await cloned.avif({ quality }).toBuffer();
            break;
          default:
            throw new Error("Unsupported format for target size optimization");
        }

        const sizeKB = buffer.length / 1024;

        if (sizeKB > targetSizeKB) {
          max = quality - 1;
        } else {
          bestBuffer = buffer;
          min = quality + 1;
        }

        if (Math.abs(sizeKB - targetSizeKB) < 2) break;
      }

      if (bestBuffer) {
        image = sharp(bestBuffer);
      }
    }

    if (rotate) {
      await image.rotate(parseInt(rotate));
    }

    const buffer = await image.toBuffer();
    const contentType = `image/${format || "jpeg"}`;
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    log.error("Error occurred in image controller", err);
    return c.json(
      {
        status: false,
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: err.message,
        },
        data: {},
      },
      StatusCodes.BAD_REQUEST,
    );
  }
}

const getImageMetadata = async (image) => {
  return await image.metadata();
};

export default imageController;