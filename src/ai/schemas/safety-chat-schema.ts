/**
 * @fileOverview Zod schemas and TypeScript types for the Safety Chat flow.
 */

import { z } from 'genkit';

export const SafetyChatInputSchema = z.object({
  question: z.string().describe("The user's latest question or message."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).describe('The conversation history.'),
});
export type SafetyChatInput = z.infer<typeof SafetyChatInputSchema>;
