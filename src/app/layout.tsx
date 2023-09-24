import type { Metadata } from "next";
import { locale } from "./_locales/_locale";
import "./globals.css";
import styles from "./layout.module.css";
import { Logo } from "./_assets/Logo";

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
    viewport: {
      initialScale: 1,
      width: 1024,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const siteName = siteNames[locale()];

  return (
    <html lang={locale()}>
      <body>
        <div className={styles.content}>
          <header className={styles.header}>
            <Logo siteName={siteName} locale={locale()} />
          </header>
          <nav className={styles.sidebar}></nav>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}></footer>
        </div>
      </body>
    </html>
  );
}
