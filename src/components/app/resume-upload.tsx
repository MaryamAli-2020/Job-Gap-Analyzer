'use client';

import { useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleResumeUpload } from '@/lib/actions';
import type { ResumeData } from '@/lib/types';

interface ResumeUploadProps {
  onResumeParsed: (data: ResumeData) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function ResumeUpload({ onResumeParsed, setIsLoading }: ResumeUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB.',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await handleResumeUpload(resumeDataUri);
      onResumeParsed(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Parsing Resume',
        description: 'Could not process the resume. Please try another file.',
      });
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null);
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Upload Your Resume</CardTitle>
          <CardDescription>Get started by uploading your resume in PDF or DOCX format.</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
          >
            <div className="flex flex-col items-center gap-4">
                <UploadCloud className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Drag & drop your file here or click to browse</p>
                <Button asChild>
                    <label htmlFor="resume-upload">Browse Files</label>
                </Button>
                <Input id="resume-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
