
import type { PaperDetails } from '@/components/wizard';
import { PaperPage } from './paper-page';

type CoverPageViewProps = PaperDetails & { hasBorder?: boolean };

export function CoverPageView(details: CoverPageViewProps) {
  return (
    <PaperPage hasBorder={details.hasBorder}>
        <div className="flex flex-col h-full" style={{fontFamily: 'var(--paper-font-heading)'}}>
            <div className="text-left">
                <h1 className="text-lg font-bold uppercase">{details.universityName.toUpperCase()}</h1>
                <h2 className="text-base font-bold uppercase mt-4">{details.faculty.toUpperCase()}</h2>
                <h3 className="text-sm font-bold uppercase mt-4 mb-10">{details.department.toUpperCase()}</h3>
            </div>
            
            <div className='my-auto flex flex-col items-center text-center w-full'>
                <div className='mb-16'>
                    <p className="italic leading-relaxed text-base">AN ASSIGNMENT TO BE SUBMITTED IN PARTIAL FULFILMENT FOR THE COURSE</p>
                    <p className="italic mt-8 text-sm">{details.courseCode.toUpperCase()}</p>
                    <p className="italic text-sm">({details.courseTitle.toUpperCase()})</p>
                </div>
                
                <div className='mb-16'>
                    <p className="font-bold mb-4">BY:</p>
                    <div className="leading-relaxed">
                        <p><strong>{details.studentName.toUpperCase()}</strong></p>
                        <p>{details.studentId.toUpperCase()}</p>
                    </div>
                </div>

                <div className="leading-relaxed mb-16">
                    <p><strong>LECTURER:</strong></p>
                    <p>{details.lecturerName.toUpperCase()}</p>
                </div>
                
                <p className="font-bold mt-8">{details.date}</p>
            </div>
        </div>
    </PaperPage>
  );
}
