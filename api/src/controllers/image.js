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
      maintainAspectRatio,
    } = action;
    /**
   * action object 
      resize: { 
        width,
        height
      },
      percentage, it means change the width and height according to the value like if the value is 50% then width would be reduced to 50% and same with height
      targetSize, the size of the image to be made, if its present the quality would be ignored and would be dynamically decided
      quality, 70% of the original image
      format, jpeg, png
      maintainAspectRatio
  */

    let image = sharp(imageFullPath(fileId));

    if (resize && Object.keys(resize).length != 0) {
      const resizeParam = {};

      if (percentage) {
        const imageMeta = await getImageMetadata(image);
        resizeParam.width = (imageMeta.width * percentage) / 100;
        resizeParam.height = (imageMeta.height * percentage) / 100;
      }

      image = image.resize(
        resizeParam.width ?? resize.width,
        resizeParam.height ?? resize.height,
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
          image = image.jpeg({ imgQuality });
          break;
        case "png":
          image = image.png({ imgQuality });
          break;
        case "webp":
          image = image.webp({ imgQuality });
          break;
        case "webm":
          image = image.webp({ imgQuality });
          break;
        case "avif":
          image = image.avif({ imgQuality });
          break;
        default:
          return c.json(
            {
              success: false,
              error: {
                code: StatusCodes.BAD_REQUEST,
                message: "Unsupported file format" + outputFormat,
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

        const cloned = image.clone(); // avoid reuse issues

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

    const buffer = await image.toBuffer();
    const contentType = `image/${format}`;
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
  const meta = image.metadata();
  return meta;
};

export default imageController;
