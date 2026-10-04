export function handleNumericKeys(
  e: React.KeyboardEvent<HTMLDialogElement> | KeyboardEvent,
  selectItems: () => NodeListOf<HTMLAnchorElement | HTMLButtonElement>,
) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  if (
    e.key !== "1" &&
    e.key !== "2" &&
    e.key !== "3" &&
    e.key !== "4" &&
    e.key !== "5" &&
    e.key !== "6" &&
    e.key !== "7" &&
    e.key !== "8" &&
    e.key !== "9" &&
    e.key !== "0"
  ) {
    return;
  }

  const items = selectItems();

  e.preventDefault();

  const index = e.key === "0" ? 9 : Number(e.key) - 1;
  items[index]?.focus();
  items[index]?.click();
}
