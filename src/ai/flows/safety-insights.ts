'use server';

/**
 * @fileOverview Determines the risk level for a given route based on campus security incident reports and nearby police blotter data.
 *
 * - getSafetyInsights - A function that analyzes a route and provides a risk assessment.
 * - SafetyInsightsInput - The input type for the getSafetyInsights function.
 * - SafetyInsightsOutput - The return type for the getSafetyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafetyInsightsInputSchema = z.object({
  routeDescription: z
    .string()
    .describe('A description of the route the user intends to take.'),
  campusSecurityReports: z
    .string()
    .describe('Recent campus security incident reports.'),
  policeBlotterData: z
    .string()
    .describe('Recent police blotter data for the area.'),
});
export type SafetyInsightsInput = z.infer<typeof SafetyInsightsInputSchema>;

const SafetyInsightsOutputSchema = z.object({
  riskLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The overall risk level of the route.'),
  riskFactors: z
    .string()
    .describe('A summary of the factors contributing to the risk level.'),
  recommendations: z
    .string()
    .describe('Recommendations for the user to improve their safety.'),
});
export type SafetyInsightsOutput = z.infer<typeof SafetyInsightsOutputSchema>;

export async function getSafetyInsights(input: SafetyInsightsInput): Promise<SafetyInsightsOutput> {
  return safetyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'safetyInsightsPrompt',
  input: {schema: SafetyInsightsInputSchema},
  output: {schema: SafetyInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes safety data and provides risk assessments for routes.

  Given the following information, assess the risk level of the route and provide recommendations to the user.

  Route Description: {{{routeDescription}}}
  Campus Security Reports: {{{campusSecurityReports}}}
  Police Blotter Data: {{{policeBlotterData}}}

  Consider factors such as the time of day, lighting conditions, reported incidents, and any other relevant information.

  Provide a risk assessment with a risk level (low, medium, or high), a summary of the risk factors, and recommendations for the user to improve their safety.

  Ensure that the response is formatted according to the SafetyInsightsOutputSchema. Use the descriptions in the schema to guide the response.  The descriptions will be passed to the LLM to produce JSON output conforming to the schema.
`,
});

const safetyInsightsFlow = ai.defineFlow(
  {
    name: 'safetyInsightsFlow',
    inputSchema: SafetyInsightsInputSchema,
    outputSchema: SafetyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
