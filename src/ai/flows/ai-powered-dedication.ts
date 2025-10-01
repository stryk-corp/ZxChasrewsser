
// This is a server-side file.
'use server';

/**
 * @fileOverview AI-powered dedication generator for academic papers.
 *
 * - generateDedication - A function that generates a dedication.
 * - DedicationInput - The input type for the generateDedication function.
 * - DedicationOutput - The return type for the generateDedication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DedicationInputSchema = z.object({
  topic: z.string().describe('The topic to be used in the dedication.'),
});
export type DedicationInput = z.infer<typeof DedicationInputSchema>;

const DedicationOutputSchema = z.object({
  dedication: z.string().describe('The generated dedication, as a simple string without any HTML tags.'),
});
export type DedicationOutput = z.infer<typeof DedicationOutputSchema>;

export async function generateDedication(input: DedicationInput): Promise<DedicationOutput> {
  return generateDedicationFlow(input);
}

const dedicationPrompt = ai.definePrompt({
  name: 'dedicationPrompt',
  input: {schema: DedicationInputSchema},
  output: {schema: DedicationOutputSchema},
  prompt: `Write a heartfelt and appropriate dedication for an academic paper on the topic of {{{topic}}}. The dedication should be no more than 4 sentences. Output only the text of the dedication.`,
});

const generateDedicationFlow = ai.defineFlow(
  {
    name: 'generateDedicationFlow',
    inputSchema: DedicationInputSchema,
    outputSchema: DedicationOutputSchema,
  },
  async (input: DedicationInput) => {
    const {output} = await dedicationPrompt(input);
    return output!;
  }
);

    