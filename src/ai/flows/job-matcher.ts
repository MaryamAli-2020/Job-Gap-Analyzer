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
  prompt: `You are a persistent AI job matching expert. Your primary goal is to **always** find and recommend relevant jobs for a user, no matter how sparse their resume is. It is critical that you do not give up and return an empty list.

**Analyze the user's resume:**
Resume Data:
{{{resumeData}}}

**Your Task:**
1.  **Create a Search Query:** Based on the resume, create a concise job search query.
    *   **Ideal Query:** Combine the most relevant job title with 1-2 key skills (e.g., "Senior Software Engineer React").
    *   **If no job title:** Use the top 2-3 skills (e.g., "Project Management Agile").
    *   **If skills are sparse:** Use the most recent job title from the experience section.
    *   **If the resume is extremely sparse or lacks detail:** Do not fail. Create a broad, generic query for common entry-level professional roles like "Project Coordinator", "Junior Analyst", or "Customer Support Representative". You **MUST** generate a query.

2.  **Find Jobs and Be Persistent:**
    *   Use the 'searchJobs' tool with your generated query.
    *   Your goal is to return **at least 5 jobs**.
    *   If the tool returns fewer than 5 jobs (or zero), you **MUST** try again with a broader query. For example, if a query for "Senior AI/ML Engineer with Rust" yields no results, broaden it to "Backend Software Engineer", and if that still fails, broaden it to just "Software Developer". Continue broadening your query until you have at least 5 job listings.

3.  **Select and Return Jobs:**
    *   Once you have at least 5 jobs, select the most relevant ones.
    *   If you have more than 5, return the top 5. If you have exactly 5, return all of them.
    *   **Do not make up jobs.** Only return jobs provided by the \`searchJobs\` tool.
    *   Return the final list in the \`matchedJobs\` field. Failure to return jobs is not an option.
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
