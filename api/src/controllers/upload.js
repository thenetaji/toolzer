import path from "path";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { fileTypeFromBuffer } from "file-type";
import { StatusCodes } from "http-status-codes";
import { generateId } from "../../lib/id.js";
import { imageFullPath } from "../../utils/path.js";

async function handleImageUpload(c) {
  const body = await c.req.parseBody();

  const { file } = body;
  if (
    !file ||
    (file.size == 0 && file.name == "" && !file.type.includes("image/"))
  ) {
    return c.json({
      success: false,
      error: {
        code: StatusCodes.BAD_REQUEST,
        message: "File is missing",
        details: {
          cause:
            "The input field for file is missing. Please send the file under 'file' key value",
        },
      },
      data: {},
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!existsSync(imageFullPath())) {
    mkdirSync(imageFullPath(), { recursive: true });
  }

  /**
   * fileTypeFromBuffer example
   * ext - jpg
   * mime - image/jpeg
   */
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  // const fileName = `${generateId()} - ${file.name}`;
  const fileName = `${generateId()}.${ext}`;

  if (ext && mime.includes("image/")) {
    createWriteStream(imageFullPath(fileName)).write(buffer);

    return c.json({
      success: true,
      error: null,
      data: {
        fileId: fileName,
      },
    });
  } else {
    return c.json({
      success: false,
      error: {
        code: StatusCodes.BAD_REQUEST,
        message: "File type is not image",
        details: {},
      },
      data: {},
    });
  }
}

export { handleImageUpload };
