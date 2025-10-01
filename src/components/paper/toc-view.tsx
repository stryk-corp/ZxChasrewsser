
import { PaperPage } from './paper-page';
import type { TOCEntry as TOCEntryType } from '@/ai/flows/ai-powered-chapters';
import { Skeleton } from '@/components/ui/skeleton';

interface TOCEntryProps {
  level: number;
  text: string;
  pageNumber?: number;
}

const TOCEntry = ({ level, text, pageNumber }: TOCEntryProps) => {
  const styles: { [key: number]: string } = {
    1: 'font-bold text-base mt-3 mb-1.5',
    2: 'text-sm ml-6 mb-1',
    3: 'text-xs ml-12'
  };

  return (
    <div
      className={`toc-level-${level} ${styles[level] ?? styles[1]} flex justify-between items-end`}
    >
      <span className="pr-2">{text}</span>
      <span className="flex-1 border-b border-dotted border-gray-400"></span>
      <span className="pl-2">{pageNumber}</span>
    </div>
  );
};


interface TableOfContentsViewProps {
  toc: TOCEntryType[];
  pageNumber: number;
  hasBorder?: boolean;
  chaptersStartPage: number;
  conclusionPage: number;
  referencesPage: number;
}

export function TableOfContentsView({ toc, pageNumber, hasBorder, chaptersStartPage, conclusionPage, referencesPage }: TableOfContentsViewProps) {
  const hasContent = toc && toc.length > 0;

  // Estimate max entries per page (adjust as needed for your layout)
  const MAX_TOC_ENTRIES_PER_PAGE = 20;

  // Flatten TOC for pagination
  function flattenTOC(entries: TOCEntryType[]): TOCEntryType[] {
    let flat: TOCEntryType[] = [];
    for (const entry of entries) {
      flat.push(entry);
      if (entry.children && entry.children.length > 0) {
        flat = flat.concat(flattenTOC(entry.children));
      }
    }
    return flat;
  }

  const flatTOC = flattenTOC(toc);
  const tocPages: TOCEntryType[][] = [];
  for (let i = 0; i < flatTOC.length; i += MAX_TOC_ENTRIES_PER_PAGE) {
    tocPages.push(flatTOC.slice(i, i + MAX_TOC_ENTRIES_PER_PAGE));
  }

  // First page border is default, overflow pages get distinct border
  const overflowBorderStyle = {
    border: '4px dashed #FF9800',
    boxShadow: '0 0 0 4px #FF9800 inset',
  };

  return (
    <>
      {tocPages.map((tocEntries, idx) => (
        <PaperPage
          key={idx}
          pageNumber={pageNumber + idx}
          hasBorder={hasBorder}
          style={idx === 0 ? {} : overflowBorderStyle}
        >
          <style>{`
            .paper-body h1.toc-title {
                font-size: 28pt;
                text-align: center;
                margin-bottom: 1.5cm;
                font-weight: bold;
                color: var(--paper-h1-color);
                border-bottom: double 3pt var(--paper-h1-color);
                padding-bottom: 10pt;
            }
            .toc-level-1 {
                font-weight: bold;
                font-size: 14pt;
                margin-top: 12pt;
                margin-bottom: 6pt;
            }
            .toc-level-2 {
                font-size: 12pt;
                margin-left: 1cm;
                margin-bottom: 4pt;
            }
            .toc-level-3 {
                font-size: 11pt;
                margin-left: 2cm;
                margin-bottom: 3pt;
            }
          `}</style>
          <h1 className="toc-title">
            TABLE OF CONTENTS
          </h1>

          {!hasContent ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 ml-4" />
              <Skeleton className="h-4 w-1/2 ml-4" />
              <Skeleton className="h-6 w-2/3 mt-4" />
              <Skeleton className="h-4 w-1/2 ml-4" />
            </div>
          ) : (
            <>
              {idx === 0 && (
                <>
                  <TOCEntry level={1} text="DEDICATION" pageNumber={2} />
                  <TOCEntry level={1} text="ACKNOWLEDGEMENT" pageNumber={3} />
                  <div className="h-4" />
                </>
              )}
              {tocEntries.map((entry, entryIdx) => (
                <TOCEntry key={entryIdx} level={entry.level} text={entry.text} pageNumber={chaptersStartPage + entryIdx} />
              ))}
              {idx === tocPages.length - 1 && (
                <>
                  <div className="h-4" />
                  <TOCEntry level={1} text="CONCLUSION" pageNumber={conclusionPage} />
                  <TOCEntry level={1} text="REFERENCES" pageNumber={referencesPage} />
                </>
              )}
            </>
          )}
        </PaperPage>
      ))}
    </>
  );
}
