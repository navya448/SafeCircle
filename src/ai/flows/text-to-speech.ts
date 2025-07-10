
'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text into an audio data URI.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';


export async function textToSpeech(text: string): Promise<string> {
    const { audioDataUri } = await textToSpeechFlow({ text });
    return audioDataUri;
}

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      const bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}


const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ audioDataUri: z.string() }),
  },
  async ({ text }) => {
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'achernar' }, // A friendly, clear voice
            },
          },
        },
        prompt: text,
      });

      if (!media) {
        throw new Error('No audio media was generated.');
      }

      // The returned audio is raw PCM, we need to convert it to a WAV file
      // to be able to play it in the browser.
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);
      const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

      return { audioDataUri };
  }
);
