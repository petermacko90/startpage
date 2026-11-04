import messages from "../../public/_locales/en/messages.json";

export type I18nKey = keyof typeof messages;

export function t(
  key: I18nKey,
  substitutions?: string | (string | number)[],
): string {
  return browser.i18n.getMessage(key, substitutions);
}
