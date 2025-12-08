'use client';
import { useActionState, Suspense } from 'react';
import { Terminal, Play, Loader2, Bot, Database, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { handleQuery, type QueryResultState } from '@/app/actions';
import { TypingAnimation } from '@/app/components/typing-animation';

const initialState: QueryResultState = {
  id: 'initial',
  query: '',
};

function QueryForm({ formAction, isPending }: { formAction: (payload: FormData) => void; isPending: boolean }) {
  return (
    <form action={formAction} className="space-y-4">
      <div className="relative">
        <Textarea
          name="query"
          placeholder="e.g., Show me the monthly revenue breakdown by region for 2024"
          className="bg-muted border-2 border-border/50 focus:border-primary/50 min-h-[100px] text-base p-4 pr-32"
          disabled={isPending}
          required
        />
        <Button
          type="submit"
          disabled={isPending}
          className="absolute bottom-3 right-3"
          size="lg"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Play />}
          <span className="ml-2">Execute</span>
        </Button>
      </div>
    </form>
  );
}

function EvidencePanel({ result }: { result: QueryResultState }) {
  const headers = result.data && result.data.length > 0 ? Object.keys(result.data[0]) : [];

  return (
    <Card className="flex-1 min-w-[50%] bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database />
          The Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-code text-lg font-semibold text-accent/80 mb-2">Generated SQL</h3>
          <pre className="bg-background p-4 rounded-md text-sm overflow-x-auto font-code">
            <code>{result.sql || 'N/A'}</code>
          </pre>
        </div>

        {result.correctedSQL && (
          <div>
            <h3 className="font-code text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4"/>
              Corrected SQL
            </h3>
            <pre className="bg-background p-4 rounded-md text-sm overflow-x-auto font-code">
              <code>{result.correctedSQL}</code>
            </pre>
          </div>
        )}
        
        <div>
          <h3 className="font-code text-lg font-semibold text-accent/80 mb-2">Query Result</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map(header => <TableHead key={header} className="font-bold">{header}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data?.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {headers.map(header => <TableCell key={header}>{String(row[header])}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function ResultsDisplay({ result, isPending }: { result: QueryResultState; isPending: boolean }) {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="flex-1">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bot /> The Insight</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader><CardTitle className="flex items-center gap-2"><Database /> The Evidence</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result.error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {String(result.error)}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (result.id === 'initial') return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot />
            The Insight
          </CardTitle>
          <p className="text-muted-foreground text-sm pt-2">Natural language summary of the query results.</p>
        </CardHeader>
        <CardContent>
          <TypingAnimation text={result.summary || ''} className="text-lg leading-relaxed" />
        </CardContent>
      </Card>
      <Suspense fallback={<Skeleton className="h-96 w-full flex-1" />}>
        <EvidencePanel result={result} />
      </Suspense>
    </div>
  );
}


export default function Home() {
  const [state, formAction, isPending] = useActionState(handleQuery, initialState);

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
        <Card className="p-6 md:p-8 bg-card/50 border-2 border-border/30">
          <QueryForm formAction={formAction} isPending={isPending} />
        </Card>
        
        <ResultsDisplay result={state} isPending={isPending} />
      </main>
    </div>
  );
}
