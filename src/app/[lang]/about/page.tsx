import { Metadata } from "next";
import Image from "next/image";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "fi" ? "Tietoa" : "About",
    alternates: {
      canonical:
        lang === "fi"
          ? "https://lemppari.bond/tietoa"
          : "https://whoisyourfavorite.bond/about",
      languages: {
        en: "https://whoisyourfavorite.bond/about",
        fi: "https://lemppari.bond/tietoa",
      },
    },
  };
}

export default async function About({ params }: PageProps) {
  const { lang } = await params;

  return (
    <>
      <h1>{lang === "fi" ? "Tietoa sivusta" : "About the page"}</h1>

      <h2>{lang === "fi" ? "Kiitokset" : "Attribution"}</h2>

      <p lang="en">
        <a href="https://www.themoviedb.org/" target="_blank">
          <Image
            src="/tmdb.svg"
            alt="The Movie Database"
            width={248}
            height={18}
            priority
          />
        </a>
      </p>
      <p lang="en">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </>
  );
}
