import { Suspense, cache } from "react";
import { VoteForm } from "app/Actor";
import { bondActorTmdbIds } from "app/constants";
import * as tmdb from "app/services/tmdb";
import { getVotesForAllBonds } from "app/services/votes";
import { getProfileImageUrlPrefix } from "app/utils/tmdb";
import styles from "../page.module.css";
import bondStyles from "../Bond.module.css";
import { Metadata } from "next";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    alternates: {
      canonical:
        lang === "fi"
          ? "https://lemppari.bond/"
          : "https://whoisyourfavorite.bond/",
      languages: {
        en: "https://whoisyourfavorite.bond/",
        fi: "https://lemppari.bond/",
      },
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const language = lang as "en" | "fi";

  return (
    <section className={styles.bonds}>
      <BondGrid language={language} />
    </section>
  );
}

async function BondGrid({ language }: { language: "en" | "fi" }) {
  const [config, actors] = await Promise.all([
    tmdb.getConfiguration(),
    Promise.all(
      Array.from(bondActorTmdbIds, (id) => tmdb.getPerson(id, language)),
    ),
  ]);

  const profileImageUrlPrefix = getProfileImageUrlPrefix(config);

  return actors.map((actor) => {
    const titleId = `bond-${actor.id}`;

    return (
      <article key={actor.id} aria-labelledby={titleId}>
        {actor.profile_path ? (
          <img
            alt={actor.name}
            src={profileImageUrlPrefix + actor.profile_path}
            width={185}
            height={278}
            className={bondStyles.image}
          />
        ) : null}

        <h3 id={titleId} translate="no" className={bondStyles.name}>
          {actor.name}
        </h3>

        <Suspense fallback={<VoteSkeleton />}>
          <VoteSection
            actorId={actor.id}
            actorName={actor.name}
            language={language}
          />
        </Suspense>
      </article>
    );
  });
}

const getCachedVotes = cache(getVotesForAllBonds);

async function VoteSection({
  actorId,
  actorName,
  language,
}: {
  actorId: number;
  actorName: string;
  language: "en" | "fi";
}) {
  const votes = await getCachedVotes();

  return (
    <VoteForm
      actorId={actorId}
      actorName={actorName}
      language={language}
      votes={votes.get(actorId) || 0}
    />
  );
}

function VoteSkeleton() {
  return (
    <>
      <p className={bondStyles.skeletonText}>&nbsp;</p>
      <form>
        <button className={bondStyles.skeletonButton} disabled>&nbsp;</button>
      </form>
    </>
  );
}
