'use client';

import { useState } from 'react';
import type { Job, ResumeData } from '@/lib/types';
import ResumeSummary from './resume-summary';
import JobMatches from './job-matches';
import SkillGapAnalysisDialog from './skill-gap-analysis-dialog';

interface DashboardProps {
  resumeData: ResumeData;
}

export default function Dashboard({ resumeData }: DashboardProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 xl:col-span-3">
        <ResumeSummary resumeData={resumeData} />
      </div>
      <div className="lg:col-span-8 xl:col-span-9">
        <JobMatches resumeData={resumeData} onAnalyzeJob={setSelectedJob} />
      </div>
      {selectedJob && (
         <SkillGapAnalysisDialog
            job={selectedJob}
            resumeData={resumeData}
            open={!!selectedJob}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedJob(null);
              }
            }}
         />
      )}
    </div>
  );
}
