import { describe, expect, it } from "vitest";
import { generateCandidates, markDuplicates, normalizeText } from "./generation-engine";

describe("local generation engine", () => {
  const notes = "Photosynthesis is the process by which plants convert light energy into chemical energy. Chlorophyll absorbs light in the leaves and helps drive this process. Cellular respiration releases energy from glucose for use by cells.";
  it("creates question and answer cards without cloud services", () => {
    const result = generateCandidates(notes, 5, ["QUESTION_ANSWER"]);
    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.candidates[0].question).toContain("What do the notes say");
    expect(result.candidates[0].answer.length).toBeGreaterThan(10);
  });
  it("creates definition and cloze candidates", () => {
    const definition = generateCandidates(notes, 5, ["DEFINITION"]);
    expect(definition.candidates[0].type).toBe("DEFINITION");
    const cloze = generateCandidates(notes, 5, ["CLOZE"]);
    expect(cloze.candidates[0].question).toContain("________");
  });
  it("creates multiple-choice candidates with options", () => {
    const result = generateCandidates(notes, 5, ["MULTIPLE_CHOICE"]);
    expect(result.candidates[0].options).toContain(result.candidates[0].answer);
  });
  it("normalizes text and flags exact normalized duplicates", () => {
    expect(normalizeText("Café—Plants!")).toBe("cafe plants");
    const candidates = [{ id: "1", type: "QUESTION_ANSWER" as const, question: "What is a plant?", answer: "A living thing.", approved: true, duplicate: false }];
    expect(markDuplicates(candidates, [{ question: "WHAT IS A PLANT", answer: "A living thing" }])[0].duplicate).toBe(true);
    expect(markDuplicates([...candidates, { ...candidates[0], id: "2" }])[1].duplicate).toBe(true);
  });
});
