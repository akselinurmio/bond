"use client";

import { useLanguage } from "app/contexts/LanguageContext";
import type { Person } from "app/services/tmdb";
import { useState } from "react";
import styles from "./Bond.module.css";
import { useImageUrl } from "./contexts/TmdbConfigProvider";

type Props = {
  details: Person;
  id: number;
  votes: number;
};

export function Bond({ details, id, votes }: Props) {
  const language = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [optimisticVotes, setOptimisticVotes] = useState(votes);
  const getImageUrl = useImageUrl();

  const titleId = `bond-${id}`;

  const lastName = details.name.trim().split(" ").at(-1);

  return (
    <article aria-labelledby={titleId}>
      {!details.profile_path || (
        <img
          alt={details.name}
          src={getImageUrl(details.profile_path, 185)}
          width={185}
          height={278}
          className={styles.image}
        />
      )}

      <h3 id={titleId} translate="no" className={styles.name}>
        {details.name}
      </h3>

      <p>{`${optimisticVotes.toLocaleString(language)} ${
        language === "fi"
          ? optimisticVotes === 1
            ? "ääni"
            : "ääntä"
          : optimisticVotes === 1
          ? "vote"
          : "votes"
      }`}</p>
      <form
        action="/vote"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();

          setError(null);
          setOptimisticVotes((state) => state + 1);

          const form = e.currentTarget;
          const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.error) setError(data.error);
            setOptimisticVotes((state) => state - 1);
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <input
          type="submit"
          value={`${lastName} ${
            language === "fi" ? "on mun lemppari" : "is my favorite"
          }`}
        />
        {error && (
          <output>
            <p>{error}</p>
          </output>
        )}
      </form>
    </article>
  );
}
