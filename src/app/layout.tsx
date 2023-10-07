import type { Metadata } from "next";
import { locale } from "./utils/locale";
import "./globals.css";
import styles from "./layout.module.css";
import { Logo } from "./assets/Logo";
import { LanguageProvider } from "./contexts/LanguageContext";
import Link from "next/link";

export const revalidate = 3600;

const siteNames = {
  en: "Who’s your favorite Bond?",
  fi: "Kuka on sun lemppari Bond?",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const siteName = siteNames[locale()];

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const language = locale();
  const siteName = siteNames[language];

  return (
    <html lang={language}>
      <body>
        <LanguageProvider language={language}>
          <div className={styles.content}>
            <header className={styles.header}>
              <Logo siteName={siteName} locale={language} />
            </header>
            <nav className={styles.sidebar}></nav>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
              <Link href="/">
                {language === "fi" ? "Etusivu" : "Front page"}
              </Link>
              {" | "}
              <Link href="/about">
                {language === "fi" ? "Tietoa sivusta" : "About the page"}
              </Link>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
