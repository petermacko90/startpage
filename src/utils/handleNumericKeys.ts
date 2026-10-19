import { areModKeysPressed } from "./areModKeysPressed";

export function handleNumericKeys(
  e: React.KeyboardEvent<HTMLDialogElement> | KeyboardEvent,
  selectItems: () => NodeListOf<HTMLAnchorElement | HTMLButtonElement>,
) {
  if (areModKeysPressed(e)) return;

  if (!isNumericKey(e.key)) return;

  const items = selectItems();

  e.preventDefault();

  const index = e.key === "0" ? 9 : Number(e.key) - 1;
  items[index]?.focus();
  items[index]?.click();
}

const numericKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;

type NumericKey = (typeof numericKeys)[number];

function isNumericKey(key: string): key is NumericKey {
  return (numericKeys as readonly string[]).includes(key);
}
