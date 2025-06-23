import { config } from 'dotenv';
config();

import '@/ai/flows/resume-parser.ts';
import '@/ai/flows/skill-gap-analyzer.ts';
import '@/ai/flows/resource-recommender.ts';
import '@/ai/flows/job-matcher.ts';