import { config } from 'dotenv';
config();

import '@/ai/flows/safety-insights.ts';
import '@/ai/flows/send-sos-email.ts';
import '@/ai/flows/safety-chat.ts';
import '@/ai/flows/text-to-speech.ts';
