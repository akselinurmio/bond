import { locale } from "./utils/locale";

export default async function NotFound() {
  const language = await locale();

  return (
    <div>
      <h1>{language === "fi" ? "Sivua ei löytynyt" : "Page was not found"}</h1>
    </div>
  );
}
