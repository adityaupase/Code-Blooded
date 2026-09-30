import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig({ requireGroq: process.env.NODE_ENV === "production" });
const app = createApp({ requireGroq: process.env.NODE_ENV === "production" });

app.listen(config.PORT, () => {
  console.log(`AgriSmart backend listening on port ${config.PORT}`);
});