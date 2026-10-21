"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Layers3, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageTitle, Panel } from "@/components/ui";
import type { Deck } from "@/lib/types";

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDecks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/decks", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error?.message || "Could not load your decks.");
      }

      const result = payload.data ?? payload;
      setDecks(Array.isArray(result) ? result : result.decks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your decks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDecks();
  }, [loadDecks]);

  return (
    <AppShell>
      <PageTitle
        eyebrow="Your workspace"
        title="Your decks"
        subtitle="All your saved study materials, together in one place."
        action={
          <Link
            href="/decks/new"
            className="inline-flex items-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} className="mr-2" />
            New deck
          </Link>
        }
      />

      {loading ? (
        <p role="status" className="text-sm text-ink/60">Loading your decks...</p>
      ) : error ? (
        <Panel>
          <p role="alert" className="text-sm text-ink/70">{error}</p>
          <button
            onClick={() => void loadDecks()}
            className="mt-3 rounded-xl border border-line px-4 py-2 text-sm"
          >
            Try again
          </button>
        </Panel>
      ) : decks.length === 0 ? (
        <Panel className="py-12 text-center">
          <Layers3 size={32} className="mx-auto text-ink/50" />
          <h2 className="mt-4 font-display text-2xl">Start your first deck</h2>
          <p className="mt-2 text-sm text-ink/60">
            Create a deck to organize your notes and study cards.
          </p>
          <Link
            href="/decks/new"
            className="mt-5 inline-flex items-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create a deck
          </Link>
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/decks/${deck.id}`} className="group block">
              <Panel className="h-full transition-shadow group-hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
                      {deck.subject || "General"}
                    </p>
                    <h2 className="mt-2 font-display text-xl">{deck.name}</h2>
                  </div>
                  <Layers3 size={20} className="shrink-0 text-forest" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-ink/60">
                  {deck.description || "Your saved study cards."}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="text-ink/60">
                    {deck.cards?.length ?? 0} cards
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-forest">
                    Open deck <ArrowRight size={15} />
                  </span>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}