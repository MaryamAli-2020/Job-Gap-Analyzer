'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getJobMatches } from '@/lib/actions';
import type { Job, ResumeData } from '@/lib/types';
import { MapPin, Building, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobMatchesProps {
  resumeData: ResumeData;
  onAnalyzeJob: (job: Job) => void;
}

export default function JobMatches({ resumeData, onAnalyzeJob }: JobMatchesProps) {
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const result = await getJobMatches(resumeData);
        setMatchedJobs(result);
      } catch (error) {
        console.error('Error matching jobs:', error);
        toast({
          variant: 'destructive',
          title: 'Could not fetch job matches.',
          description: 'There was an error finding relevant jobs. Please try again later.',
        });
        setMatchedJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [resumeData, toast]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          Recommended Job Openings
        </CardTitle>
        <CardDescription>
          Based on your resume, we found these opportunities for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)
          : matchedJobs.map((job) => (
              <JobCard key={job.id} job={job} onAnalyzeJob={onAnalyzeJob} />
            ))}
        { !isLoading && matchedJobs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                <p>No job matches found based on your resume.</p>
                <p>Try updating your resume with more relevant skills.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

const JobCard = ({ job, onAnalyzeJob }: { job: Job, onAnalyzeJob: (job: Job) => void }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{job.title}</CardTitle>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-1">
        <p className="flex items-center gap-1.5"><Building className="h-4 w-4" /> {job.company}</p>
        <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</p>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
    </CardContent>
    <CardFooter className="flex justify-end">
        <Button onClick={() => onAnalyzeJob(job)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Analyze Skill Gap</Button>
    </CardFooter>
  </Card>
);

const JobCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md mt-2" />
        </CardContent>
        <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-36 rounded-md" />
        </CardFooter>
    </Card>
)
