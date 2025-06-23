'use server';

/**
 * @fileOverview An AI agent that analyzes skill gaps between a user's resume and target job descriptions.
 *
 * - analyzeSkillGaps - A function that orchestrates the skill gap analysis process.
 * - SkillGapAnalyzerInput - The input type for the analyzeSkillGaps function.
 * - SkillGapAnalyzerOutput - The return type for the analyzeSkillGaps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalyzerInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content extracted from the user\'s resume.'),
  jobDescription: z
    .string()
    .describe('The text content of the target job description.'),
});
export type SkillGapAnalyzerInput = z.infer<typeof SkillGapAnalyzerInputSchema>;

const SkillGapAnalyzerOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe(
      'A list of skills present in the job description but not found in the resume.'
    ),
  matchedSkills: z
    .array(z.string())
    .describe(
      'A list of skills present in both the job description and the resume.'
    ),
  suggestedSkills: z
    .array(z.string())
    .describe(
      'A list of possible skills that the user may have but was not extracted.'
    ),
  gapAnalysisSummary: z
    .string()
    .describe(
      'A concise summary of the skill gaps and potential areas for improvement.'
    ),
});
export type SkillGapAnalyzerOutput = z.infer<typeof SkillGapAnalyzerOutputSchema>;

export async function analyzeSkillGaps(
  input: SkillGapAnalyzerInput
): Promise<SkillGapAnalyzerOutput> {
  return skillGapAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalyzerPrompt',
  input: {schema: SkillGapAnalyzerInputSchema},
  output: {schema: SkillGapAnalyzerOutputSchema},
  prompt: `You are a career advisor that can analyze the differences between a user's skills and the requirements of their target jobs and pinpoint the skill gaps.

  Analyze the resume and job description to find the missing skills, matched skills and suggest additional skills.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}

  Output the missingSkills, matchedSkills, suggestedSkills, and gapAnalysisSummary fields.
  Use the job description as the source of truth.
  Consider synonyms for skills.
  For suggestedSkills, make sure the skills can be extracted from the resume.
  Do not include skills from the same domain in the missingSkills and suggestedSkills.
  Be strict with the job description to extract the missingSkills.
`,
});

const skillGapAnalyzerFlow = ai.defineFlow(
  {
    name: 'skillGapAnalyzerFlow',
    inputSchema: SkillGapAnalyzerInputSchema,
    outputSchema: SkillGapAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
