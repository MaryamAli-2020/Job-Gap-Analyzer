'use server';

/**
 * @fileOverview An AI agent that recommends learning resources based on skill gaps.
 *
 * - recommendResources - A function that recommends learning resources.
 * - RecommendResourcesInput - The input type for the recommendResources function.
 * - RecommendResourcesOutput - The return type for the recommendResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendResourcesInputSchema = z.object({
  skillGaps: z
    .string()
    .describe(
      'A description of the skill gaps identified between the user and their target jobs.'
    ),
  desiredJob: z.string().describe('The job the user is targeting.'),
});
export type RecommendResourcesInput = z.infer<typeof RecommendResourcesInputSchema>;

const RecommendResourcesOutputSchema = z.object({
  resources: z
    .array(z.string())
    .describe(
      'A list of learning resources (online courses, tutorials, articles) that can help the user bridge their skill gaps.'
    ),
});
export type RecommendResourcesOutput = z.infer<typeof RecommendResourcesOutputSchema>;

export async function recommendResources(
  input: RecommendResourcesInput
): Promise<RecommendResourcesOutput> {
  return recommendResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendResourcesPrompt',
  input: {schema: RecommendResourcesInputSchema},
  output: {schema: RecommendResourcesOutputSchema},
  prompt: `You are an expert career coach specializing in recommending learning resources to bridge skill gaps.

  Based on the identified skill gaps and the desired job, recommend relevant learning resources such as online courses, tutorials, and articles.

  Skill Gaps: {{{skillGaps}}}
  Desired Job: {{{desiredJob}}}

  Recommend resources that will help the user improve their skills and increase their chances of landing the desired job.
  Resources:`, 
});

const recommendResourcesFlow = ai.defineFlow(
  {
    name: 'recommendResourcesFlow',
    inputSchema: RecommendResourcesInputSchema,
    outputSchema: RecommendResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
