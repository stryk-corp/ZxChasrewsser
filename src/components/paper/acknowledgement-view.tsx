
'use client';

import { PaperPage } from './paper-page';
import { Skeleton } from '@/components/ui/skeleton';

interface AcknowledgementViewProps {
  acknowledgement: string;
  authorName: string;
}

export function AcknowledgementView({ acknowledgement, authorName }: AcknowledgementViewProps) {
  const content = (
      <div className="text-sm">
          <h1 className="text-base text-center mb-10 font-normal tracking-[5px] uppercase" style={{ fontFamily: 'var(--paper-font-heading)' }}>Acknowledgments</h1>
          
          {acknowledgement ? (
            <div className='space-y-4 text-justify' style={{lineHeight: 'var(--paper-line-height)'}}>
            {acknowledgement.split(/(?:\r\n|\r|\n){2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          <div className="mt-10 text-right italic">
              <p>{authorName}</p>
          </div>
      </div>
  );

  return (
    <PaperPage pageNumber={3}>
      {content}
    </PaperPage>
  );
}

    