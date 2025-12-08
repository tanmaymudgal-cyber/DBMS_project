'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDataInsightsInputSchema = z.object({
  data: z.string().describe('The JSON data to summarize.'),
  query: z.string().describe('The natural language query that generated the data.'),
});
export type SummarizeDataInsightsInput = z.infer<typeof SummarizeDataInsightsInputSchema>;

const SummarizeDataInsightsOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of the data insights.'),
});
export type SummarizeDataInsightsOutput = z.infer<typeof SummarizeDataInsightsOutputSchema>;

export async function summarizeDataInsights(input: SummarizeDataInsightsInput): Promise<SummarizeDataInsightsOutput> {
  return summarizeDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataInsightsPrompt',
  input: {schema: SummarizeDataInsightsInputSchema},
  output: {schema: SummarizeDataInsightsOutputSchema},
  prompt: `You are an expert data analyst. Given the following data and the query that generated it, provide a concise natural language summary of the key insights.

Query: {{{query}}}

Data: {{{data}}}

Summary: `,
});

const summarizeDataInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeDataInsightsFlow',
    inputSchema: SummarizeDataInsightsInputSchema,
    outputSchema: SummarizeDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
