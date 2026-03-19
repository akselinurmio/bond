import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = await headers();
  const lang = headersList.get("x-lang");

  return (
    <div>
      <h1>{lang === "fi" ? "Sivua ei löytynyt" : "Page was not found"}</h1>
    </div>
  );
}
