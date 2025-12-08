'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSQLQueryInputSchema = z.object({
  query: z.string().describe('The natural language query to translate into a MySQL query.'),
  schema: z.string().describe('The database schema information, provided in JSON format.'),
  currentDateTime: z.string().describe('The current date and time.'),
});
export type GenerateSQLQueryInput = z.infer<typeof GenerateSQLQueryInputSchema>;

const GenerateSQLQueryOutputSchema = z.object({
  sql: z.string().describe('The generated MySQL query.'),
});
export type GenerateSQLQueryOutput = z.infer<typeof GenerateSQLQueryOutputSchema>;

export async function generateSQLQuery(
  input: GenerateSQLQueryInput
): Promise<GenerateSQLQueryOutput> {
  return generateSQLQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSQLQueryPrompt',
  input: {schema: GenerateSQLQueryInputSchema},
  output: {schema: GenerateSQLQueryOutputSchema},
  prompt: `You are an expert in MySQL.
  Given the following natural language query, generate a MySQL query that satisfies the query.
  The query should be returned as a SQL string.

  Query: {{{query}}}

  Here is the database schema information:
  {{{schema}}}

  Current Date/Time: {{{currentDateTime}}}

  Output ONLY a valid MySQL query. No markdown explanations.
`,
});

const generateSQLQueryFlow = ai.defineFlow(
  {
    name: 'generateSQLQueryFlow',
    inputSchema: GenerateSQLQueryInputSchema,
    outputSchema: GenerateSQLQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
