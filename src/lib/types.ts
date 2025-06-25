import type { ParseResumeOutput } from '@/ai/flows/resume-parser';
import type { AnalyzeGapsAndRecommendResourcesOutput } from '@/ai/flows/skill-gap-analyzer';

export type ResumeData = ParseResumeOutput;

export interface Job {
  id: string;
  title: string;
  description: string;
  url: string;
}

export type AnalysisData = AnalyzeGapsAndRecommendResourcesOutput;
