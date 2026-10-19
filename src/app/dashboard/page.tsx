"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock3, Flame, Plus, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageTitle, Panel } from "@/components/ui";
import type { Deck } from "@/lib/types";

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/decks", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message || "Could not load your decks.");
        if (active) setDecks((payload.data ?? payload) as Deck[]);
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load your decks."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const cards = decks.reduce((count, deck) => count + deck.cards.length, 0);
  const due = decks.reduce((count, deck) => count + deck.cards.filter((card) => card.due).length, 0);
  const featured = decks[0];
  return <AppShell>
    <PageTitle eyebrow="Your study space" title="Make room to remember." subtitle="A steady study rhythm beats a last-minute sprint." />
    <Panel className="overflow-hidden bg-forest text-white"><div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-white/65">{featured ? "Pick up where you left off" : "Start your learning library"}</p><h2 className="mt-3 font-display text-3xl">{featured?.name ?? "Your next great idea"}</h2><p className="mt-2 max-w-md text-sm leading-6 text-white/75">{featured ? `${featured.cards.length} saved cards in ${featured.subject}. Keep your momentum with a short session.` : "Create your first deck, then turn your notes into study cards."}</p><Link href={featured ? `/decks/${featured.id}/study` : "/decks"} className="mt-6 inline-flex rounded-full bg-paper px-5 py-3 text-sm font-semibold text-forest">{featured ? "Continue studying" : "Create your first deck"} <ArrowRight className="ml-2" size={16}/></Link></div><div className="rounded-2xl border border-white/20 bg-white/10 p-5 md:min-w-48"><p className="text-xs text-white/65">Cards in this library</p><p className="mt-2 font-display text-4xl">{cards}</p><div className="mt-3 h-1.5 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${cards ? Math.min(100, (due / cards) * 100) : 0}%` }}/></div><p className="mt-2 text-xs text-white/60">{due} due for review</p></div></div></Panel>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{icon:BookOpen,label:"Cards in library",value:cards,foot:"Saved in your database"},{icon:Clock3,label:"Due to review",value:due,foot:"Based on review schedule"},{icon:Flame,label:"Study streak",value:"Track as you go",foot:"Session history is evolving"},{icon:TrendingUp,label:"Recall accuracy",value:"Build your history",foot:"Based on recorded reviews"}].map((metric)=><Panel key={metric.label}><metric.icon className="text-forest" size={18}/><p className="mt-4 text-xs text-ink/55">{metric.label}</p><p className="mt-1 font-display text-2xl">{metric.value}</p><p className="mt-2 text-[11px] text-ink/45">{metric.foot}</p></Panel>)}</div>
    <div className="mt-9 grid gap-8 xl:grid-cols-[1.2fr_.8fr]"><section><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-forest">Your library</p><h2 className="mt-1 font-display text-2xl">Recent decks</h2></div><Link href="/decks" className="text-sm font-semibold text-forest">All decks <ArrowRight className="ml-1 inline" size={14}/></Link></div>{error&&<p role="alert" className="mb-3 rounded-xl border border-clay/50 p-3 text-sm">{error}</p>}{loading?<p role="status" className="text-sm text-ink/55">Loading your decks...</p>:decks.length?<div className="space-y-3">{decks.slice(0,3).map((deck)=><Link key={deck.id} href={`/decks/${deck.id}`} className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition hover:shadow-paper"><div><p className="font-semibold">{deck.name}</p><p className="mt-1 text-xs text-ink/50">{deck.subject} · {deck.cards.length} cards</p></div><ArrowRight size={17} className="text-ink/40"/></Link>)}</div>:<Panel><p className="font-semibold">No decks yet</p><p className="mt-1 text-sm text-ink/55">Create a deck to give your notes a home.</p><Link href="/decks" className="mt-3 inline-flex text-sm font-semibold text-forest">Create a deck <ArrowRight className="ml-1" size={15}/></Link></Panel>}</section><section><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[.2em] text-forest">A next step</p><h2 className="mt-1 font-display text-2xl">Keep it moving</h2></div><Panel><div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-forest"><Plus size={20}/></span><div><h3 className="font-semibold">Turn notes into prompts</h3><p className="mt-1 text-sm leading-5 text-ink/55">Preview locally generated cards, approve the ones you want, and save them to a deck.</p><Link href="/create" className="mt-4 inline-flex text-sm font-semibold text-forest">Create cards <ArrowRight className="ml-1" size={15}/></Link></div></div></Panel><Panel className="mt-3"><h3 className="font-semibold">Your review queue</h3><p className="mt-1 text-sm text-ink/55">{due} saved cards are due for review.</p><Link href="/review" className="mt-3 inline-flex text-sm font-semibold text-forest">Open review queue <ArrowRight className="ml-1" size={14}/></Link></Panel></section></div>
  </AppShell>;
}
