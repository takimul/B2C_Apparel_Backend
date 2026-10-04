import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Verigo Essential API running on port ${env.PORT}`);

  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

const shutdown = async () => {
  console.log("Shutting down server...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
