// src/ai/flows/job-matcher.ts
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

const JobMatcherInputSchema = z.object({
  resumeData: z.string().describe('The parsed data from the user\u2019s resume.'),
  jobListings: z.array(z.string()).describe('A list of job listings scraped from the web.'),
});
export type JobMatcherInput = z.infer<typeof JobMatcherInputSchema>;

const JobMatcherOutputSchema = z.object({
  relevantJobs: z
    .array(z.string())
    .describe('A list of job listings that are relevant to the user\u2019s resume.'),
});
export type JobMatcherOutput = z.infer<typeof JobMatcherOutputSchema>;

export async function jobMatcher(input: JobMatcherInput): Promise<JobMatcherOutput> {
  return jobMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMatcherPrompt',
  input: {schema: JobMatcherInputSchema},
  output: {schema: JobMatcherOutputSchema},
  prompt: `You are an AI job matching expert. Compare the provided resume data with the list of job listings and identify the jobs that are most relevant to the user's skills and experience.\

Resume Data: {{{resumeData}}}
Job Listings: {{#each jobListings}}{{{this}}}\n{{/each}}

Based on the resume data, identify the jobs that match the candidate's experience and skills. Return only a list of the relevant job listings.
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
