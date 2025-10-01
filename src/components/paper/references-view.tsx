
'use client';

import { PaperPage } from './paper-page';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferencesViewProps {
  references: string[];
  pageNumber: number;
  hasBorder?: boolean;
}

export function ReferencesView({ references, pageNumber, hasBorder }: ReferencesViewProps) {
  const content = (
    <div>
      <h1 className="text-3xl text-center mb-10 font-bold border-b-[3pt] border-double pb-2.5" style={{fontFamily: 'var(--paper-font-heading)', color: 'var(--paper-h1-color)'}}>
        REFERENCES
      </h1>
      {references.length > 0 ? (
        <div className="space-y-4 text-sm">
          {references.map((ref, index) => (
            <p key={index}>{ref}</p>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <PaperPage pageNumber={pageNumber} hasBorder={hasBorder}>
      {content}
    </PaperPage>
  );
}

    