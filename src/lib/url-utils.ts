export function stripTrailingSlash(urlOrPath: string) {
  return urlOrPath.endsWith("/") && urlOrPath !== "/"
    ? urlOrPath.slice(0, -1)
    : urlOrPath;
}
