
'use server';

/**
 * @fileOverview Generates chapter content for an academic paper.
 *
 * - generateChapters - A function that generates chapter content.
 * - GenerateChaptersInput - The input type for the generateChapters function.
 * - GenerateChaptersOutput - The return type for the generateChapters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';


const GenerateChaptersInputSchema = z.object({
  topic: z.string().describe('The topic of the academic paper.'),
  numberOfChapters: z.number().describe('The number of chapters to generate.'),
});
export type GenerateChaptersInput = z.infer<typeof GenerateChaptersInputSchema>;

const ChapterSchema = z.object({
    title: z.string().describe('The title of the chapter, without the "Chapter X:" prefix.'),
    content: z.string().describe('The full HTML content of the chapter, following the provided format.'),
});

const GenerateChaptersOutputSchema = z.object({
  chapters: z.array(ChapterSchema).describe('An array of generated chapters.'),
});
export type GenerateChaptersOutput = z.infer<typeof GenerateChaptersOutputSchema>;

export type TOCEntry = {
  level: number;
  text: string;
  children: TOCEntry[];
}

export async function generateChapters(input: GenerateChaptersInput): Promise<GenerateChaptersOutput> {
  return generateChaptersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChaptersPrompt',
  input: {schema: GenerateChaptersInputSchema},
  output: {schema: GenerateChaptersOutputSchema},
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
        },
    ]
  },
  prompt: `You are an expert academic writer. Your task is to generate {{{numberOfChapters}}} detailed, comprehensive, and well-structured chapters for a paper on the topic: "{{{topic}}}".

**HTML Formatting Guide:**
- \`<h1>Chapter X: {Chapter Title}</h1>\`: Main chapter title. Replace X with the correct chapter number.
- \`<h2>{Section Title}</h2>\`: Section heading. Use these to structure the chapter with multiple sections. Each chapter must have at least 2-3 sections.
- \`<h3>{Subsection Title}</h3>\`: Subsection heading. Use these for finer-grained structure within sections.
- \`<p>{text}</p>\`: Standard paragraph text. Ensure paragraphs are substantive and well-developed. Each section should have multiple paragraphs of detailed, academic text.
- \`<div class="equation">{text}</div>\`: For mathematical equations.
- \`<span class="definition">{text}</span>\`: To highlight a key term or definition within a paragraph.
- \`<div class="important">{text}</div>\`: To present a key takeaway, summary, or important list. Can contain <p> or <strong> tags.
- \`<span class="quantum-number">{text}</span>\`: For specific scientific terms like quantum numbers.
- **Do NOT under any circumstances include any \`<img>\` tags or generate any images or figures.** The output must be purely text and structural HTML as defined above.

**Output Generation Instructions:**
1.  **Generate Deep Content**: Create exactly {{{numberOfChapters}}} chapters related to "{{{topic}}}". Each chapter must be extremely detailed, academic, and well-structured with multiple sections (\`<h2>\`) and subsections (\`<h3>\`). The content must be substantial, thorough, and suitable for a university-level paper. Each paragraph must be well-developed and provide significant information.
2.  **The 'content' field for each chapter object must contain ONLY the HTML for that chapter, starting with the \`<h1>\` tag.** The h1 tag MUST follow the format "Chapter X: {Chapter Title}".
3.  **The 'title' field for each chapter object should contain ONLY the chapter title itself, without the "Chapter X:" prefix.**
4.  **Do NOT generate an abstract, introduction, conclusion, or references.** Only generate the body chapters of the paper.
`,
});


const generateChaptersFlow = ai.defineFlow(
  {
    name: 'generateChaptersFlow',
    inputSchema: GenerateChaptersInputSchema,
    outputSchema: GenerateChaptersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
