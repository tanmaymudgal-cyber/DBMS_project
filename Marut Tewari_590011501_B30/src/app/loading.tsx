import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Bot, Database } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8">
      <header className="text-center my-8">
        <h1 className="font-headline text-5xl font-bold flex items-center justify-center gap-3">
          <Terminal className="w-12 h-12 text-accent" />
          SQLInsight
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Your AI-powered MySQL Analytics Agent</p>
      </header>

      <main>
        <Skeleton className="h-[148px] w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
