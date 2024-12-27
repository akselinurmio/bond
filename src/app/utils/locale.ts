import { headers } from "next/headers";
import "server-only";

export async function locale() {
  const hostname = (await headers()).get("host");

  if (hostname && hostname.startsWith("whoisyourfavorite.bond")) {
    return "en";
  }

  return "fi";
}
