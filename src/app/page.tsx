import { Bond } from "app/Bond";
import { bondActorTmdbIds } from "app/constants";
import type { Person } from "app/services/tmdb";
import * as tmdb from "app/services/tmdb";
import { getVotesForBond } from "app/services/votes";
import { locale } from "app/utils/locale";
import { TmdbConfigProvider } from "./contexts/TmdbConfigProvider";
import styles from "./page.module.css";

type BondTuples = [id: number, details: Person, votes: number];

export default async function Home() {
  const language = locale();

  const bondsPromise = Promise.all(
    bondActorTmdbIds.map(
      (id): Promise<BondTuples> =>
        Promise.all([id, tmdb.getPerson(id, language), getVotesForBond(id)]),
    ),
  );

  const [config, bondTuples] = await Promise.all([
    tmdb.getConfiguration(),
    bondsPromise,
  ]);

  return (
    <section className={styles.bonds}>
      <TmdbConfigProvider configuration={config}>
        {bondTuples.map(([id, details, votes]) => (
          <Bond key={id} details={details} id={id} votes={votes} />
        ))}
      </TmdbConfigProvider>
    </section>
  );
}
