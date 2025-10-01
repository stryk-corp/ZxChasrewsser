
'use server';

/**
 * @fileOverview An AI agent that generates a conclusion for an academic paper.
 *
 * - generateConclusion - A function that generates the conclusion.
 * - GenerateConclusionInput - The input type for the generateConclusion function.
 * - GenerateConclusionOutput - The return type for the generateConclusion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateConclusionInputSchema = z.object({
  topic: z.string().describe('The topic of the academic paper.'),
  keyHighlights: z.string().describe('Key highlights and takeaways from the research.'),
});
export type GenerateConclusionInput = z.infer<typeof GenerateConclusionInputSchema>;

const GenerateConclusionOutputSchema = z.object({
  conclusion: z.string().describe('An insightful and elaborate conclusion as a single HTML string with paragraphs. Do not include a heading.'),
});
export type GenerateConclusionOutput = z.infer<typeof GenerateConclusionOutputSchema>;

export async function generateConclusion(input: GenerateConclusionInput): Promise<GenerateConclusionOutput> {
  return generateConclusionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConclusionPrompt',
  input: {schema: GenerateConclusionInputSchema},
  output: {schema: GenerateConclusionOutputSchema},
  prompt: `You are an expert academic writer tasked with writing a compelling conclusion for a research paper.

  Based on the topic and key highlights provided, write an insightful and elaborate conclusion that summarizes the research and provides a strong finishing statement.

  Topic: {{{topic}}}
  Key Highlights: {{{keyHighlights}}}
  
  Format the output as a single HTML string, with the text wrapped in <p> tags for each paragraph. Do not include a <h2>Conclusion</h2> heading.
  `,
});

const generateConclusionFlow = ai.defineFlow(
  {
    name: 'generateConclusionFlow',
    inputSchema: GenerateConclusionInputSchema,
    outputSchema: GenerateConclusionOutputSchema,
  },
  async (input: GenerateConclusionInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);

    