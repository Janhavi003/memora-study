# Local Generation Engine

## Purpose and honesty

The initial engine is deterministic, local text processing. It is not an LLM, does not understand every domain, and cannot guarantee pedagogically sound cards. Generated candidates are editable previews, and low-confidence inputs should produce warnings or no candidates rather than invented facts.

## Pipeline

1. **Input validation:** trim input, enforce character/byte limits, reject empty or near-empty text.
2. **Normalization:** normalize line endings and whitespace while preserving sentence boundaries and meaningful punctuation.
3. **Sentence segmentation:** split conservatively at punctuation/newlines; avoid treating every abbreviation as a boundary where practical.
4. **Filtering:** remove empty fragments, boilerplate, very short fragments, and duplicates.
5. **Term extraction:** tokenize, remove a curated stop-word list, score terms by frequency and simple phrase patterns; avoid presenting frequency as semantic understanding.
6. **Sentence ranking:** combine informative length, non-stopword density, term scores, and definition-pattern signals.
7. **Candidate creation:** use supported templates and recognizable patterns.
8. **Quality checks:** verify question/answer are nonempty and not identical, length bounds, answer appears supported by source where applicable, and no obvious duplicate.
9. **Deduplication:** normalize case, whitespace, and punctuation; compare question/answer signatures.
10. **Limit and warnings:** return at most the configured number of candidates and explain when source text yields too few useful facts.

## Initial card strategies

- **Question/answer:** convert explicit definition or explanatory patterns into a prompt; otherwise use cautious sentence-derived templates that preserve the source wording.
- **Definition:** recognize patterns such as “X is/are …”, “X refers to …”, or “X means …”.
- **Cloze:** blank a selected informative term in a sentence when the term is actually present and not a stop word.
- **Multiple choice:** use an extracted term as the answer and distinct terms from the same source as distractors. Require enough plausible alternatives; otherwise downgrade to another card type rather than repeat the answer.
- **Keyword/phrase extraction:** use lightweight local rules and a stop-word list. Do not label heuristic scores as model confidence.

## Provider seam

`CardGenerationProvider.generate(input, settings)` should return normalized candidate objects plus warnings. The default implementation is `HeuristicGenerationProvider`. Future optional local model providers must be opt-in and must not make the no-key core path fail.

## Safety and privacy

- Process notes in the local application.
- Never execute uploaded files.
- Allow only `.txt`, `.md`, `.csv` initially; validate size and decoding.
- Do not trust extension alone as proof of safe content.
- Do not log raw notes or generated answers by default.
- Return clear unsupported-file and insufficient-content errors.

## Tests

Cover empty/short notes, duplicate sentences, punctuation and abbreviations, definition patterns, source without definitions, long input, Unicode text, repeated terms, identical candidate question/answer, missing distractors, max-card limits, and duplicate detection.
