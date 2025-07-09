/**
 * @fileOverview Zod schemas and TypeScript types for the SOS email flow.
 */

import {z} from 'genkit';

export const SOSInputSchema = z.object({
  latitude: z.number().describe("The user's current latitude."),
  longitude: z.number().describe("The user's current longitude."),
  userName: z.string().describe("The name of the user sending the SOS."),
  emergencyContacts: z.array(z.string().email()).describe("A list of emergency contact email addresses."),
});
export type SOSInput = z.infer<typeof SOSInputSchema>;

export const SOSOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
export type SOSOutput = z.infer<typeof SOSOutputSchema>;
