import type { ParseResumeOutput } from '@/ai/flows/resume-parser';
import type { SkillGapAnalyzerOutput } from '@/ai/flows/skill-gap-analyzer';
import type { RecommendResourcesOutput } from '@/ai/flows/resource-recommender';

export type ResumeData = ParseResumeOutput;

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

export type SkillGapData = SkillGapAnalyzerOutput;
export type ResourceData = RecommendResourcesOutput;

export interface AnalysisData {
  skillGap: SkillGapData;
  resources: ResourceData;
}
