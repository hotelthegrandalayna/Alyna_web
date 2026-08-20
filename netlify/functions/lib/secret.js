import crypto from "node:crypto";
import { cfg } from "./config.js";

/** Shared secret between the webhook and its background worker. */
export function internalSecret() {
  const seed = process.env.BOT_INTERNAL_SECRET || cfg.appSecret || cfg.verifyToken || "alyna";
  return crypto.createHash("sha256").update(`alyna-messenger:${seed}`).digest("hex");
}
