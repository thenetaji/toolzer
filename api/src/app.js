import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

import routes from "./route.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
  }),
);
app.use(logger());
app.use(prettyJSON());

app.route("/", routes);
app.all("*", (c) => {
  return c.json({
    success: false,
    error: {
      code: 404,
      message: "API path not found",
      details: {
        message:
          "You seem curious... but there's nothing here.Try looking in the docs. Or don’t. I’m not your boss. If you’ve made it this far, you deserve a cookie. But this is a server, not a bakery.",
      },
    },
    data: {},
  });
});

export default app;
