// This is an AI-powered flow to generate an acknowledgement section for an academic paper.
'use server';

/**
 * @fileOverview Generates an acknowledgement section for an academic paper.
 *
 * - generateAcknowledgement - A function that generates the acknowledgement section.
 * - GenerateAcknowledgementInput - The input type for the generateAcknowledgement function.
 * - GenerateAcknowledgementOutput - The return type for the generateAcknowledgement function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';

const GenerateAcknowledgementInputSchema = z.object({
  researchTopic: z.string().describe('The topic of the research paper.'),
  relevantParties: z.string().describe('List of relevant parties and institutions to acknowledge, separated by commas.'),
});
export type GenerateAcknowledgementInput = z.infer<typeof GenerateAcknowledgementInputSchema>;

const GenerateAcknowledgementOutputSchema = z.object({
  acknowledgementSection: z.string().describe('The generated acknowledgement section.'),
});
export type GenerateAcknowledgementOutput = z.infer<typeof GenerateAcknowledgementOutputSchema>;

export async function generateAcknowledgement(input: GenerateAcknowledgementInput): Promise<GenerateAcknowledgementOutput> {
  return generateAcknowledgementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAcknowledgementPrompt',
  input: {schema: GenerateAcknowledgementInputSchema},
  output: {schema: GenerateAcknowledgementOutputSchema},
  prompt: `You are a helpful AI assistant. You are to generate a professional and comprehensive acknowledgement section for an academic paper.

  The research topic is: {{{researchTopic}}}.

  Acknowledge the following parties and institutions: {{{relevantParties}}}.

  Ensure the acknowledgement section is well-written, expressing gratitude and recognizing the contributions of the mentioned parties.
  `,
});

const generateAcknowledgementFlow = ai.defineFlow(
  {
    name: 'generateAcknowledgementFlow',
    inputSchema: GenerateAcknowledgementInputSchema,
    outputSchema: GenerateAcknowledgementOutputSchema,
  },
  async (input: GenerateAcknowledgementInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
