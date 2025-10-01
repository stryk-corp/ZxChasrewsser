'use server';

/**
 * @fileOverview An AI agent that generates a list of references for an academic paper.
 *
 * - generateReferences - A function that generates the references.
 * - GenerateReferencesInput - The input type for the generateReferences function.
 * - GenerateReferencesOutput - The return type for the generateReferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateReferencesInputSchema = z.object({
  topic: z.string().describe('The topic of the academic paper.'),
});
export type GenerateReferencesInput = z.infer<typeof GenerateReferencesInputSchema>;

const GenerateReferencesOutputSchema = z.object({
  references: z.array(z.string()).describe('An array of academic references in a standard citation format.'),
});
export type GenerateReferencesOutput = z.infer<typeof GenerateReferencesOutputSchema>;

export async function generateReferences(input: GenerateReferencesInput): Promise<GenerateReferencesOutput> {
  return generateReferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReferencesPrompt',
  input: {schema: GenerateReferencesInputSchema},
  output: {schema: GenerateReferencesOutputSchema},
  prompt: `You are an expert academic researcher. Generate a list of 5-7 relevant, academic references for a paper on the following topic.

  Topic: {{{topic}}}

  The references should be formatted in a consistent, standard citation style (like APA or MLA). Each reference should be a single string.
  `,
});

const generateReferencesFlow = ai.defineFlow(
  {
    name: 'generateReferencesFlow',
    inputSchema: GenerateReferencesInputSchema,
    outputSchema: GenerateReferencesOutputSchema,
  },
  async (input: GenerateReferencesInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
