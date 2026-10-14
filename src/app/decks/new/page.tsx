"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Input, PageTitle, Panel } from "@/components/ui";
import { mockService } from "@/lib/mock-service";
export default function NewDeckPage() {
 const router=useRouter(); const [name,setName]=useState(""); const [subject,setSubject]=useState("General"); const [description,setDescription]=useState(""); const [error,setError]=useState("");
 return <AppShell><Link href="/decks" className="inline-flex items-center gap-2 text-sm text-ink/55"><ArrowLeft size={15}/> Back to decks</Link><PageTitle eyebrow="Deck library" title="Start a new collection." subtitle="Give a subject a home. You can add cards now or build a deck from notes."/><Panel className="max-w-2xl"><form className="space-y-5" onSubmit={e=>{e.preventDefault();if(!name.trim()){setError("Enter a deck name to continue.");return;}const deck=mockService.createDeck({name,subject,description});router.push(`/decks/${deck.id}`);}}><label className="block text-sm font-medium">Deck name<Input autoFocus required value={name} onChange={e=>{setName(e.target.value);setError("");}} placeholder="e.g. Organic Chemistry" className="mt-2"/></label><label className="block text-sm font-medium">Subject<Input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="General" className="mt-2"/></label><label className="block text-sm font-medium">Description <span className="font-normal text-ink/45">(optional)</span><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder="What do you want to learn?" className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm outline-none focus:border-forest"/></label>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex gap-3"><Button type="submit"><Plus size={16}/> Create deck</Button><Button type="button" variant="outline" onClick={()=>router.push("/decks")}>Cancel</Button></div><p className="text-xs text-ink/45">Preview only: the new deck is held in memory and will reset when the app reloads.</p></form></Panel></AppShell>;
}
