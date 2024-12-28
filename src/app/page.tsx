import { Actor } from "app/Actor";
import { bondActorTmdbIds } from "app/constants";
import * as tmdb from "app/services/tmdb";
import { getVotesForAllBonds } from "app/services/votes";
import { locale } from "app/utils/locale";
import styles from "./page.module.css";
import { Metadata } from "next";
import { getProfileImageUrlPrefix } from "app/utils/tmdb";

export async function generateMetadata(): Promise<Metadata> {
  const language = await locale();

  return {
    alternates: {
      canonical:
        language === "fi"
          ? "https://lemppari.bond/"
          : "https://whoisyourfavorite.bond/",
      languages: {
        en: "https://whoisyourfavorite.bond/",
        fi: "https://lemppari.bond/",
      },
    },
  };
}

export default async function Home() {
  const language = await locale();

  const actorsPromise = Promise.all(
    Array.from(bondActorTmdbIds, (id) => tmdb.getPerson(id, language)),
  );

  const [config, actors, votes] = await Promise.all([
    tmdb.getConfiguration(),
    actorsPromise,
    getVotesForAllBonds(),
  ]);

  const profileImageUrlPrefix = getProfileImageUrlPrefix(config);

  return (
    <section className={styles.bonds}>
      {actors.map((actor) => (
        <Actor
          key={actor.id}
          data={actor}
          imageUrlPrefix={profileImageUrlPrefix}
          language={language}
          votes={votes.get(actor.id) || 0}
        />
      ))}
    </section>
  );
}
