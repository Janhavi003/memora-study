import {initialDecks} from "./mock-data";
import type {Candidate,Deck,Flashcard} from "./types";
let decks:Deck[]=structuredClone(initialDecks);let nextId=1;
export const mockService={
 listDecks():Deck[]{return structuredClone(decks)},
 getDeck(id:string):Deck|undefined{const d=decks.find(x=>x.id===id);return d?structuredClone(d):undefined},
 createDeck(input:{name:string;description?:string;subject?:string}):Deck{const d:Deck={id:`deck-new-${nextId++}`,name:input.name.trim(),description:input.description?.trim()??"",subject:input.subject?.trim()||"General",color:"sage",cards:[],updatedAt:new Date().toISOString()};decks=[d,...decks];return structuredClone(d)},
 renameDeck(id:string,name:string):boolean{const d=decks.find(x=>x.id===id);if(!d||!name.trim())return false;d.name=name.trim();d.updatedAt=new Date().toISOString();return true},
 deleteDeck(id:string):boolean{const n=decks.length;decks=decks.filter(x=>x.id!==id);return decks.length<n},
 duplicateDeck(id:string):Deck|undefined{const s=decks.find(x=>x.id===id);if(!s)return;const d:Deck={...structuredClone(s),id:`deck-new-${nextId++}`,name:`${s.name} copy`,cards:s.cards.map(c=>({...c,id:`card-new-${nextId++}`})),updatedAt:new Date().toISOString()};decks.unshift(d);return structuredClone(d)},
 addCards(deckId:string,candidates:Candidate[]):number{const d=decks.find(x=>x.id===deckId);if(!d)return 0;const approved=candidates.filter(c=>c.approved&&c.question.trim()&&c.answer.trim());for(const c of approved)d.cards.push({id:`card-new-${nextId++}`,deckId,type:c.type,question:c.question.trim(),answer:c.answer.trim(),due:true});d.updatedAt=new Date().toISOString();return approved.length},
 updateCard(deckId:string,cardId:string,patch:Partial<Pick<Flashcard,"question"|"answer">>):boolean{const c=decks.find(d=>d.id===deckId)?.cards.find(c=>c.id===cardId);if(!c)return false;Object.assign(c,patch);return true},
 resetForTests(){decks=structuredClone(initialDecks);nextId=1}
};
