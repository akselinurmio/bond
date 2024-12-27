"use client";

import type { Person } from "app/services/tmdb";
import styles from "./Bond.module.css";
import { VoteActionState, voteForActor } from "app/actions";
import { useActionState, useOptimistic } from "react";

const initialState: VoteActionState = { error: null, voted: false };

type Props = {
  details: Person;
  imageUrlPrefix: string;
  language: "en" | "fi";
  votes: number;
};

export function Bond({ details, imageUrlPrefix, language, votes }: Props) {
  const [state, formAction, pending] = useActionState(
    voteForActor,
    initialState,
  );
  const { error } = state;
  const voted = pending || state.voted;

  const titleId = `bond-${details.id}`;

  const lastName = details.name.trim().split(" ").at(-1);

  return (
    <article aria-labelledby={titleId}>
      {details.profile_path ? (
        <img
          alt={details.name}
          src={imageUrlPrefix + details.profile_path}
          width={185}
          height={278}
          className={styles.image}
        />
      ) : null}

      <h3 id={titleId} translate="no" className={styles.name}>
        {details.name}
      </h3>

      <p>{`${(votes + +voted).toLocaleString(language)} ${
        language === "fi"
          ? votes + +voted === 1
            ? "ääni"
            : "ääntä"
          : votes + +voted === 1
            ? "vote"
            : "votes"
      }`}</p>
      <form action={formAction}>
        <input type="hidden" name="id" value={details.id} />
        <button type="submit" disabled={pending || voted}>
          {`${lastName} ${
            language === "fi" ? "on mun lemppari" : "is my favorite"
          }`}
        </button>
        {error && (
          <output>
            <p>{error}</p>
          </output>
        )}
      </form>
    </article>
  );
}
