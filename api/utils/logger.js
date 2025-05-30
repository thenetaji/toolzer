import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;
