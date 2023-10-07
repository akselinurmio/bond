import { headers } from "next/headers";
import "server-only";

export function locale() {
  const hostname = headers().get("host");

  if (hostname && hostname.startsWith("whoisyourfavorite.bond")) {
    return "en";
  }

  return "fi";
}
