import { persistentBoolean } from "@nanostores/persistent";

export const votedStorageKey = "bond:voted";

export const $voted = persistentBoolean(votedStorageKey);

export function markAsVoted(): void {
  $voted.set(true);
}

export function clearVoted(): void {
  $voted.set(false);
}
