'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getJobMatches } from '@/lib/actions';
import type { Job, ResumeData } from '@/lib/types';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobMatchesProps {
  resumeData: ResumeData;
  onAnalyzeJob: (job: Job) => void;
}

export default function JobMatches({ resumeData, onAnalyzeJob }: JobMatchesProps) {
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMatches = useCallback(async () => {
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
  }, [resumeData, toast]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              Recommended Job Openings
            </CardTitle>
            <CardDescription>
              Based on your resume, we found these opportunities for you.
            </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchMatches} disabled={isLoading}>
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh job recommendations</span>
        </Button>
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
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
    </CardContent>
    <CardFooter className="flex justify-end gap-2">
        <Button onClick={() => onAnalyzeJob(job)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Analyze Skill Gap</Button>
    </CardFooter>
  </Card>
);

const JobCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4 rounded-md" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md mt-2" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-10 w-36 rounded-md" />
        </CardFooter>
    </Card>
)
