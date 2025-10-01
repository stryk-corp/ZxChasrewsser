'use client';

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Step1 } from "@/components/wizard/step1";
import { Step2 } from "@/components/wizard/step2";
import { Step3 } from "@/components/wizard/step3";
import { Step4 } from "@/components/wizard/step4";
import { Step5 } from "@/components/wizard/step5";


import { GraduationCap, FileText, Bot, PenSquare, Paintbrush, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  universityName: z.string().min(1, "University name is required."),
  faculty: z.string().min(1, "Faculty is required."),
  department: z.string().min(1, "Department is required."),
  courseCode: z.string().min(1, "Course code is required."),
  courseTitle: z.string().min(1, "Course title is required."),
  studentName: z.string().min(1, "Your name is required."),
  studentId: z.string().min(1, "Registration number is required."),
  lecturerName: z.string().min(1, "Lecturer's name is required."),
  date: z.string().min(1, "Date is required."),
  paperTopic: z.string().min(5, "Paper topic is required."),
  paperHighlights: z.string().min(10, "Paper highlights are required."),
  numberOfChapters: z.coerce.number().min(1, "Please select the number of chapters.").max(4, "You can generate up to 4 chapters."),
  ackParties: z.string().min(5, "Parties to acknowledge are required."),
  pageBorder: z.string().min(1, "Please select a border style."),
  pageBorderScope: z.string().min(1, "Please select border scope."),
  pageNumberAlign: z.string().min(1, "Please select page number alignment."),
  includeTOC: z.boolean(),
  fontBody: z.string().min(1, "Please select a body font."),
  fontHeading: z.string().min(1, "Please select a heading font."),
  fontSize: z.coerce.number().min(10).max(18),
  lineSpacing: z.coerce.number().min(1.2).max(2.5),
});

export type PaperDetails = z.infer<typeof formSchema> & { userImages?: any[] };


const editorSections = [
    { id: "details", name: "Cover Page", component: Step1, icon: FileText },
    { id: "content", name: "Paper Content", component: Step2, icon: PenSquare },
    { id: "chapters", name: "Chapters", component: Step3, icon: Bot },
    { id: "ack", name: "Acknowledgements", component: Step4, icon: Bot },
    { id: "style", name: "Typography & Style", component: Step5, icon: Paintbrush },
];

function EditorHeader({ onGenerate }: { onGenerate: () => void }) {
    const { isMobile } = useSidebar();
    return (
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-4">
                {isMobile && <SidebarTrigger />}
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <h1 className="text-lg font-semibold text-primary">Stryk's ScholarVerse</h1>
                </div>
            </div>
            <Button onClick={onGenerate} size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Paper
            </Button>
        </header>
    )
}

export function Wizard() {
  const [activeSection, setActiveSection] = useState(editorSections[0].id);
  const router = useRouter();

  const methods = useForm<Omit<PaperDetails, 'userImages'>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityName: "University of Excellence",
      faculty: "Faculty of Science",
      department: "Department of Computer Science",
      courseCode: "CS-401",
      courseTitle: "Advanced AI Studies",
      studentName: "John Doe",
      studentId: "U/2025/12345",
      lecturerName: "Prof. Ada Lovelace",
      date: "August, 2025",
      paperTopic: "The impact of large language models on academic research",
      paperHighlights: "This paper explores the benefits and potential pitfalls of using LLMs in research, including plagiarism concerns and opportunities for novel discovery.",
      numberOfChapters: 3,
      ackParties: "My advisor Dr. Smith, the National Science Foundation for funding, and my family for their support.",
      pageBorder: 'double',
      pageBorderScope: 'all',
      pageNumberAlign: 'right',
      includeTOC: true,
      fontBody: 'Literata',
      fontHeading: 'Literata',
      fontSize: 12,
      lineSpacing: 1.75,
    }
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Omit<PaperDetails, 'userImages'>) => {
    const params = new URLSearchParams();
    for (const key in data) {
        const value = (data as any)[key];
        if (value !== undefined) {
            params.append(key, value.toString());
        }
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userImages');
    }

    router.push(`/paper?${params.toString()}`);
  };

  const CurrentSection = editorSections.find(s => s.id === activeSection)?.component;

  return (
    <FormProvider {...methods}>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader />
                <SidebarContent>
                    <SidebarMenu>
                        {editorSections.map((section) => (
                             <SidebarMenuItem key={section.id}>
                                <SidebarMenuButton
                                    onClick={() => setActiveSection(section.id)}
                                    isActive={activeSection === section.id}
                                    tooltip={section.name}
                                >
                                    <section.icon />
                                    <span>{section.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <EditorHeader onGenerate={handleSubmit(onSubmit)} />
                <ScrollArea className="h-[calc(100vh-60px)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-8">
                        {CurrentSection && <CurrentSection />}
                    </form>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    </FormProvider>
  );
}
