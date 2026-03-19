import type { Metadata } from "next";
import Link from "next/link";
import { LanguagePicker } from "../language/LanguagePicker";
import styles from "../layout.module.css";
import { Logo } from "../logo/Logo";

const siteNames = {
  en: "Who's your favorite Bond?",
  fi: "Kuka on sun lemppari Bond?",
} as const;

type Locale = keyof typeof siteNames;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fi" }];
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const siteName = siteNames[lang as Locale];

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const language = lang as Locale;
  const siteName = siteNames[language];

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <LanguagePicker language={language} />
        <Logo language={language} siteName={siteName} />
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
  );
}
