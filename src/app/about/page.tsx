import { locale } from "app/utils/locale";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: locale() === "fi" ? "Tietoa" : "About",
  };
}

export default function About() {
  const language = locale();

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
