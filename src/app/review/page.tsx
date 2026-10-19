"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3, ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageTitle, Panel } from "@/components/ui";
import type { Deck } from "@/lib/types";

export default function ReviewPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/decks", { cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Could not load the review queue.");
      setDecks((payload.data ?? payload) as Deck[]);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load the review queue.")).finally(() => setLoading(false));
  }, []);
  const due = decks.flatMap((deck) => deck.cards.filter((card) => card.due).map((card) => ({ ...card, deckName: deck.name })));
  return <AppShell><PageTitle eyebrow="Review queue" title="Bring it back to mind." subtitle="Review saved cards and record how well you remembered each answer."/><Panel className="mb-6 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-sage text-forest"><Clock3 size={22}/></span><div><p className="text-sm text-ink/55">Cards due for review</p><p className="font-display text-3xl">{due.length}</p></div></Panel>{error && <p role="alert" className="mb-4 rounded-xl border border-clay/50 p-3 text-sm">{error}</p>}{loading ? <p role="status" className="text-sm text-ink/55">Loading your review queue...</p> : due.length ? <div className="space-y-3">{due.map((card) => <Panel key={card.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-forest">{card.deckName}</p><h2 className="mt-1 font-semibold">{card.question}</h2><p className="mt-1 text-sm text-ink/55">{card.answer}</p></div><Link href={`/decks/${card.deckId}/study`} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-forest">Study deck <ArrowRight size={15}/></Link></Panel>)}</div> : <Panel className="py-12 text-center"><Check className="mx-auto text-forest" size={28}/><h2 className="mt-3 font-display text-2xl">All caught up</h2><p className="mt-2 text-sm text-ink/55">{decks.length ? "No saved cards are currently due." : "Create a deck and add cards to begin reviewing."}</p><Link href="/decks" className="mt-4 inline-flex text-sm font-semibold text-forest">Open your decks <ArrowRight className="ml-1" size={15}/></Link></Panel>}</AppShell>;
}
