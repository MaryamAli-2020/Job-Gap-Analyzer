'use server';

import { parseResume } from '@/ai/flows/resume-parser';
import { jobMatcher } from '@/ai/flows/job-matcher';
import { analyzeSkillGaps } from '@/ai/flows/skill-gap-analyzer';
import { recommendResources } from '@/ai/flows/resource-recommender';
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

export async function getJobMatches(resumeData: ResumeData, jobListings: Job[]): Promise<Job[]> {
  try {
    const resumeString = JSON.stringify(resumeData);
    const listingsAsStrings = jobListings.map(job => 
      `Title: ${job.title}, Company: ${job.company}, Description: ${job.description}`
    );

    const result = await jobMatcher({
      resumeData: resumeString,
      jobListings: listingsAsStrings,
    });

    // Filter original jobs based on titles from relevant job listings
    const relevantJobTitles = new Set(
      result.relevantJobs.map(jobString => {
        const match = jobString.match(/Title: (.*?)(, Company|, Description|$)/);
        return match ? match[1].trim() : null;
      }).filter(Boolean)
    );
    
    return jobListings.filter(job => relevantJobTitles.has(job.title));
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
    const skillGapPromise = analyzeSkillGaps({ resumeText, jobDescription });
    
    const skillGap = await skillGapPromise;
    
    const resourcesPromise = recommendResources({
      skillGaps: skillGap.gapAnalysisSummary,
      desiredJob: desiredJob,
    });

    const resources = await resourcesPromise;

    return { skillGap, resources };

  } catch (error) {
    console.error('Error in getSkillGapAnalysisAndResources:', error);
    throw new Error('Failed to analyze skill gap and recommend resources.');
  }
}
