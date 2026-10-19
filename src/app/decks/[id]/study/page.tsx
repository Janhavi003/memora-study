"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Panel } from "@/components/ui";
import type { Deck, Rating } from "@/lib/types";

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [rated, setRated] = useState<Record<string, Rating>>({});

  const loadDeck = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/decks/${encodeURIComponent(id)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not load this deck.");
      setDeck((payload.data ?? payload) as Deck);
      setError("");
    } catch (reason) {
      setDeck(null);
      setError(reason instanceof Error ? reason.message : "Could not load this deck.");
    } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void loadDeck(); }, [loadDeck]);

  const cards = deck?.cards ?? [];
  const card = cards[index];
  const next = () => { setIndex((current) => Math.min(cards.length - 1, current + 1)); setRevealed(false); };
  const previous = () => { setIndex((current) => Math.max(0, current - 1)); setRevealed(false); };

  async function rate(rating: Rating) {
    if (!deck || !card || saving) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deckId: deck.id, cardId: card.id, rating }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not save your review.");
      setRated((current) => ({ ...current, [card.id]: rating }));
      if (index === cards.length - 1) {
        await loadDeck();
        setDone(true);
      } else {
        await loadDeck();
        setIndex((current) => Math.min(cards.length - 1, current + 1));
        setRevealed(false);
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save your review."); }
    finally { setSaving(false); }
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement) return;
      if (event.code === "Space" || event.key === "Enter") { event.preventDefault(); setRevealed((value) => !value); }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (loading) return <AppShell><p role="status" className="text-sm text-ink/60">Loading deck...</p></AppShell>;
  if (!deck) return <AppShell><Panel><h1 className="font-display text-2xl">Deck unavailable</h1><p role="alert" className="mt-2 text-sm text-ink/60">{error || "This deck could not be found."}</p><Link href="/decks" className="mt-4 inline-flex items-center gap-2 text-sm text-forest underline"><ArrowLeft size={15}/> Back to decks</Link></Panel></AppShell>;

  if (done || !card) return <AppShell><div className="mx-auto max-w-xl py-12 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage text-forest"><Check size={25}/></span><p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-forest">Session complete</p><h1 className="mt-2 font-display text-4xl">Good work showing up.</h1><p className="mt-3 text-ink/60">Your ratings have been saved and your review schedule updated.</p><Panel className="mt-7 text-left"><div className="flex justify-between py-2 text-sm"><span>Cards in deck</span><b>{cards.length}</b></div><div className="flex justify-between border-t border-line py-2 text-sm"><span>Cards rated this session</span><b>{Object.keys(rated).length}</b></div></Panel><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => { setIndex(0); setDone(false); setRated({}); setRevealed(false); void loadDeck(); }}><RotateCcw size={15}/> Study again</Button><Link className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white" href={`/decks/${id}`}>Back to deck</Link></div></div></AppShell>;

  return <AppShell><div className="mx-auto max-w-3xl"><Link href={`/decks/${id}`} className="inline-flex items-center gap-2 text-sm text-ink/55"><ArrowLeft size={15}/> Exit study</Link><div className="mb-8 mt-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-forest">Focus room</p><h1 className="mt-2 font-display text-3xl">{deck.name}</h1></div><span className="text-sm text-ink/55">{index + 1} / {cards.length}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-forest transition-all" style={{ width: `${cards.length ? ((index + 1) / cards.length) * 100 : 0}%` }}/></div><button onClick={() => setRevealed((value) => !value)} aria-label={revealed ? "Hide answer" : "Reveal answer"} className="mt-5 flex min-h-[350px] w-full flex-col items-center justify-center rounded-[2rem] border border-line bg-surface p-8 text-center shadow-paper transition hover:border-forest/40 sm:min-h-[400px]"><span className="text-[11px] font-bold uppercase tracking-[.2em] text-forest">{revealed ? "Answer" : "Question"}</span><span className="mt-6 max-w-xl font-display text-2xl leading-snug sm:text-3xl">{revealed ? card.answer : card.question}</span><span className="mt-10 text-xs text-ink/40">{revealed ? "Click to hide answer" : "Space or Enter to reveal"}</span></button>{error && <p role="alert" className="mt-3 rounded-xl border border-clay/50 p-3 text-sm">{error}</p>}{revealed ? <div className="mt-5"><p className="mb-3 text-center text-sm text-ink/60">How well did you remember it?</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{([{ label: "Again", rating: "AGAIN", cls: "border-red-300 hover:bg-red-50 dark:hover:bg-red-950" }, { label: "Hard", rating: "HARD", cls: "border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950" }, { label: "Good", rating: "GOOD", cls: "border-forest hover:bg-sage" }, { label: "Easy", rating: "EASY", cls: "border-forest hover:bg-sage" }] as const).map((item) => <button key={item.rating} disabled={saving} onClick={() => void rate(item.rating)} className={`rounded-xl border bg-surface px-3 py-3 text-sm font-semibold disabled:opacity-50 ${item.cls}`}>{saving ? "Saving..." : item.label}</button>)}</div></div> : <div className="mt-5 text-center"><Button variant="outline" onClick={() => setRevealed(true)}>Reveal answer</Button></div>}<div className="mt-7 flex items-center justify-between"><Button variant="ghost" disabled={index === 0} onClick={previous}><ArrowLeft size={15}/> Previous</Button><Button variant="outline" onClick={() => index === cards.length - 1 ? setDone(true) : next()}>Skip <ArrowRight size={15}/></Button></div><p className="mt-5 text-center text-[11px] text-ink/40">Keyboard: Space or Enter to reveal, left arrow for previous</p></div></AppShell>;
}
