import { SyncPanel } from '@/components/sync-panel';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <SyncPanel />
      </div>
    </main>
  );
}