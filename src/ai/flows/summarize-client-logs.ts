// SummarizeClientLogs Story: As a support manager, I want to view an AI-generated summary of a client's support logs on their profile page, so I can quickly identify trends and potential issues.

'use server';

/**
 * @fileOverview AI-powered summarization of client support logs.
 *
 * - summarizeClientLogs - A function that generates a summary of client support logs.
 * - SummarizeClientLogsInput - The input type for the summarizeClientLogs function.
 * - SummarizeClientLogsOutput - The return type for the summarizeClientLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClientLogsInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  supportLogs: z.string().describe('The support logs for the client.'),
});
export type SummarizeClientLogsInput = z.infer<typeof SummarizeClientLogsInputSchema>;

const SummarizeClientLogsOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the support logs.'),
  trends: z.string().describe('Identified trends from the support logs.'),
  potentialIssues: z.string().describe('Potential issues identified from the support logs.'),
});
export type SummarizeClientLogsOutput = z.infer<typeof SummarizeClientLogsOutputSchema>;

export async function summarizeClientLogs(input: SummarizeClientLogsInput): Promise<SummarizeClientLogsOutput> {
  return summarizeClientLogsFlow(input);
}

const summarizeClientLogsPrompt = ai.definePrompt({
  name: 'summarizeClientLogsPrompt',
  input: {schema: SummarizeClientLogsInputSchema},
  output: {schema: SummarizeClientLogsOutputSchema},
  prompt: `You are an AI assistant helping support managers quickly understand client support logs.

  Given the following client name and support logs, generate a summary, identify trends, and highlight potential issues.

  Client Name: {{{clientName}}}
  Support Logs: {{{supportLogs}}}

  Summary:
  Trends:
  Potential Issues:`,
});

const summarizeClientLogsFlow = ai.defineFlow(
  {
    name: 'summarizeClientLogsFlow',
    inputSchema: SummarizeClientLogsInputSchema,
    outputSchema: SummarizeClientLogsOutputSchema,
  },
  async input => {
    const {output} = await summarizeClientLogsPrompt(input);
    return output!;
  }
);
