import type { Metadata } from "next";
import { locale } from "./_locales/_locale";
import "./globals.css";
import styles from "./layout.module.css";
import { Logo } from "./_assets/Logo";

const siteNames = {
  en: "Who’s your favorite Bond?",
  fi: "Kuka on sun lemppari Bond?",
};

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
  const siteName = siteNames[locale()];

  return (
    <html lang={locale()}>
      <body className={styles.content}>
        <header className={styles.header}>
          <Logo siteName={siteName} locale={locale()} />
        </header>
        <nav className={styles.sidebar}></nav>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}></footer>
      </body>
    </html>
  );
}
