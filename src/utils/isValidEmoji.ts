export function isValidEmoji(input: string): boolean {
  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*$/u;

  return emojiRegex.test(input);
}
