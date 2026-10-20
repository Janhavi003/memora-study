"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3, Play, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageTitle, Panel } from "@/components/ui";
import type { Deck } from "@/lib/types";

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeck = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/decks/${encodeURIComponent(id)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not load this deck.");
      setDeck((payload.data ?? payload) as Deck);
    } catch (err) {
      setDeck(null);
      setError(err instanceof Error ? err.message : "Could not load this deck.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void loadDeck(); }, [loadDeck]);

  if (loading) return <AppShell><p role="status" className="text-sm text-ink/60">Loading deck...</p></AppShell>;
  if (!deck) return <AppShell><div className="rounded-2xl border border-line bg-surface p-8"><h1 className="font-display text-2xl">Deck unavailable</h1><p role="alert" className="mt-2 text-sm text-ink/60">{error || "This deck could not be found."}</p><Link href="/decks" className="mt-4 inline-flex items-center gap-2 text-sm text-forest underline"><ArrowLeft size={15}/> Back to decks</Link></div></AppShell>;

  const dueCount = deck.cards.filter((card) => card.due).length;
  return <AppShell>
    <Link href="/decks" className="mb-5 inline-flex items-center gap-2 text-sm text-ink/55 hover:text-forest"><ArrowLeft size={15}/> All decks</Link>
    <PageTitle eyebrow={deck.subject} title={deck.name} subtitle={deck.description || "Your saved study cards."} action={<div className="flex flex-wrap gap-2"><Link href={`/decks/${deck.id}/study`} className="inline-flex items-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white"><Play size={15} className="mr-2"/> Study deck</Link><Link href="/create" className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold"><Plus size={15} className="mr-2"/> Add cards</Link><Link href={`/decks/${deck.id}/quiz`} className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold">Take quiz</Link></div>} />
    <div className="mb-6 grid gap-3 sm:grid-cols-3"><Panel><p className="text-xs text-ink/55">Total cards</p><p className="mt-1 font-display text-3xl">{deck.cards.length}</p></Panel><Panel><p className="text-xs text-ink/55">Due for review</p><p className="mt-1 font-display text-3xl">{dueCount}</p></Panel><Panel><p className="flex items-center gap-2 text-xs text-ink/55"><Clock3 size={14}/> Last studied</p><p className="mt-2 font-semibold">{deck.lastStudiedAt ? new Date(deck.lastStudiedAt).toLocaleDateString() : "Not recorded"}</p></Panel></div>
    <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-2xl">Cards in this deck</h2><span className="text-xs text-ink/50">{deck.cards.length} saved</span></div>
    {deck.cards.length ? <div className="space-y-3">{deck.cards.map((card, index) => <Panel key={card.id} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs text-ink/55">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="font-semibold">{card.question}</p><p className="mt-2 text-sm leading-6 text-ink/60">{card.answer}</p></div>{card.due && <span className="h-fit rounded-full bg-sage px-2 py-1 text-[10px] font-semibold text-forest">Due</span>}</Panel>)}</div> : <div className="rounded-2xl border border-dashed border-line p-10 text-center"><h3 className="font-display text-xl">No cards yet</h3><p className="mt-2 text-sm text-ink/55">Generate cards from your notes and save them to this deck.</p><Link href="/create" className="mt-4 inline-flex rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white">Create cards</Link></div>}
  </AppShell>;
}
