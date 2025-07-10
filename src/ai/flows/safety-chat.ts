
'use server';
/**
 * @fileOverview A flow for handling safety-related chat conversations.
 *
 * - getSafetyChatResponse - A function that gets a response from the AI.
 * - SafetyChatInput - The input type for the getSafetyChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z, type Part } from 'genkit';

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


export async function getSafetyChatResponse(input: SafetyChatInput): Promise<string> {
    const chatResponse = await safetyChatFlow(input);
    return chatResponse;
}

const safetyChatFlow = ai.defineFlow(
  {
    name: 'safetyChatFlow',
    inputSchema: SafetyChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { question, history } = input;
    
    // We need to cast the history to the correct type for the `generate` call.
    // The Zod schema ensures the structure is correct at runtime.
    const typedHistory = history as { role: 'user' | 'model'; content: Part[] }[];

    const { output } = await ai.generate({
      prompt: question,
      history: typedHistory,
      system: `You are a friendly and empathetic AI safety assistant for a university campus called SafeCircle.
      Your goal is to provide helpful, concise, and actionable safety advice to students.
      When a user describes a situation, remain calm and provide clear, step-by-step guidance.
      If a situation sounds like an immediate emergency, your first priority is to advise them to use the SOS button in the app or call campus security or the police immediately.
      Keep your responses focused on personal safety and relevant to a campus environment. Do not go off-topic.
      `
    });

    return output?.text ?? "I'm sorry, I couldn't come up with a response.";
  }
);
