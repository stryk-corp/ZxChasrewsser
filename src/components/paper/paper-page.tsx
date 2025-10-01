
import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface PaperPageProps {
  children: ReactNode;
  className?: string;
  pageNumber?: number;
  hasBorder?: boolean;
  style?: CSSProperties;
}

export function PaperPage({ children, className, pageNumber, hasBorder, style }: PaperPageProps) {
  const isCoverPage = pageNumber === 1;

  return (
    <div 
        className={cn("w-[210mm] min-h-[297mm] bg-white p-[2.5cm] mx-auto my-8 shadow-xl relative print:shadow-none print:my-0", className)}
        style={{ 
            color: 'var(--paper-text-color)',
            fontFamily: 'var(--paper-font-body)',
            lineHeight: 'var(--paper-line-height)',
            textAlign: isCoverPage ? 'left' : 'justify',
            border: hasBorder ? `8px ${'var(--paper-border-style)'} var(--paper-border-color)` : 'none',
            breakAfter: 'page',
            ...style,
        }}
    >
      {children}
      {pageNumber && pageNumber > 1 && (
        <div 
            className="absolute bottom-[1cm] left-[2.5cm] right-[2.5cm] text-xs font-sans flex"
            style={{ 
                justifyContent: 'var(--paper-page-number-align)',
            }}
        >
            <span>{pageNumber}</span>
        </div>
      )}
    </div>
  );
}
