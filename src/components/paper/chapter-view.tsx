
'use client';

import { PaperPage } from './paper-page';
import { type GenerateChaptersOutput } from '@/ai/flows/ai-powered-chapters';
import parse from 'html-react-parser';


interface ChapterViewProps {
    chapter: GenerateChaptersOutput['chapters'][0];
    pageNumber: number;
}

export function ChapterView({ chapter, pageNumber }: ChapterViewProps) {
    return (
        <PaperPage pageNumber={pageNumber}>
            {parse(chapter.content)}
        </PaperPage>
    );
}

    