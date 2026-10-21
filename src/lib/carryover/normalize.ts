const stopwords = new Set(
  "a an the to with for of on in and i ill will please can could we our their this that updated revised update revision".split(
    " ",
  ),
);
const synonyms: Record<string, string> = {
  share: "send",
  sent: "send",
  slides: "deck",
  slide: "deck",
  decks: "deck",
  pricing: "price",
  retries: "retry",
  requirements: "requirement",
};
function stem(word: string) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss"))
    return word.slice(0, -1);
  return word;
}
export function normalize(text: string, semantic = true): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/pull[ -]+requests?/g, "pr")
    .replace(/follow[ -]+up|check[ -]+in/g, "followup");
  return [
    ...new Set(
      (cleaned.match(/[a-z0-9]+/g) ?? [])
        .filter((w) => !stopwords.has(w))
        .map((w) => stem(semantic ? (synonyms[w] ?? w) : w)),
    ),
  ].sort();
}
export function companyEntities(text: string, companies: string[]) {
  const normalized = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  return companies
    .map((c) => c.toLowerCase())
    .filter((c) => normalized.includes(` ${c.replace(/[^a-z0-9]+/g, " ")} `));
}
export function jaccard(a: string[], b: string[]) {
  const union = new Set([...a, ...b]);
  return union.size ? a.filter((w) => b.includes(w)).length / union.size : 0;
}
