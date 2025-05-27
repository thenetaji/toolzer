import app from "./app.js";
import { serve } from "@hono/node-server";
import chalk from "chalk";
import ora from "ora";

async function startServer() {
  const spinner = ora(chalk.cyan("Starting server...")).start();

  await new Promise((r) => setTimeout(r, 1500));

  spinner.succeed(chalk.green("Server started successfully!"));

  serve(
    {
      fetch: app.fetch,
      port: 2626,
    },
    () => {
      console.log(`
${chalk.red("Listening on:")} ${chalk.underline("http://localhost:2626")}
      `);
    },
  );
}

startServer();
