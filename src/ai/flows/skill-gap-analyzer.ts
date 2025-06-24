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
  prompt: `You are an expert career advisor. Your task is to perform a detailed skill gap analysis by comparing the user's resume against a target job description.

  **Resume Content:**
  {{{resumeText}}}

  **Target Job Description:**
  {{{jobDescription}}}

  **Analysis Instructions:**
  1.  **Matched Skills**: Identify skills that are explicitly mentioned in both the resume and the job description. Be liberal and consider synonyms or related technologies (e.g., "React" in resume matches "React.js" in job description).
  2.  **Missing Skills**: Identify key skills required by the job description that are NOT found anywhere in the resume. Be strict and focus on the explicit requirements of the job.
  3.  **Suggested Skills**: Analyze the user's experience in the resume and identify relevant skills that they likely possess but haven't listed explicitly. These should be skills that would strengthen their application for this specific job. For example, if they list "React" and "Node.js", you might suggest they highlight "full-stack development".
  4.  **Gap Analysis Summary**: Write a brief, encouraging summary of the analysis. Highlight the user's strengths and provide actionable advice on how to bridge the skill gaps for this specific role.

  Please provide the output in the specified JSON format.
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
