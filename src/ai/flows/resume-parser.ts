'use server';

/**
 * @fileOverview Resume parsing AI agent.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  name: z.string().describe('The full name of the candidate.'),
  email: z.string().describe('The primary email address of the candidate.'),
  phone: z.string().describe('The primary phone number of the candidate.'),
  skills: z
    .array(z.string())
    .describe(
      'A list of key technical and soft skills. Infer from the entire document, not just a dedicated skills section.'
    ),
  experience: z
    .array(z.string())
    .describe(
      'A list of professional work experiences. Each item should be a concise summary of a role, including company, title, and duration if available.'
    ),
  education: z
    .array(z.string())
    .describe(
      'A list of educational qualifications. Each item should include the degree, institution, and graduation year if available.'
    ),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Your task is to meticulously analyze the provided resume document and extract key information into a structured JSON format. The resume may come in various layouts, so be flexible in identifying sections. It is critical to extract as much information as possible, even if it's not explicitly labeled.

Resume Document:
{{media url=resumeDataUri}}

Please extract the following details:

1.  **Name**: Identify the full name of the candidate.
2.  **Email**: Find the primary email address.
3.  **Phone**: Find the primary contact phone number.
4.  **Skills**: This is the most important section. Compile a comprehensive list of skills.
    *   First, look for a dedicated "Skills" section.
    *   Then, **thoroughly infer skills** from the "Experience" and "Projects" sections. For example, if a job description mentions "developed a REST API with Node.js", you should extract "REST API", "API Development", and "Node.js" as skills. Be exhaustive.
5.  **Experience**: Extract each distinct work experience. Summarize each entry into a single string, including the job title, company name, and employment dates if available. Make sure to capture the core responsibilities.
6.  **Education**: Extract all educational qualifications. Summarize each entry into a single string, including the degree, university/institution, and graduation date if available.

If a specific piece of information (like a phone number) is not present, return an empty string for that field. For lists like skills, experience, or education, return an empty array if no relevant information is found.
`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
