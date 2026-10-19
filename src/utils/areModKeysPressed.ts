export function areModKeysPressed(
  e: React.KeyboardEvent<HTMLElement> | KeyboardEvent,
): boolean {
  return e.altKey || e.ctrlKey || e.metaKey;
}
