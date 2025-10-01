'use client';

import { Suspense, useState, useEffect, useMemo, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PaperDetails } from '@/components/wizard';
import { generateChapters, type GenerateChaptersOutput, type TOCEntry } from '@/ai/flows/ai-powered-chapters';
import { generateDedication } from '@/ai/flows/ai-powered-dedication';
import { generateAcknowledgement } from '@/ai/flows/ai-powered-acknowledgement';
import { generateConclusion } from '@/ai/flows/ai-powered-conclusion';
import { generateReferences } from '@/ai/flows/ai-powered-references';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, BookOpenCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { CoverPageView } from '@/components/paper/cover-page-view';
import { DedicationView } from '@/components/paper/dedication-view';
import { AcknowledgementView } from '@/components/paper/acknowledgement-view';
import { TableOfContentsView } from '@/components/paper/toc-view';
import { ChapterView } from '@/components/paper/chapter-view';
import { ConclusionView } from '@/components/paper/conclusion-view';
import { ReferencesView } from '@/components/paper/references-view';
import { PayWithPaystackButton } from '@/components/paper/paystack-button';


const LoadingPaperView = ({ progress, status }: { progress: number; status: string }) => {
    return (
        <div className="w-full max-w-2xl bg-white p-12 mx-auto my-8 shadow-2xl flex flex-col items-center justify-center text-center rounded-lg">
            <BookOpenCheck className="h-16 w-16 text-primary mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-primary mb-4">{status}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">The AI is crafting your paper. This may take a moment.</p>
            <div className="w-full max-w-sm">
                <Progress value={progress} className="w-full" />
                <p className="text-sm font-medium text-primary mt-2">{Math.round(progress)}%</p>
            </div>
        </div>
    );
};

function buildToc(chapters: GenerateChaptersOutput['chapters']): TOCEntry[] {
    const toc: TOCEntry[] = [];
    if (!chapters) return toc;

    chapters.forEach((chapter, chapterIndex) => {
        const chapterNumber = chapterIndex + 1;
        
        const h1Match = chapter.content.match(/<h1[^>]*>.*?:\s*(.*?)<\/h1>/);
        const chapterTitle = h1Match ? h1Match[1] : `Chapter ${chapterNumber}`;

        const chapterEntry: TOCEntry = {
            level: 1,
            text: `CHAPTER ${chapterNumber}: ${chapterTitle.toUpperCase()}`,
            children: []
        };

        if (typeof window !== 'undefined') {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(chapter.content, 'text/html');
                
                doc.querySelectorAll('h2').forEach((h2, sectionIndex) => {
                    const sectionNumber = sectionIndex + 1;
                    const sectionText = h2.textContent || '';
                    
                    const sectionEntry: TOCEntry = {
                        level: 2,
                        text: `${chapterNumber}.${sectionNumber} ${sectionText}`,
                        children: []
                    };

                    let nextSibling = h2.nextElementSibling;
                    while(nextSibling && nextSibling.tagName !== 'H2') {
                        if (nextSibling.tagName === 'H3') {
                            const subSectionText = nextSibling.textContent || '';
                             sectionEntry.children.push({
                                level: 3,
                                text: subSectionText,
                                children: []
                            });
                        }
                        nextSibling = nextSibling.nextElementSibling;
                    }

                    chapterEntry.children.push(sectionEntry);
                });
            } catch (e) {
                console.error("Could not parse chapter content for TOC", e);
            }
        }


        toc.push(chapterEntry);
    });

    return toc;
}


function PaperContent() {
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationError, setGenerationError] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('Initiating Generation...');
  
  // State for all generated content
  const [dedication, setDedication] = useState('');
  const [acknowledgement, setAcknowledgement] = useState('');
  const [chapters, setChapters] = useState<GenerateChaptersOutput['chapters']>([]);
  const [toc, setToc] = useState<TOCEntry[]>([]);
  const [conclusion, setConclusion] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  
  const paperDetails: PaperDetails = useMemo(() => {
    return {
        universityName: searchParams.get('universityName') || '',
        faculty: searchParams.get('faculty') || '',
        department: searchParams.get('department') || '',
        courseCode: searchParams.get('courseCode') || '',
        courseTitle: searchParams.get('courseTitle') || '',
        studentName: searchParams.get('studentName') || '',
        studentId: searchParams.get('studentId') || '',
        lecturerName: searchParams.get('lecturerName') || '',
        date: searchParams.get('date') || '',
        paperTopic: searchParams.get('paperTopic') || '',
        paperHighlights: searchParams.get('paperHighlights') || '',
        numberOfChapters: parseInt(searchParams.get('numberOfChapters') || '1', 10),
        ackParties: searchParams.get('ackParties') || '',
        pageBorder: searchParams.get('pageBorder') || 'none',
        pageBorderScope: searchParams.get('pageBorderScope') || 'all',
        pageNumberAlign: searchParams.get('pageNumberAlign') || 'right',
        includeTOC: searchParams.get('includeTOC') === 'true',
        fontBody: searchParams.get('fontBody') || 'Literata',
        fontHeading: searchParams.get('fontHeading') || 'Literata',
        fontSize: parseInt(searchParams.get('fontSize') || '12', 10),
        lineSpacing: parseFloat(searchParams.get('lineSpacing') || '1.75'),
    }
  }, [searchParams]);

  useEffect(() => {
    async function generateAllContent() {
      if (!paperDetails.paperTopic) {
        setIsGenerating(false);
        return;
      }
      setIsGenerating(true);
      setGenerationError('');
      
      const totalSteps = paperDetails.includeTOC ? 5 : 4;
      let completedSteps = 0;

      const updateProgress = (status: string) => {
          completedSteps++;
          setGenerationStatus(status);
          setGenerationProgress((completedSteps / (totalSteps + 1)) * 100);
      };

      try {
        updateProgress('Generating Core Content...');
        const [dedicationResult, acknowledgementResult] = await Promise.all([
            generateDedication({ topic: paperDetails.paperTopic }),
            generateAcknowledgement({ researchTopic: paperDetails.paperTopic, relevantParties: paperDetails.ackParties })
        ]);
        setDedication(dedicationResult.dedication);
        setAcknowledgement(acknowledgementResult.acknowledgementSection);

        updateProgress('Generating Chapters...');
        const chaptersResult = await generateChapters({ 
            topic: paperDetails.paperTopic, 
            numberOfChapters: paperDetails.numberOfChapters,
        });
        setChapters(chaptersResult.chapters);

        if (paperDetails.includeTOC) {
            updateProgress('Building Table of Contents...');
            const generatedToc = buildToc(chaptersResult.chapters);
            setToc(generatedToc);
        }

        updateProgress('Generating Conclusion...');
        const conclusionResult = await generateConclusion({ topic: paperDetails.paperTopic, keyHighlights: paperDetails.paperHighlights });
        setConclusion(conclusionResult.conclusion);

        updateProgress('Generating References...');
        const referencesResult = await generateReferences({ topic: paperDetails.paperTopic });
        setReferences(referencesResult.references);
        
        setGenerationStatus('Finalizing Document...');
        setGenerationProgress(100);

      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : String(e);

        if (errorMessage.includes('429')) {
            setGenerationError('API rate limit exceeded. Please add more keys to the GEMINI_API_KEYS environment variable or wait a moment before trying again.');
        } else if (errorMessage.includes('An unexpected response was received from the server')) {
            setGenerationError('A server-side error occurred, possibly due to API rate limits. Please check your API keys and server logs.');
        }
        else {
            setGenerationError(`An unexpected error occurred: ${errorMessage}. Please check the console and try again.`);
        }
      } finally {
        setTimeout(() => setIsGenerating(false), 500);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('userImages'); // Clean up session storage
        }
      }
    }
    generateAllContent();
  }, [paperDetails]);


  if(!paperDetails.paperTopic) {
      return (
        <div className="w-full max-w-4xl bg-white p-12 mx-auto my-8 shadow-2xl flex flex-col items-center justify-center text-center rounded-lg">
            <h2 className="text-2xl font-bold text-destructive mb-4">Incomplete Information</h2>
            <p className="text-muted-foreground mb-6">Please start from the beginning to generate a paper.</p>
            <Button asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Start
                </Link>
            </Button>
        </div>
      );
  }

  if (isGenerating) {
      return <LoadingPaperView progress={generationProgress} status={generationStatus} />;
  }

  if (generationError) {
    return (
        <div className="w-full max-w-4xl bg-white p-12 mx-auto my-8 shadow-2xl flex flex-col items-center justify-center text-center rounded-lg">
            <h2 className="text-2xl font-bold text-destructive mb-4">Generation Failed</h2>
            <p className="text-muted-foreground mb-6 max-w-lg">{generationError}</p>
             <Button asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
                </Link>
            </Button>
        </div>
      );
  }

  const fontOptions = [
      { name: 'Literata', family: "'Literata', serif" },
      { name: 'Inter', family: "'Inter', sans-serif" },
      { name: 'Roboto', family: "'Roboto', sans-serif" },
      { name: 'Merriweather', family: "'Merriweather', serif" },
      { name: 'Source Code Pro', family: "'Source Code Pro', monospace" },
      { name: 'Playfair Display', family: "'Playfair Display', serif" },
  ];
  const bodyFont = fontOptions.find(f => f.name === paperDetails.fontBody)?.family || "'Literata', serif";
  const headingFont = fontOptions.find(f => f.name === paperDetails.fontHeading)?.family || "'Literata', serif";
  const hasBorder = (scope: string) => paperDetails.pageBorder !== 'none' && (paperDetails.pageBorderScope === 'all' || paperDetails.pageBorderScope === scope);
  
  const pageNumberAlignValue = paperDetails.pageNumberAlign === 'left' ? 'flex-start' : paperDetails.pageNumberAlign === 'center' ? 'center' : 'flex-end';
  const paperBorderColor = '#002147';

  // --- Page Numbering Logic ---
  let currentPage = 1;
  const pages = [];

  // Cover Page
  pages.push({ component: 'CoverPageView', props: { ...paperDetails, hasBorder: hasBorder('cover') }, pageNumber: currentPage });
  currentPage++;
  
  // Dedication
  pages.push({ component: 'DedicationView', props: { dedication: dedication, hasBorder: hasBorder('all') }, pageNumber: currentPage });
  currentPage++;
  
  // Acknowledgements
  pages.push({ component: 'AcknowledgementView', props: { acknowledgement: acknowledgement, authorName: paperDetails.studentName }, pageNumber: currentPage });
  currentPage++;
  
  // Table of Contents
  const tocPageNumber = currentPage;
  if (paperDetails.includeTOC) {
    pages.push({ component: 'TableOfContentsView', props: { toc: toc, hasBorder: hasBorder('all') }, pageNumber: tocPageNumber });
    currentPage++;
  }
  
  // Chapters
  const chaptersStartPage = currentPage;
  chapters.forEach((chapter) => {
    pages.push({ component: 'ChapterView', props: { chapter: chapter }, pageNumber: currentPage });
    currentPage++;
  });
  
  // Conclusion
  const conclusionPageNumber = currentPage;
  pages.push({ component: 'ConclusionView', props: { conclusion: conclusion }, pageNumber: conclusionPageNumber });
  currentPage++;
  
  // References
  const referencesPageNumber = currentPage;
  pages.push({ component: 'ReferencesView', props: { references: references }, pageNumber: referencesPageNumber });
  currentPage++;

  // Now, update TOC page numbers if it exists
  const tocIndex = pages.findIndex(p => p.component === 'TableOfContentsView');
  if (tocIndex !== -1) {
        const tocProps = pages[tocIndex].props as any;
        tocProps.conclusionPage = conclusionPageNumber;
        tocProps.referencesPage = referencesPageNumber;
        tocProps.chaptersStartPage = chaptersStartPage;
  }

  const componentMap: { [key: string]: React.ComponentType<any> } = {
    CoverPageView,
    DedicationView,
    AcknowledgementView,
    TableOfContentsView,
    ChapterView,
    ConclusionView,
    ReferencesView,
  };


  return (
    <>
      <style jsx global>{`
        :root {
          --paper-font-body: ${bodyFont};
          --paper-font-heading: ${headingFont};
          --paper-font-size: ${paperDetails.fontSize}pt;
          --paper-line-height: ${paperDetails.lineSpacing};
          --paper-page-number-align: ${pageNumberAlignValue};
          --paper-border-style: ${paperDetails.pageBorder};
          --paper-border-color: ${paperBorderColor};
        }
        @media print {
            body, html {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box;
                background: white !important;
            }
            .print-hidden {
                display: none !important;
            }
            .paper-body {
                width: 210mm !important;
                min-height: 297mm !important;
                max-width: 210mm !important;
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box;
                background: white !important;
            }
            @page {
                size: A4;
                margin: 0;
            }
        }
        body {
            background-color: #e2e8f0; /* bg-slate-200 */
        }
        .paper-body {
            color: #222;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .paper-body h1, .paper-body h2, .paper-body h3 {
            font-family: var(--paper-font-heading);
        }
        .paper-body h1 {
            font-size: 28pt;
            text-align: center;
            margin-bottom: 30pt;
            font-weight: bold;
            color: #002147;
            border-bottom: double 3pt #002147;
            padding-bottom: 10pt;
        }
        .paper-body h2 {
            font-size: 16pt;
            margin-top: 24pt;
            margin-bottom: 12pt;
            font-weight: bold;
            color: #003366;
            border-bottom: solid 1pt #003366;
        }
        .paper-body h3 {
            font-size: 14pt;
            margin-top: 18pt;
            margin-bottom: 6pt;
            font-weight: bold;
            font-style: italic;
            color: #00688B;
        }
        .paper-body .equation {
            text-align: center;
            font-family: 'Cambria Math', serif;
            margin: 18pt 0;
            padding: 6pt;
            background-color: #f8f8f8;
            border-left: 3pt solid #00688B;
        }
        .paper-body .definition {
            font-weight: bold;
            color: #8B2323;
            border-bottom: 1pt dotted #8B2323;
        }
        .paper-body .important {
            background-color: #FFF8DC;
            padding: 9pt;
            border-left: 3pt solid #FFD700;
            margin: 12pt 0;
        }
        .paper-body .quantum-number {
            font-family: 'Cambria Math', serif;
            font-weight: bold;
            color: #006400;
        }
        /* Allow selection inside payment UI and dialogs */
        .pay-area, .paystack-button, .radix-dialog, [data-radix-dialog] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
      `}</style>
      
        {pages.map((page, index) => {
            const Component = componentMap[page.component];
            if (!Component) return null;
            
            const props = {
                ...page.props,
                pageNumber: page.pageNumber,
            };

            return (
                <Fragment key={index}>
                    <Component {...props} />
                </Fragment>
            );
        })}

                    {/* Transparent overlay to block interaction during preview */}
                            <div
                                id="preview-block-overlay"
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    zIndex: 9999,
                                    background: 'rgba(255,255,255,0)',
                                    pointerEvents: 'none', /* allow clicks through overlay */
                                }}
                            />

        <div className="w-[210mm] mx-auto my-8 pay-area">
            <div className="bg-white p-8 shadow-xl text-center rounded-lg flex flex-col items-center" style={{pointerEvents: 'auto'}}>
                 <Download className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ready to Download?</h2>
                <p className="text-muted-foreground mb-6">Pay to download your final paper as a PDF.</p>
                <PayWithPaystackButton />
            </div>
        </div>

    </>
  );
}

export default function PaperPage() {
    // Print behavior: allow printing only after successful payment.
    useEffect(() => {
        // Payment flag exposed globally; default to false
        try {
            (window as any).__printPaid = (window as any).__printPaid === true;
        } catch (e) {}

        let bodyBackup: string | null = null;

        const beforePrint = (e?: any) => {
            try {
                const paid = !!(window as any).__printPaid;
                if (!paid) {
                    // Show payment modal instead of printing
                    setShowPrintModal(true);
                }
            } catch (err) {
                console.warn('beforePrint handler error', err);
            }
            if (e && typeof e.preventDefault === 'function') {
                // don't prevent — allow print dialog, but content is blank
            }
        };

        const afterPrint = () => {
            try {
                // Reset paid flag after printing to require payment again for future prints
                try { (window as any).__printPaid = false; } catch (e) {}
            } catch (err) {
                console.warn('afterPrint handler error', err);
            }
        };

        if (window.matchMedia) {
            const mql = window.matchMedia('print');
            if (mql && typeof mql.addListener === 'function') {
                mql.addListener((m) => { if (m.matches) beforePrint(); else afterPrint(); });
            }
        }

    window.addEventListener('beforeprint', beforePrint, true);
    window.addEventListener('afterprint', afterPrint, true);

        return () => {
            window.removeEventListener('beforeprint', beforePrint, true);
            window.removeEventListener('afterprint', afterPrint, true);
        };
    }, []);

    // Listen for payment success events to close modal and trigger printing
    useEffect(() => {
      function onPaymentSuccess(e: any) {
        try {
          (window as any).__printPaid = true;
        } catch (err) {}
        setShowPrintModal(false);
        // Give time for UI to update then trigger print
        setTimeout(() => {
          try { window.print(); } catch (err) { console.warn('print failed', err); }
        }, 200);
      }
      window.addEventListener('payment:success', onPaymentSuccess as EventListener);
      return () => window.removeEventListener('payment:success', onPaymentSuccess as EventListener);
    }, []);
    const [showPrintModal, setShowPrintModal] = useState(false);

        // Context menu: allow only on payment UI and dialog
        useEffect(() => {
            function onContextMenu(e: MouseEvent) {
                const target = e.target as HTMLElement | null;
                if (!target) return;
                // Allow right-click if inside pay components or dialog
                if (target.closest && (target.closest('.pay-area') || target.closest('.paystack-button') || target.closest('[data-radix-dialog]') || target.closest('.radix-dialog'))) {
                    return; // allow right-click
                }
                e.preventDefault();
            }
            document.addEventListener('contextmenu', onContextMenu);
            return () => document.removeEventListener('contextmenu', onContextMenu);
        }, []);

            // Block copy/cut/select/drag and keyboard clipboard shortcuts except on payment UI
            useEffect(() => {
                function allowTarget(target: EventTarget | null) {
                    const el = target as HTMLElement | null;
                    if (!el) return false;
                    return !!(el.closest && (el.closest('.pay-area') || el.closest('.paystack-button') || el.closest('[data-radix-dialog]') || el.closest('.radix-dialog')));
                }

                function onCopy(e: ClipboardEvent) { if (!allowTarget(e.target)) e.preventDefault(); }
                function onCut(e: ClipboardEvent) { if (!allowTarget(e.target)) e.preventDefault(); }
                function onSelectStart(e: Event) { if (!allowTarget(e.target)) e.preventDefault(); }
                function onDragStart(e: DragEvent) { if (!allowTarget(e.target)) e.preventDefault(); }
                function onKeyDown(e: KeyboardEvent) {
                    if ((e.ctrlKey || e.metaKey) && ['c','x','a'].includes((e.key||'').toLowerCase())) {
                        if (!allowTarget(e.target)) { e.preventDefault(); e.stopPropagation(); return false; }
                    }
                }

                document.addEventListener('copy', onCopy as EventListener);
                document.addEventListener('cut', onCut as EventListener);
                document.addEventListener('selectstart', onSelectStart as EventListener);
                document.addEventListener('dragstart', onDragStart as EventListener);
                window.addEventListener('keydown', onKeyDown, true);

                return () => {
                    document.removeEventListener('copy', onCopy as EventListener);
                    document.removeEventListener('cut', onCut as EventListener);
                    document.removeEventListener('selectstart', onSelectStart as EventListener);
                    document.removeEventListener('dragstart', onDragStart as EventListener);
                    window.removeEventListener('keydown', onKeyDown, true);
                };
            }, []);

    return (
        <main className="paper-body" style={{fontSize: 'var(--paper-font-size)'}}>
            <div className="fixed top-4 left-4 z-50 print-hidden flex items-center gap-4">
                    <Button asChild variant="secondary" className="shadow-lg">
                            <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
                            </Link>
                    </Button>
            </div>
                        {/* Payment-required modal shown when user attempts to print without paying */}
                        <Dialog open={showPrintModal} onOpenChange={(open) => setShowPrintModal(open)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Payment Required</DialogTitle>
                                    <DialogDescription>
                                        Printing this document requires payment. Please pay to enable printing. Once payment completes, printing will proceed automatically.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 flex gap-4 justify-end">
                                    <Button variant="outline" onClick={() => setShowPrintModal(false)}>Cancel</Button>
                                    <PayWithPaystackButton />
                                </div>
                            </DialogContent>
                        </Dialog>
            <div>
                <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><p>Loading paper details...</p></div>}>
                        <PaperContent />
                </Suspense>
            </div>
        </main>
    );
}
