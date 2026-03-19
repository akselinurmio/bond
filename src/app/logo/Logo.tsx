import Link from "next/link";
import React from "react";
import styles from "./Logo.module.css";

type Props = {
  language: "en" | "fi";
  siteName: string;
};

export const Logo: React.FC<Props> = ({ language, siteName }) => {
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
