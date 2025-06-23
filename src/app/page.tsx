'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app/header';
import ResumeUpload from '@/components/app/resume-upload';
import Dashboard from '@/components/app/dashboard';
import { Toaster } from '@/components/ui/toaster';
import { ResumeData } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeParsed = (data: ResumeData) => {
    setResumeData(data);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResumeData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader onReset={handleReset} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your resume...</p>
          </div>
        ) : resumeData ? (
          <Dashboard resumeData={resumeData} />
        ) : (
          <ResumeUpload onResumeParsed={handleResumeParsed} setIsLoading={setIsLoading} />
        )}
      </main>
      <Toaster />
    </div>
  );
}
