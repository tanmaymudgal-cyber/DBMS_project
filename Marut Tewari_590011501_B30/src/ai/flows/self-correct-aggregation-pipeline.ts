'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelfCorrectAggregationPipelineInputSchema = z.object({
  pipeline: z.string().describe('The MongoDB aggregation pipeline to execute.'),
  query: z.string().describe('The original natural language query from the user.'),
  error: z.string().optional().describe('The error that occurred when executing the pipeline.'),
});
export type SelfCorrectAggregationPipelineInput = z.infer<
  typeof SelfCorrectAggregationPipelineInputSchema
>;

const SelfCorrectAggregationPipelineOutputSchema = z.object({
  correctedPipeline: z
    .string()
    .describe('The corrected MongoDB aggregation pipeline.'),
});
export type SelfCorrectAggregationPipelineOutput = z.infer<
  typeof SelfCorrectAggregationPipelineOutputSchema
>;

export async function selfCorrectAggregationPipeline(
  input: SelfCorrectAggregationPipelineInput
): Promise<SelfCorrectAggregationPipelineOutput> {
  return selfCorrectAggregationPipelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selfCorrectAggregationPipelinePrompt',
  input: {schema: SelfCorrectAggregationPipelineInputSchema},
  output: {schema: SelfCorrectAggregationPipelineOutputSchema},
  prompt: `You are an expert MongoDB aggregation pipeline generator.

The user provided the following natural language query: {{{query}}}

The following pipeline resulted in an error: {{{pipeline}}}

The error was: {{{error}}}

Fix the pipeline so that it addresses the error. Output ONLY valid JSON representing the MongoDB Aggregation Pipeline. No markdown explanations.`,
});

const selfCorrectAggregationPipelineFlow = ai.defineFlow(
  {
    name: 'selfCorrectAggregationPipelineFlow',
    inputSchema: SelfCorrectAggregationPipelineInputSchema,
    outputSchema: SelfCorrectAggregationPipelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
