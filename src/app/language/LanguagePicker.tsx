import { locale } from "app/utils/locale";
import Image from "next/image";
import flagFi from "app/assets/Animated-Flag-Finland.gif";
import flagUk from "app/assets/Animated-Flag-United-Kingdom.gif";
import styles from "./LanguagePicker.module.css";

export function LanguagePicker() {
  const language = locale();

  return (
    <a
      href={
        language === "fi"
          ? "https://whoisyourfavorite.bond/"
          : "https://lemppari.bond/"
      }
      hrefLang={language === "fi" ? "en" : "fi"}
      lang={language === "fi" ? "en" : "fi"}
      rel="alternate"
    >
      <Image
        src={language === "fi" ? flagUk : flagFi}
        alt={language === "fi" ? "In English" : "Suomeksi"}
        priority
        className={styles.image}
        width={36}
        height={24}
      />
    </a>
  );
}
