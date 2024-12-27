import { locale } from "app/utils/locale";
import Link from "next/link";
import React from "react";
import styles from "./Logo.module.css";

type Props = {
  siteName: string;
};

export const Logo: React.FC<Props> = async ({ siteName }) => {
  const language = await locale();

  return (
    <Link href="/">
      <img
        alt={siteName}
        src={language === "fi" ? "/logo_fi.svg" : "/logo_en.svg"}
        width={language === "fi" ? "753" : "758"}
        height={"493"}
        className={styles.logo}
      />
    </Link>
  );
};
