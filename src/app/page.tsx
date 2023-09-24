import { locale } from "./_locales/_locale";

export default function Home() {
  return locale() === "en"
    ? "The page is under construction..."
    : "Sivu on rakennusvaiheessa...";
}
