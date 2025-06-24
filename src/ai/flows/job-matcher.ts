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
  prompt: `You are an AI job matching expert. Your goal is to find and recommend relevant jobs for a user based on their resume.

First, analyze the user's resume to understand their key skills, experience, and potential job titles.
Resume Data:
{{{resumeData}}}

Next, use the 'searchJobs' tool to find job listings. Construct a search query based on the most prominent skills and roles from the resume. For example, if the resume indicates skills in "React" and "TypeScript", a good query would be "React TypeScript developer".

Finally, from the jobs returned by the tool, identify the top 5 most relevant jobs that best match the candidate's experience and skills. Return an array of these 5 job objects in the \`matchedJobs\` field. If you cannot find 5 relevant jobs, return as many as you can find. Do not make up jobs; only use the ones from the tool.
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
