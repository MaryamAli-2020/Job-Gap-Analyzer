import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumeData } from '@/lib/types';
import { User, Mail, Phone, Briefcase, GraduationCap, Star } from 'lucide-react';

interface ResumeSummaryProps {
  resumeData: ResumeData;
}

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {children}
    </div>
);

export default function ResumeSummary({ resumeData }: ResumeSummaryProps) {
  const { name, email, phone, skills, experience, education } = resumeData;

  return (
    <Card className="sticky top-20 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
            <User className="h-6 w-6 text-primary"/>
            {name || 'Candidate Profile'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground space-y-2">
            {email && <p className="flex items-center gap-2"><Mail className="h-4 w-4"/> {email}</p>}
            {phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {phone}</p>}
        </div>

        <Separator />

        {skills?.length > 0 && (
            <Section icon={<Star className="h-5 w-5 text-primary"/>} title="Top Skills">
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </Section>
        )}
        
        <Separator />

        {experience?.length > 0 && (
            <Section icon={<Briefcase className="h-5 w-5 text-primary"/>} title="Experience">
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {experience.map((exp, index) => <li key={index}>{exp}</li>)}
                </ul>
            </Section>
        )}
        
        {education?.length > 0 && (
            <>
            <Separator />
            <Section icon={<GraduationCap className="h-5 w-5 text-primary"/>} title="Education">
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {education.map((edu, index) => <li key={index}>{edu}</li>)}
                </ul>
            </Section>
            </>
        )}
      </CardContent>
    </Card>
  );
}
