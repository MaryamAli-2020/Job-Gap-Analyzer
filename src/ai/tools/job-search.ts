'use server';
/**
 * @fileOverview A tool for searching for job listings.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const JobSearchInputSchema = z.object({
  query: z.string().describe('A search query for jobs, like "frontend developer" or "product manager in New York".'),
});

const JobSearchOutputSchema = z.array(
    z.object({
        id: z.string().describe("A unique identifier for the job."),
        title: z.string().describe("The title of the job."),
        company: z.string().describe("The company offering the job."),
        location: z.string().describe("The location of the job."),
        description: z.string().describe("A description of the job."),
        url: z.string().describe("A URL to the job listing."),
    })
);


export const searchJobsTool = ai.defineTool(
  {
    name: 'searchJobs',
    description: 'Searches for job listings based on a query. Use this to find jobs for a user.',
    inputSchema: JobSearchInputSchema,
    outputSchema: JobSearchOutputSchema,
  },
  async ({ query }) => {
    // In a real application, this would call a job search API.
    // For this prototype, we'll generate some realistic sample data.
    const { output } = await ai.generate({
        prompt: `Generate a list of 10 realistic, but fictional, job listings for the query: "${query}". Provide varied companies and locations. Each job should have a unique ID, title, company, location, a detailed description, and a placeholder URL.`,
        output: {
            schema: JobSearchOutputSchema,
        },
        model: 'googleai/gemini-2.0-flash',
    });

    return output || [];
  }
);
