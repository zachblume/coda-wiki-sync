"use client";

import { BookMarked } from "lucide-react";

export function Header() {
  return (
    <header className="mb-12">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <BookMarked className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Coda Wiki Sync</h1>
      </div>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto">
        Synchronize your Coda wiki documents to a Git repository with automatic Markdown conversion.
        Keep your documentation in sync across platforms.
      </p>
    </header>
  );
}