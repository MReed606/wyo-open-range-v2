export const PROFANITY_WORDS = [
  "scam",
  "fraud",
  "fake",
];

export function containsProfanity(
  text: string
) {

  const lower =
    text.toLowerCase();

  return PROFANITY_WORDS.some(
    (word) =>
      lower.includes(word)
  );
}
