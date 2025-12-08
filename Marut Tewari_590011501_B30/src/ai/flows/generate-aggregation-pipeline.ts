'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAggregationPipelineInputSchema = z.object({
  query: z.string().describe('The natural language query to translate into a MongoDB aggregation pipeline.'),
  schema: z.string().describe('The database schema information, provided in JSON format.'),
  currentDateTime: z.string().describe('The current date and time.'),
});
export type GenerateAggregationPipelineInput = z.infer<typeof GenerateAggregationPipelineInputSchema>;

const GenerateAggregationPipelineOutputSchema = z.object({
  pipeline: z.string().describe('The generated MongoDB aggregation pipeline in JSON format.'),
});
export type GenerateAggregationPipelineOutput = z.infer<typeof GenerateAggregationPipelineOutputSchema>;

export async function generateAggregationPipeline(
  input: GenerateAggregationPipelineInput
): Promise<GenerateAggregationPipelineOutput> {
  return generateAggregationPipelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAggregationPipelinePrompt',
  input: {schema: GenerateAggregationPipelineInputSchema},
  output: {schema: GenerateAggregationPipelineOutputSchema},
  prompt: `You are an expert in MongoDB aggregation pipelines.
  Given the following natural language query, generate a MongoDB aggregation pipeline that satisfies the query.
  The pipeline should be returned as a JSON string.

  Query: {{{query}}}

  Here is the database schema information:
  {{{schema}}}

  Current Date/Time: {{{currentDateTime}}}

  Output ONLY valid JSON representing the MongoDB Aggregation Pipeline. No markdown explanations.
`,
});

const generateAggregationPipelineFlow = ai.defineFlow(
  {
    name: 'generateAggregationPipelineFlow',
    inputSchema: GenerateAggregationPipelineInputSchema,
    outputSchema: GenerateAggregationPipelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
