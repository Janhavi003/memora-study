"use client";
import { useEffect, useState } from "react";
import { BookOpen, Clock3, TrendingUp, Layers3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageTitle, Panel } from "@/components/ui";

type Statistics = { totalDecks: number; totalCards: number; dueCards: number; totalReviews: number; reviewsToday: number; accuracy: number | null };
export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/statistics", { cache: "no-store" }).then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message || "Could not load statistics."); setStats((payload.data ?? payload) as Statistics); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load statistics.")); }, []);
  const metrics = [{ icon: Layers3, label: "Decks", value: stats?.totalDecks ?? "..." }, { icon: BookOpen, label: "Saved cards", value: stats?.totalCards ?? "..." }, { icon: Clock3, label: "Reviews today", value: stats?.reviewsToday ?? "..." }, { icon: TrendingUp, label: "Recall accuracy", value: stats?.accuracy == null ? "Not enough data" : `${stats.accuracy}%` }];
  return <AppShell><PageTitle eyebrow="Your learning patterns" title="Progress, without the noise." subtitle="These figures come from your saved decks and recorded reviews."/>{error && <p role="alert" className="mb-4 rounded-xl border border-clay/50 p-3 text-sm">{error}</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Panel key={metric.label}><metric.icon className="text-forest" size={19}/><p className="mt-4 text-sm text-ink/55">{metric.label}</p><p className="mt-1 font-display text-2xl">{metric.value}</p></Panel>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-2"><Panel><h2 className="font-display text-2xl">Review activity</h2><p className="mt-2 text-sm leading-6 text-ink/60">{stats ? `${stats.totalReviews} review${stats.totalReviews === 1 ? "" : "s"} recorded so far, including ${stats.reviewsToday} today.` : "Loading saved review activity..."}</p><div className="mt-5 rounded-xl bg-muted p-4"><p className="text-xs text-ink/50">Cards due</p><p className="mt-1 font-display text-3xl">{stats?.dueCards ?? "..."}</p></div></Panel><Panel><h2 className="font-display text-2xl">Build a steady rhythm</h2><p className="mt-2 text-sm leading-6 text-ink/60">Review ratings update the schedule for each card. Accuracy is based on recorded Good and Easy ratings. A streak chart can be added when study-session history is tracked.</p></Panel></div></AppShell>;
}
