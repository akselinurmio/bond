import { locale } from "app/utils/locale";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

const localeSegment = {
  en: "about",
  fi: "tietoa",
} as const;

type PageProps = { params: { about: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const language = locale();

  if (params.about !== localeSegment[language]) return {};

  return {
    title: language === "fi" ? "Tietoa" : "About",
    alternates: {
      canonical:
        language === "fi"
          ? "https://lemppari.bond/tietoa"
          : "https://whoisyourfavorite.bond/about",
      languages: {
        en: "https://whoisyourfavorite.bond/about",
        fi: "https://lemppari.bond/tietoa",
      },
    },
  };
}

export default function About({ params }: { params: { about: string } }) {
  const language = locale();

  if (params.about !== localeSegment[language]) notFound();

  return (
    <>
      <h1>{language === "fi" ? "Tietoa sivusta" : "About the page"}</h1>

      <h2>{language === "fi" ? "Kiitokset" : "Attribution"}</h2>

      <p lang="en">
        <a href="https://www.themoviedb.org/" target="_blank">
          <Image
            src="/tmdb.svg"
            alt="The Movie Database"
            width={248}
            height={18}
          />
        </a>
      </p>
      <p lang="en">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </>
  );
}
