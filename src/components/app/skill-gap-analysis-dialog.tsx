'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getSkillGapAnalysisAndResources } from '@/lib/actions';
import type { Job, ResumeData, AnalysisData } from '@/lib/types';
import { Loader2, CheckCircle2, XCircle, Lightbulb, GraduationCap, BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface SkillGapAnalysisDialogProps {
  job: Job | null;
  resumeData: ResumeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SkillGapAnalysisDialog({
  job,
  resumeData,
  open,
  onOpenChange,
}: SkillGapAnalysisDialogProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (job && open) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setAnalysisData(null);
        try {
          const resumeText =
            `Skills: ${resumeData.skills.join(', ')}. ` +
            `Experience: ${resumeData.experience.join(' ')}. ` +
            `Education: ${resumeData.education.join(' ')}.`;

          const data = await getSkillGapAnalysisAndResources(
            resumeText,
            job.description,
            job.title
          );
          setAnalysisData(data);
        } catch (error) {
          console.error('Failed to get skill gap analysis:', error);
          // Handle error display if necessary
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [job, open, resumeData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Analyzing skill gap...</p>
        </div>
      );
    }
    if (!analysisData) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-muted-foreground">Could not load analysis. Please try again.</p>
        </div>
      );
    }

    const { skillGap, resources } = analysisData;
    
    return (
        <ScrollArea className="h-[65vh] pr-4">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{skillGap.gapAnalysisSummary}</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SkillCard icon={<CheckCircle2 className="text-green-500" />} title="Matched Skills" skills={skillGap.matchedSkills} variant="secondary" />
                    <SkillCard icon={<XCircle className="text-red-500" />} title="Missing Skills" skills={skillGap.missingSkills} variant="destructive" />
                </div>
                
                <SkillCard icon={<Lightbulb className="text-yellow-500" />} title="Suggested Skills to Highlight" skills={skillGap.suggestedSkills} variant="default" className="bg-yellow-100/50 dark:bg-yellow-900/20"/>
                
                <Separator />
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <BookOpen className="text-primary"/> Learning Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                        {resources.resources.map((resource, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <GraduationCap className="h-4 w-4 mt-1 shrink-0 text-primary"/>
                                <a href={resource.startsWith('http') ? resource : `https://www.google.com/search?q=${encodeURIComponent(resource)}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                                    {resource}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                </Card>

            </div>
        </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Skill Gap Analysis for <span className="text-primary">{job?.title}</span>
          </DialogTitle>
          <DialogDescription>Comparing your resume with the job requirements.</DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}


const SkillCard = ({ icon, title, skills, variant, className }: { icon: React.ReactNode, title: string, skills: string[], variant: "default" | "secondary" | "destructive" | "outline" | null | undefined, className?: string }) => (
    <Card className={className}>
        <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge key={index} variant={variant}>{skill}</Badge>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None identified.</p>
            )}
        </CardContent>
    </Card>
);
