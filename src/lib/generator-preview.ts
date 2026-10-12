import type {Candidate,CardType} from "./types";
const stop=new Set(["the","and","for","with","that","this","from","into","are","was","were","have","has","its","their","then","than","when","where","what","which","while","also","most","often","such","can","may"]);
export function previewGenerate(text:string,maxCards:number,types:CardType[]):{candidates:Candidate[];warning?:string}{
 const normalized=text.replace(/\r\n/g,"\n").trim();
 if(normalized.length<35)return {candidates:[],warning:"Add a little more source text (a few complete sentences) to create useful preview cards."};
 const sentences=[...new Set(normalized.split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(s=>s.length>=30))];
 const candidates:Candidate[]=[];const chosen=types.length?types:["QUESTION_ANSWER" as CardType];
 for(const sentence of sentences){if(candidates.length>=maxCards)break;let question="";let answer=sentence.replace(/[.!?]+$/,"");let type=chosen[0];
 const def=sentence.match(/^(.{2,70}?)\s+(?:is|are|means|refers to)\s+(.{8,})[.!?]?$/i);
 if(chosen.includes("DEFINITION")&&def){question=`Define ${def[1].trim()}.`;answer=def[2].trim();type="DEFINITION"}
 else if(chosen.includes("CLOZE")){const term=(sentence.match(/\b[A-Za-z][A-Za-z-]{4,}\b/g)||[]).find(w=>!stop.has(w.toLowerCase()));if(term){question=sentence.replace(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i"),"_____");answer=term;type="CLOZE"}}
 if(!question){const words=sentence.replace(/[.!?]+$/,"").split(/\s+/);const key=[...words].reverse().find(w=>w.length>5&&!stop.has(w.toLowerCase().replace(/[^a-z]/g,"")))||words[words.length-1];question=`What should you remember about “${key.replace(/[.,:;]$/,"")}”?`}
 const sig=question.toLowerCase().replace(/[^a-z0-9]/g,"");if(candidates.some(c=>c.question.toLowerCase().replace(/[^a-z0-9]/g,"")===sig))continue;
 candidates.push({id:`candidate-${candidates.length+1}`,type,question,answer,approved:true,duplicate:false});
 }
 if(!candidates.length)return {candidates:[],warning:"No sufficiently complete sentences were found. Try adding explanatory notes or definitions."};
 return {candidates,warning:"Preview only: this lightweight heuristic is not the finished generation engine. Review every card before saving."}
}