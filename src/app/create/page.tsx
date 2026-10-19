"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Save, ArrowRight, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Input, PageTitle, Panel, Textarea } from "@/components/ui";
import type { Candidate, CardType, Deck } from "@/lib/types";

const types: { id: CardType; label: string }[] = [
  { id: "QUESTION_ANSWER", label: "Question & answer" },
  { id: "DEFINITION", label: "Definitions" },
  { id: "CLOZE", label: "Fill in the blank" },
  { id: "MULTIPLE_CHOICE", label: "Multiple choice" },
];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [max, setMax] = useState("8");
  const [selected, setSelected] = useState<CardType[]>(["QUESTION_ANSWER", "DEFINITION"]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [warning, setWarning] = useState("");
  const [deckId, setDeckId] = useState("");
  const [newDeckName, setNewDeckName] = useState("");
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadDecks() {
    try {
      const response = await fetch("/api/decks", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not load decks.");
      const rows = (payload.data ?? payload) as Deck[];
      setDecks(rows);
      setDeckId((current) => current && rows.some((deck) => deck.id === current) ? current : rows[0]?.id ?? "");
    } catch (error) {
      setWarning(error instanceof Error ? error.message : "Could not load decks from the database.");
    }
  }
  useEffect(() => { void loadDecks(); }, []);

  async function createDeck() {
    const name = newDeckName.trim();
    if (!name) { setWarning("Enter a name for your new deck."); return; }
    setCreatingDeck(true); setWarning(""); setMessage("");
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not create deck.");
      const created = (payload.data ?? payload) as Deck;
      setDecks((current) => [...current.filter((deck) => deck.id !== created.id), created]);
      setDeckId(created.id);
      setNewDeckName("");
      setMessage(`Created and selected “${created.name}”. Approve candidates and save them to this deck.`);
    } catch (error) {
      setWarning(error instanceof Error ? error.message : "Could not create deck.");
    } finally { setCreatingDeck(false); }
  }

  async function generate() {
    setBusy(true); setMessage(""); setWarning("");
    try {
      const response = await fetch("/api/generation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, maxCards: Math.max(1, Math.min(30, Number(max) || 8)), types: selected }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Generation failed.");
      const result = payload.data ?? payload;
      setCandidates(result.candidates ?? []);
      setWarning(result.duplicateCount ? `${result.duplicateCount} duplicate candidate(s) were detected and excluded. Other candidates can be approved with the button on each card.` : (result.warning || (result.candidates?.length ? "Review each locally generated candidate before saving." : "No candidates were generated. Try adding more explanatory notes.")));
    } catch (error) { setWarning(error instanceof Error ? error.message : "Generation failed. Please try again."); }
    finally { setBusy(false); }
  }

  async function importFile(file?: File) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["txt", "md", "csv"].includes(ext || "")) { setWarning("Unsupported file type. Please choose a .txt, .md, or .csv file."); return; }
    if (file.size > 1024 * 1024) { setWarning("File is larger than 1 MB. Choose a smaller text file."); return; }
    try { setText(await file.text()); setWarning(`Loaded ${file.name}. Review the source text before generating.`); }
    catch { setWarning("The file could not be read as text."); }
  }

  async function saveApproved() {
    const approved = candidates.filter((candidate) => candidate.approved && (!candidate.duplicate || candidate.duplicateOverride) && candidate.question.trim() && candidate.answer.trim());
    if (!deckId || approved.length === 0) return;
    setBusy(true); setMessage("");
    try {
      let saved = 0;
      for (const candidate of approved) {
        const response = await fetch(`/api/decks/${encodeURIComponent(deckId)}/cards`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: candidate.type, question: candidate.question.trim(), answer: candidate.answer.trim(), ...(candidate.options?.length ? { options: candidate.options } : {}) }) });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message || `Could not save card: ${candidate.question}`);
        saved += 1;
      }
      setMessage(`${saved} approved card${saved === 1 ? "" : "s"} saved to ${decks.find((deck) => deck.id === deckId)?.name ?? "your deck"} in SQLite.`);
      setCandidates((current) => current.filter((candidate) => !approved.some((item) => item.id === candidate.id)));
      await loadDecks();
    } catch (error) { setMessage(error instanceof Error ? `Save incomplete: ${error.message} Refresh the deck before retrying to avoid duplicates.` : "Saving failed. Please try again."); }
    finally { setBusy(false); }
  }

  return <AppShell><PageTitle eyebrow="Note-to-deck studio" title="Make something to remember." subtitle="Generate local study prompts, review each candidate, and save approved cards to your database."/><div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]"><section><Panel><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">01 · Source notes</p><h2 className="mt-2 font-display text-xl">Start with your material</h2></div><FileText className="text-forest" size={22}/></div><Textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste lecture notes, textbook excerpts, or your own explanations here…" className="mt-5 min-h-[300px] resize-y" aria-label="Source notes"/><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-semibold hover:bg-muted"><Plus size={15}/> Import text file<input type="file" accept=".txt,.md,.csv,text/plain,text/markdown,text/csv" className="sr-only" onChange={e=>importFile(e.target.files?.[0])}/></label><span className="text-xs text-ink/45">{text.length.toLocaleString()} characters · 1 MB file limit</span></div><div className="mt-6 border-t border-line pt-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">02 · Generation settings</p><div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-sm">Save to deck<select value={deckId} onChange={e=>{setDeckId(e.target.value);setMessage("")}} className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" disabled={!decks.length}><option value="">{decks.length ? "Choose a deck" : "Create a deck first"}</option>{decks.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label className="block text-sm">Maximum cards<Input type="number" min="1" max="30" value={max} onChange={e=>setMax(e.target.value)} className="mt-1"/></label><div className="min-w-0 sm:col-span-2"><label htmlFor="new-deck-name" className="mb-1 block text-sm">Create a new deck</label><div className="flex flex-col gap-2 sm:flex-row"><Input id="new-deck-name" value={newDeckName} onChange={e=>setNewDeckName(e.target.value)} placeholder="e.g. Photosynthesis Chapter 1" maxLength={100} aria-label="New deck name"/><Button type="button" variant="outline" className="min-h-11 shrink-0 sm:min-w-32" onClick={createDeck} disabled={creatingDeck||!newDeckName.trim()}>{creatingDeck?"Creating...":"Create deck"}</Button></div><p className="mt-1 text-xs leading-5 text-ink/50">The new deck is saved and selected automatically.</p></div></div><div className="mt-4"><p className="text-sm">Card types</p><div className="mt-2 flex flex-wrap gap-2">{types.map(t=><label key={t.id} className={`cursor-pointer rounded-full border px-3 py-2 text-xs ${selected.includes(t.id)?"border-forest bg-sage/60 font-semibold":"border-line hover:bg-muted"}`}><input type="checkbox" className="sr-only" checked={selected.includes(t.id)} onChange={e=>setSelected(old=>e.target.checked?[...old,t.id]:old.filter(x=>x!==t.id))}/>{t.label}</label>)}</div></div><Button className="mt-5 w-full" onClick={generate} disabled={busy||!text.trim()||selected.length===0}>{busy?"Working…":"Generate preview"} <ArrowRight size={16}/></Button></div></Panel><p className="mt-3 flex items-start gap-2 text-xs leading-5 text-ink/50"><AlertCircle size={15} className="mt-0.5 shrink-0"/> Notes are processed by the local heuristic engine on your own app server; no paid cloud AI service is used.</p></section><section><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">03 · Review candidates</p><h2 className="mt-2 font-display text-2xl">Cards worth keeping</h2></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{candidates.length} found</span></div>{warning&&<div role="status" className="mb-4 rounded-xl border border-clay/50 bg-clay/15 p-3 text-sm leading-5">{warning}</div>}{candidates.length===0?<div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-line px-8 text-center"><span className="grid h-12 w-12 place-items-center rounded-xl bg-muted"><FileText size={21}/></span><h3 className="mt-4 font-display text-xl">Your preview will appear here</h3><p className="mt-2 max-w-xs text-sm leading-6 text-ink/55">Paste a few explanatory sentences, choose card types, then generate a preview.</p></div>:<><div className="space-y-3">{candidates.map((c,i)=><Panel key={c.id} className={c.approved&&!c.duplicate?"border-forest/30":""}><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.15em] text-forest">Card {i+1} · {c.type.replaceAll("_"," ").toLowerCase()}{c.duplicate?" · duplicate":""}</span><div className="flex gap-1"><button aria-label="Toggle approval" title="Toggle approval" onClick={()=>setCandidates(old=>old.map(x=>x.id===c.id?{...x,approved:!x.approved,duplicateOverride:x.duplicate?!x.duplicateOverride:x.duplicateOverride}:x))} disabled={busy} aria-pressed={c.approved&&(!c.duplicate||!!c.duplicateOverride)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${c.approved&&!c.duplicate?"bg-sage text-forest":"bg-muted text-ink hover:bg-sage/50"}`}>{c.duplicate?(c.duplicateOverride?"Keep anyway · selected":"Duplicate · excluded"):c.approved?"Approved":"Approve card"}</button><button aria-label="Delete candidate" onClick={()=>setCandidates(old=>old.filter(x=>x.id!==c.id))} className="rounded-lg p-1.5 text-ink/45 hover:bg-clay/20 hover:text-ink"><Trash2 size={14}/></button></div></div><label className="mt-4 block text-xs text-ink/50">Question / prompt<Input value={c.question} onChange={e=>setCandidates(old=>old.map(x=>x.id===c.id?{...x,question:e.target.value}:x))} className="mt-1 font-medium"/></label><label className="mt-3 block text-xs text-ink/50">Answer<Textarea value={c.answer} onChange={e=>setCandidates(old=>old.map(x=>x.id===c.id?{...x,answer:e.target.value}:x))} rows={2} className="mt-1"/></label></Panel>)}</div><Button className="mt-4 w-full" onClick={saveApproved} disabled={busy||!deckId||!candidates.some(c=>c.approved&&(!c.duplicate||c.duplicateOverride)&&c.question.trim()&&c.answer.trim())}><Save size={16}/>{busy?"Saving…":"Save approved cards"}</Button>{message&&<p role="status" className="mt-3 text-sm text-success">{message} <Link href={`/decks/${deckId}`} className="underline">View deck</Link></p>}</>}</section></div></AppShell>;
}
