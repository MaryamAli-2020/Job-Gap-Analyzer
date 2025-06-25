'use server';

import { parseResume } from '@/ai/flows/resume-parser';
import { jobMatcher } from '@/ai/flows/job-matcher';
import { analyzeGapsAndRecommendResources } from '@/ai/flows/skill-gap-analyzer';
import type { ResumeData, Job, AnalysisData } from '@/lib/types';

export async function handleResumeUpload(resumeDataUri: string): Promise<ResumeData> {
  try {
    if (!resumeDataUri) throw new Error('Resume data URI is required.');
    
    const parsedData = await parseResume({ resumeDataUri });
    return parsedData;
  } catch (error) {
    console.error('Error in handleResumeUpload:', error);
    throw new Error('Failed to parse resume.');
  }
}

export async function getJobMatches(resumeData: ResumeData): Promise<Job[]> {
  try {
    const resumeString = JSON.stringify(resumeData);

    const { matchedJobs } = await jobMatcher({
      resumeData: resumeString,
    });
    
    return matchedJobs || [];
  } catch (error) {
    console.error('Error in getJobMatches:', error);
    throw new Error('Failed to match jobs.');
  }
}

export async function getSkillGapAnalysisAndResources(
  resumeText: string,
  jobDescription: string,
  desiredJob: string
): Promise<AnalysisData> {
  try {
    const analysisAndResources = await analyzeGapsAndRecommendResources({
      resumeText,
      jobDescription,
      desiredJob,
    });

    return analysisAndResources;
  } catch (error) {
    console.error('Error in getSkillGapAnalysisAndResources:', error);
    throw new Error('Failed to analyze skill gap and recommend resources.');
  }
}
