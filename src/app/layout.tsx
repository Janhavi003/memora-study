import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
export const metadata: Metadata = { title: "Memora — Turn notes into knowledge", description: "A local-first study workspace for flashcards, quizzes, and spaced repetition." };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="light" enableSystem>{children}</ThemeProvider></body></html>;
}