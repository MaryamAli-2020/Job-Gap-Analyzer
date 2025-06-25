'use server';
/**
 * @fileOverview A job matching AI agent.
 *
 * - jobMatcher - A function that handles the job matching process.
 * - JobMatcherInput - The input type for the jobMatcher function.
 * - JobMatcherOutput - The return type for the jobMatcher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchJobsTool } from '../tools/job-search';

const JobMatcherInputSchema = z.object({
  resumeData: z.string().describe('The parsed data from the user\u2019s resume in JSON format.'),
});
export type JobMatcherInput = z.infer<typeof JobMatcherInputSchema>;

const JobMatcherOutputSchema = z.object({
  matchedJobs: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    url: z.string(),
  })).describe("An array of job objects from the job listings that are most relevant to the user's resume."),
});
export type JobMatcherOutput = z.infer<typeof JobMatcherOutputSchema>;

export async function jobMatcher(input: JobMatcherInput): Promise<JobMatcherOutput> {
  return jobMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatcherPrompt',
  input: {schema: JobMatcherInputSchema},
  output: {schema: JobMatcherOutputSchema},
  tools: [searchJobsTool],
  prompt: `You are an AI job matching expert. Your goal is to find and recommend relevant jobs for a user based on their resume, even if the resume information is sparse.

**Analyze the user's resume:**
Resume Data:
{{{resumeData}}}

**Your Task:**
1.  **Create a Search Query:** Based on the resume, create a concise job search query.
    *   **Ideal Query:** Combine the most relevant job title with 1-2 key skills (e.g., "Senior Software Engineer React").
    *   **If no job title:** Use the top 2-3 skills (e.g., "Project Management Agile").
    *   **If skills are sparse:** Use the most recent job title from the experience section.
    *   **If all else fails:** Make an educated guess based on the overall content of the resume. The query should be broad enough to get results.

2.  **Find Jobs:** Use the 'searchJobs' tool with your generated query to get a list of job listings.

3.  **Select and Return Jobs:** Review the jobs returned by the tool. Your goal is to return **at least 5 jobs** if possible. Be flexible in your matching. The jobs don't need to be a perfect match, but should be reasonably relevant.
    *   If the tool returns more than 5 jobs, select the top 5 that are most relevant.
    *   If the tool returns 5 or fewer jobs, return all of them.
    *   **Do not make up jobs.** Only return jobs provided by the searchJobs tool.
    *   Return the results in the matchedJobs field.
`,
});

const jobMatcherFlow = ai.defineFlow(
  {
    name: 'jobMatcherFlow',
    inputSchema: JobMatcherInputSchema,
    outputSchema: JobMatcherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
