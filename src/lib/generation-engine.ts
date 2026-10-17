import type { Candidate, CardType } from "./types";

const STOP_WORDS = new Set(["about", "after", "again", "also", "among", "because", "before", "being", "between", "could", "does", "during", "each", "from", "have", "into", "more", "most", "other", "over", "same", "should", "some", "such", "than", "that", "their", "them", "then", "there", "these", "they", "this", "those", "through", "under", "very", "what", "when", "where", "which", "while", "with", "would"]);

export function normalizeText(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function splitSentences(text: string): string[] {
  return [...new Set(text.replace(/\r\n/g, "\n").split(/(?<=[.!?])\s+|\n+/).map((part) => part.trim()).filter((part) => part.length >= 25 && /[a-z]{3}/i.test(part)))];
}

function wordsIn(text: string): string[] {
  return (text.match(/\b[A-Za-z][A-Za-z-]{3,}\b/g) ?? []).filter((word) => !STOP_WORDS.has(word.toLowerCase()));
}

function definition(sentence: string): { term: string; meaning: string } | undefined {
  const match = sentence.match(/^(.{2,80}?)\s+(?:is defined as|is|are|means|refers to)\s+(.{8,})[.!?]?$/i);
  if (!match || match[1].split(/\s+/).length > 8) return undefined;
  return { term: match[1].trim().replace(/^(?:a|an|the)\s+/i, ""), meaning: match[2].trim().replace(/[.!?]+$/, "") };
}

function escapeRegex(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function generateCandidates(text: string, maxCards: number, requestedTypes: CardType[]): { candidates: Candidate[]; warning?: string } {
  const sentences = splitSentences(text.trim());
  if (sentences.length === 0) return { candidates: [], warning: "No complete explanatory sentences were found. Add a few clear sentences or definitions." };
  const types = requestedTypes.length ? requestedTypes : ["QUESTION_ANSWER"];
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  const allTerms = [...new Set(sentences.flatMap(wordsIn).map((word) => word.toLowerCase()))];

  for (const sentence of sentences) {
    if (candidates.length >= maxCards) break;
    const def = definition(sentence);
    const type: CardType = types.includes("DEFINITION") && def ? "DEFINITION" : types.includes("CLOZE") && wordsIn(sentence).length ? "CLOZE" : types.includes("MULTIPLE_CHOICE") ? "MULTIPLE_CHOICE" : "QUESTION_ANSWER";
    let question: string;
    let answer: string;
    let options: string[] | undefined;
    if (type === "DEFINITION" && def) {
      question = `What is ${def.term}?`;
      answer = def.meaning;
    } else if (type === "CLOZE") {
      const term = [...wordsIn(sentence)].sort((a, b) => b.length - a.length)[0];
      if (!term) continue;
      question = sentence.replace(new RegExp(`\\b${escapeRegex(term)}\\b`, "i"), "________");
      answer = term;
    } else if (type === "MULTIPLE_CHOICE") {
      const defForQuestion = def;
      const key = defForQuestion?.term ?? [...wordsIn(sentence)].sort((a, b) => b.length - a.length)[0];
      if (!key) continue;
      question = defForQuestion ? `Which option best describes ${defForQuestion.term}?` : `Which statement is supported by the notes about ${key}?`;
      answer = defForQuestion?.meaning ?? sentence.replace(/[.!?]+$/, "");
      const distractors = allTerms.filter((term) => term.toLowerCase() !== key.toLowerCase() && !normalizeText(answer).includes(normalizeText(term))).slice(0, 3);
      options = [answer, ...distractors.map((term) => `A concept related to ${term}`)];
      while (options.length < 4) options.push(`Not stated in the notes (${options.length})`);
      options = [...new Set(options)].slice(0, 4);
      if (!options.includes(answer)) options[0] = answer;
    } else {
      const key = [...wordsIn(sentence)].sort((a, b) => b.length - a.length)[0] ?? "this idea";
      question = `What do the notes say about ${key}?`;
      answer = sentence.replace(/[.!?]+$/, "");
    }
    const signature = `${normalizeText(question)}|${normalizeText(answer)}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    candidates.push({ id: `candidate-${candidates.length + 1}`, type, question, answer, approved: true, duplicate: false, ...(options ? { options } : {}) });
  }
  if (!candidates.length) return { candidates: [], warning: "The notes did not produce suitable cards for the selected types. Try Question & Answer or add clearer definitions." };
  return { candidates, warning: "Generated locally from sentence and definition patterns; review the wording and answer options before saving." };
}

export function markDuplicates(candidates: Candidate[], existing: Array<{ question: string; answer: string }> = []): Candidate[] {
  const seen = new Set(existing.map((card) => `${normalizeText(card.question)}|${normalizeText(card.answer)}`));
  return candidates.map((candidate) => {
    const signature = `${normalizeText(candidate.question)}|${normalizeText(candidate.answer)}`;
    const duplicate = seen.has(signature);
    seen.add(signature);
    return { ...candidate, duplicate, approved: candidate.approved && !duplicate };
  });
}
