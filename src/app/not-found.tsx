import { locale } from "./utils/locale";

export default function NotFound() {
  const language = locale();

  return (
    <div>
      <h1>{language === "fi" ? "Sivua ei löytynyt" : "Page was not found"}</h1>
    </div>
  );
}
