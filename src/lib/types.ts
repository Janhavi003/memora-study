export type CardType="QUESTION_ANSWER"|"DEFINITION"|"CLOZE"|"MULTIPLE_CHOICE";
export type Rating="AGAIN"|"HARD"|"GOOD"|"EASY";
export type Flashcard={id:string;deckId:string;type:CardType;question:string;answer:string;options?:string[];due:boolean};
export type Deck={id:string;name:string;description:string;subject:string;color:string;cards:Flashcard[];updatedAt:string;lastStudiedAt?:string};
export type Candidate={id:string;type:CardType;question:string;answer:string;approved:boolean;duplicate:boolean;duplicateOverride?:boolean;options?:string[]};