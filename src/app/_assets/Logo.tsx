import React from "react";
import styles from "./Logo.module.css";

type Props = {
  locale: string;
  siteName: string;
};

export const Logo: React.FC<Props> = ({ locale, siteName }) => (
  <img
    alt={siteName}
    src={locale === "fi" ? "/logo_fi.svg" : "/logo_en.svg"}
    width={locale === "fi" ? "753" : "758"}
    height={"493"}
    className={styles.logo}
  />
);
