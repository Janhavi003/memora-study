"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BookOpen, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import type { Deck } from "@/lib/types";

export function DeckCard({ deck, onChange }: { deck: Deck; onChange: () => void }) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(deck.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(method: "PATCH" | "DELETE", body?: unknown) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/decks/${encodeURIComponent(deck.id)}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const payload = method === "DELETE" ? null : await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || "Could not update this deck.");
      setEditing(false);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this deck.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDeck() {
    if (!window.confirm(`Delete "${deck.name}" and its cards? This cannot be undone.`)) return;
    await update("DELETE");
  }

  return <article className="group rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-paper">
    <div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl ${deck.color === "clay" ? "bg-orange-100 text-orange-900" : deck.color === "blue" ? "bg-blue-100 text-blue-900" : deck.color === "sand" ? "bg-amber-100 text-amber-900" : "bg-sage text-forest"}`}><BookOpen size={20}/></span><div className="relative"><button type="button" aria-label={`Actions for ${deck.name}`} className="rounded-lg p-2 hover:bg-muted" onClick={() => setMenu(!menu)}><MoreHorizontal size={19}/></button>{menu && <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-line bg-surface p-1 shadow-xl"><button type="button" onClick={() => { setMenu(false); setEditing(true); setName(deck.name); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-muted"><PenLine size={14}/> Rename</button><button type="button" disabled={busy} onClick={() => { setMenu(false); void deleteDeck(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-700 hover:bg-red-50"><Trash2 size={14}/> Delete</button></div>}</div></div>
    {editing ? <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (name.trim()) void update("PATCH", { name: name.trim() }); }}><input autoFocus required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="min-w-0 w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm outline-none focus:border-forest"/><button disabled={busy || !name.trim()} className="text-xs font-bold text-forest disabled:opacity-50">{busy ? "Saving..." : "Save"}</button><button type="button" onClick={() => setEditing(false)} className="text-xs text-ink/50">Cancel</button></form> : <Link href={`/decks/${deck.id}`} className="mt-4 block"><h3 className="font-display text-xl">{deck.name}<ArrowUpRight className="ml-1 inline opacity-0 transition group-hover:opacity-60" size={15}/></h3></Link>}
    <p className="mt-1 min-h-10 text-sm leading-5 text-ink/55">{deck.description || "A place for your next learning session."}</p>
    {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    <div className="mt-5 flex items-center justify-between border-t border-line pt-4"><span className="rounded-full bg-muted px-2.5 py-1 text-[11px]">{deck.subject}</span><span className="text-xs text-ink/60">{deck.cards.length} cards · {deck.cards.filter((card) => card.due).length} due</span></div>
  </article>;
}
