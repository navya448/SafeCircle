/**
 * @fileOverview Zod schemas and TypeScript types for the SOS email flow.
 */

import {z} from 'genkit';

export const SOSInputSchema = z.object({
  latitude: z.number().describe('The user\'s current latitude.'),
  longitude: z.number().describe('The user\'s current longitude.'),
});
export type SOSInput = z.infer<typeof SOSInputSchema>;

export const SOSOutputSchema = z.object({
  success: z.boolean(),
});
export type SOSOutput = z.infer<typeof SOSOutputSchema>;
