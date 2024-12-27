import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LanguagePicker } from "./language/LanguagePicker";
import styles from "./layout.module.css";
import { Logo } from "./logo/Logo";
import { locale } from "./utils/locale";

export const revalidate = 3600;

const siteNames = {
  en: "Who’s your favorite Bond?",
  fi: "Kuka on sun lemppari Bond?",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const siteName = siteNames[await locale()];

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    icons: [{ rel: "icon", url: "/favicon.png" }],
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await locale();
  const siteName = siteNames[language];

  return (
    <html lang={language}>
      <body>
        <div className={styles.content}>
          <header className={styles.header}>
            <LanguagePicker />
            <Logo siteName={siteName} />
          </header>
          <nav className={styles.sidebar}></nav>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <Link href="/">{language === "fi" ? "Etusivu" : "Front page"}</Link>
            {" | "}
            <Link href={language === "fi" ? "/tietoa" : "/about"}>
              {language === "fi" ? "Tietoa sivusta" : "About the page"}
            </Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
