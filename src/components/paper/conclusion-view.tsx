
'use client';

import { PaperPage } from './paper-page';
import { Skeleton } from '@/components/ui/skeleton';
import parse from 'html-react-parser';

interface ConclusionViewProps {
  conclusion: string;
  pageNumber: number;
}

const H1 = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-3xl text-center mb-8 font-bold border-b-[3pt] border-double pb-2.5" style={{ fontFamily: 'var(--paper-font-heading)', color: 'var(--paper-h1-color)' }}>{children}</h1>
);

export function ConclusionView({ conclusion, pageNumber }: ConclusionViewProps) {
  const content = (
    <div>
      <H1>Conclusion</H1>
      {conclusion ? (
        <div className="space-y-4">
          {typeof conclusion === 'string' ? parse(conclusion) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}
    </div>
  );

  return (
    <PaperPage pageNumber={pageNumber}>
      {content}
    </PaperPage>
  );
}
