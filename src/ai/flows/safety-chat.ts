
'use server';
/**
 * @fileOverview A flow for handling safety-related chat conversations.
 *
 * - getSafetyChatResponse - A function that gets a response from the AI.
 */

import { ai } from '@/ai/genkit';
import { type Part } from 'genkit';
import { SafetyChatInputSchema, type SafetyChatInput } from '@/ai/schemas/safety-chat-schema';
import { z } from 'genkit';

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
    
    const typedHistory = history.map(h => ({
      role: h.role,
      content: h.content,
    })) as { role: 'user' | 'model'; content: Part[] }[];


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

    const responseText = output?.text;
    if (responseText && responseText.trim().length > 0) {
      return responseText;
    }
    
    return "I'm sorry, I couldn't come up with a response.";
  }
);
