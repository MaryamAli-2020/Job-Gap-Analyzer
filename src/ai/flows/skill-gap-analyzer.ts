'use server';

/**
 * @fileOverview An AI agent that analyzes skill gaps and recommends resources.
 *
 * - analyzeGapsAndRecommendResources - A function that orchestrates the skill gap analysis and resource recommendation process.
 * - AnalyzeGapsAndRecommendResourcesInput - The input type for the function.
 * - AnalyzeGapsAndRecommendResourcesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGapsAndRecommendResourcesInputSchema = z.object({
  resumeText: z
    .string()
    .describe("The text content extracted from the user's resume."),
  jobDescription: z
    .string()
    .describe('The text content of the target job description.'),
  desiredJob: z.string().describe('The job the user is targeting.'),
});
export type AnalyzeGapsAndRecommendResourcesInput = z.infer<typeof AnalyzeGapsAndRecommendResourcesInputSchema>;

const AnalyzeGapsAndRecommendResourcesOutputSchema = z.object({
  skillGap: z.object({
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
  }),
  resources: z.object({
    resources: z
      .array(z.string())
      .describe(
        'A list of learning resources (online courses, tutorials, articles) that can help the user bridge their skill gaps.'
      ),
  }),
});
export type AnalyzeGapsAndRecommendResourcesOutput = z.infer<typeof AnalyzeGapsAndRecommendResourcesOutputSchema>;

export async function analyzeGapsAndRecommendResources(
  input: AnalyzeGapsAndRecommendResourcesInput
): Promise<AnalyzeGapsAndRecommendResourcesOutput> {
  return analyzeGapsAndRecommendResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGapsAndRecommendResourcesPrompt',
  input: {schema: AnalyzeGapsAndRecommendResourcesInputSchema},
  output: {schema: AnalyzeGapsAndRecommendResourcesOutputSchema},
  prompt: `You are an expert career advisor. Your task is to perform a detailed skill gap analysis and then recommend learning resources.

  **Resume Content:**
  {{{resumeText}}}

  **Target Job Description:**
  {{{jobDescription}}}

  **Analysis & Recommendation Instructions:**

  **Part 1: Skill Gap Analysis**
  1.  **Matched Skills**: Identify skills that are explicitly mentioned in both the resume and the job description. Be liberal and consider synonyms or related technologies (e.g., "React" in resume matches "React.js" in job description).
  2.  **Missing Skills**: Identify key skills required by the job description that are NOT found anywhere in the resume. Be strict and focus on the explicit requirements of the job.
  3.  **Suggested Skills**: Analyze the user's experience in the resume and identify relevant skills that they likely possess but haven't listed explicitly. These should be skills that would strengthen their application for this specific job. For example, if they list "React" and "Node.js", you might suggest they highlight "full-stack development".
  4.  **Gap Analysis Summary**: Write a brief, encouraging summary of the analysis. Highlight the user's strengths and provide actionable advice on how to bridge the skill gaps for this specific role.

  **Part 2: Learning Resource Recommendations**
  Based on the **Missing Skills** you identified in Part 1, recommend a list of relevant learning resources (like specific online courses, tutorials, or articles) to help the user bridge these gaps for their desired job: **{{{desiredJob}}}**.

  Please provide the entire output in the specified JSON format, filling out both the 'skillGap' and 'resources' objects.
`,
});

const analyzeGapsAndRecommendResourcesFlow = ai.defineFlow(
  {
    name: 'analyzeGapsAndRecommendResourcesFlow',
    inputSchema: AnalyzeGapsAndRecommendResourcesInputSchema,
    outputSchema: AnalyzeGapsAndRecommendResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
