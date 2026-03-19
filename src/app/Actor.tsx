"use client";

import { VoteActionState, voteForActor } from "app/actions";
import { useActionState } from "react";

const initialState: VoteActionState = { error: null, voted: false };

type Props = {
  actorId: number;
  actorName: string;
  language: "en" | "fi";
  votes: number;
};

export function VoteForm({ actorId, actorName, language, ...props }: Props) {
  const [state, formAction, pending] = useActionState(
    voteForActor,
    initialState,
  );
  const { error } = state;
  const voted = pending || state.voted;
  const votes = props.votes + +voted;

  const lastName = actorName.trim().split(" ").at(-1);

  return (
    <>
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
        <input type="hidden" name="id" value={actorId} />
        <input type="hidden" name="language" value={language} />
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
    </>
  );
}
