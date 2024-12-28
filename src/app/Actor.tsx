"use client";

import type { Person } from "app/services/tmdb";
import styles from "./Bond.module.css";
import { VoteActionState, voteForActor } from "app/actions";
import { useActionState } from "react";

const initialState: VoteActionState = { error: null, voted: false };

type Props = {
  data: Person;
  imageUrlPrefix: string;
  language: "en" | "fi";
  votes: number;
};

export function Actor({ data, imageUrlPrefix, language, ...props }: Props) {
  const [state, formAction, pending] = useActionState(
    voteForActor,
    initialState,
  );
  const { error } = state;
  const voted = pending || state.voted;
  const votes = props.votes + +voted;

  const titleId = `bond-${data.id}`;

  const lastName = data.name.trim().split(" ").at(-1);

  return (
    <article aria-labelledby={titleId}>
      {data.profile_path ? (
        <img
          alt={data.name}
          src={imageUrlPrefix + data.profile_path}
          width={185}
          height={278}
          className={styles.image}
        />
      ) : null}

      <h3 id={titleId} translate="no" className={styles.name}>
        {data.name}
      </h3>

      <p>{`${votes.toLocaleString(language)} ${
        language === "fi"
          ? votes === 1
            ? "ääni"
            : "ääntä"
          : votes === 1
            ? "vote"
            : "votes"
      }`}</p>
      <form action={formAction}>
        <input type="hidden" name="id" value={data.id} />
        <button type="submit" disabled={voted}>
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
