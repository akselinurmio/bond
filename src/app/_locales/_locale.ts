import { headers } from "next/headers";
import "server-only";

export function locale() {
  const hostname = headers().get("host")?.split(":")[0];

  return hostname && hostname === "whoisyourfavorite.bond" ? "en" : "fi";
}
