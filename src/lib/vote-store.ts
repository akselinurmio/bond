import { persistentJSON } from "@nanostores/persistent";

export const $votedActor = persistentJSON<number | null>("bond:voted", null);

export function markAsVoted(actor: number): void {
  $votedActor.set(actor);
}

export function clearVotedActor(): void {
  $votedActor.set(null);
}
