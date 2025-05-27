import { Hono } from "hono";
const routes = new Hono();
import imageController from "./controllers/image.js";
import { handleImageUpload } from "./controllers/upload.js";

routes.post("/upload", handleImageUpload);
routes.post("/image", imageController);

export default routes;
