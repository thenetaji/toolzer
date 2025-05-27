import { join } from "path";

export const imageFullPath = (imageName) => {
  const root = process.cwd();
  return join(root, "uploads", "image", `${imageName ?? ""}`);
};
