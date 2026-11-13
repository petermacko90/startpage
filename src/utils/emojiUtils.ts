const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const emojiRegex = /^\p{RGI_Emoji}$/v;

export function isValidEmoji(input: string): boolean {
  const segments = [...segmenter.segment(input)];
  if (segments.length !== 1) return false;

  return emojiRegex.test(segments[0].segment);
}

export function getLastGrapheme(text: string): string {
  const segments = [...segmenter.segment(text)];
  return segments.at(-1)?.segment ?? "";
}
