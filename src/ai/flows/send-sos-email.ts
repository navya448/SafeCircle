'use server';
/**
 * @fileOverview A flow for sending SOS email alerts.
 *
 * - sendSOSEmail - A function that sends an SOS email.
 */

import {ai} from '@/ai/genkit';
import { SOSInputSchema, type SOSInput, SOSOutputSchema } from '@/ai/schemas/sos-schema';

// This is a placeholder for a real email sending service.
// In a real application, you would integrate with a service like SendGrid, Nodemailer, etc.
// This function SIMULATES sending an email by logging it to the console.
async function sendEmail(to: string, subject: string, body: string) {
    console.log('------- EMAIL SIMULATION -------');
    console.log('This is not a real email. In a production app, this would be sent to a real email address.');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('--------------------------------');
    // In a real implementation, this would return a promise from the email service
    return Promise.resolve(true);
}


export async function sendSOSEmail(input: SOSInput) {
  return sendSOSEmailFlow(input);
}

const sendSOSEmailFlow = ai.defineFlow(
  {
    name: 'sendSOSEmailFlow',
    inputSchema: SOSInputSchema,
    outputSchema: SOSOutputSchema,
  },
  async (input) => {
    const { latitude, longitude, userName, emergencyContacts } = input;
    
    const subject = `SOS Alert from ${userName}`;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const body = `
      EMERGENCY!

      ${userName} has triggered an SOS alert.

      Their last known location is: ${latitude}, ${longitude}
      View on map: ${mapsLink}

      Please take immediate action.
    `;

    try {
        for(const contact of emergencyContacts) {
            await sendEmail(contact, subject, body);
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to send SOS email:", error);
        return { success: false, message: (error as Error).message };
    }
  }
);
