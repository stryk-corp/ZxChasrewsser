
'use client';

import { PaperPage } from './paper-page';
import { Skeleton } from '@/components/ui/skeleton';

interface DedicationViewProps {
  dedication: string;
  hasBorder?: boolean;
}

export function DedicationView({ dedication, hasBorder }: DedicationViewProps) {
  return (
    <PaperPage pageNumber={2} hasBorder={hasBorder}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 text-center">
        {dedication ? (
          <div className="text-lg italic" style={{lineHeight: '2'}}>
            {dedication.split(/(?:\r\n|\r|\n){2,}/).map((para, i) => <p key={i} className="mb-8">{para}</p>)}
          </div>
        ) : (
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        )}
      </div>
    </PaperPage>
  );
}

    