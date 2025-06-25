import { config } from 'dotenv';
config();

import '@/ai/flows/resume-parser.ts';
import '@/ai/flows/skill-gap-analyzer.ts';
import '@/ai/flows/job-matcher.ts';
import '@/ai/tools/job-search.ts';
