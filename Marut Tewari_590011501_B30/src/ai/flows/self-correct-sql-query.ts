'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelfCorrectSQLQueryInputSchema = z.object({
  sql: z.string().describe('The MySQL query to execute.'),
  query: z.string().describe('The original natural language query from the user.'),
  error: z.string().optional().describe('The error that occurred when executing the query.'),
});
export type SelfCorrectSQLQueryInput = z.infer<
  typeof SelfCorrectSQLQueryInputSchema
>;

const SelfCorrectSQLQueryOutputSchema = z.object({
  correctedSQL: z
    .string()
    .describe('The corrected MySQL query.'),
});
export type SelfCorrectSQLQueryOutput = z.infer<
  typeof SelfCorrectSQLQueryOutputSchema
>;

export async function selfCorrectSQLQuery(
  input: SelfCorrectSQLQueryInput
): Promise<SelfCorrectSQLQueryOutput> {
  return selfCorrectSQLQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selfCorrectSQLQueryPrompt',
  input: {schema: SelfCorrectSQLQueryInputSchema},
  output: {schema: SelfCorrectSQLQueryOutputSchema},
  prompt: `You are an expert MySQL query generator.

The user provided the following natural language query: {{{query}}}

The following query resulted in an error: {{{sql}}}

The error was: {{{error}}}

Fix the query so that it addresses the error. Output ONLY a valid MySQL query. No markdown explanations.`,
});

const selfCorrectSQLQueryFlow = ai.defineFlow(
  {
    name: 'selfCorrectSQLQueryFlow',
    inputSchema: SelfCorrectSQLQueryInputSchema,
    outputSchema: SelfCorrectSQLQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
