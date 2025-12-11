'use server';

/**
 * @fileOverview Provides a clear explanation of why a certain price is suggested for a task,
 * including factors like weather, holidays, and worker availability.
 *
 * - explainPriceSuggestion - A function that suggests and explains the price for a given task.
 * - ExplainPriceSuggestionInput - The input type for the explainPriceSuggestion function.
 * - ExplainPriceSuggestionOutput - The return type for the explainPriceSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPriceSuggestionInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  location: z.string().describe('The location where the task needs to be performed.'),
  dateTime: z.string().describe('The date and time when the task needs to be performed (ISO format).'),
});
export type ExplainPriceSuggestionInput = z.infer<typeof ExplainPriceSuggestionInputSchema>;

const ExplainPriceSuggestionOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price for the task.'),
  explanation: z.string().describe('The detailed explanation of why the price is suggested, including factors like weather, holidays, and worker availability.'),
});
export type ExplainPriceSuggestionOutput = z.infer<typeof ExplainPriceSuggestionOutputSchema>;

export async function explainPriceSuggestion(input: ExplainPriceSuggestionInput): Promise<ExplainPriceSuggestionOutput> {
  return explainPriceSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainPriceSuggestionPrompt',
  input: {schema: ExplainPriceSuggestionInputSchema},
  output: {schema: ExplainPriceSuggestionOutputSchema},
  prompt: `You are an AI assistant that suggests the optimal price for a task and explains the rationale behind it. Consider the following factors:

- Task Description: {{{taskDescription}}}
- Location: {{{location}}}
- Date and Time: {{{dateTime}}}

Take into account mock data for:

- Weather conditions (sunny, rainy, etc.)
- Holidays (if the date falls on a holiday)
- Worker availability in the specified location

Provide a suggested price and a clear explanation of your reasoning. The explanation must reference the description, location, and time.

Output:
{ {{output}} }`,
});

const explainPriceSuggestionFlow = ai.defineFlow(
  {
    name: 'explainPriceSuggestionFlow',
    inputSchema: ExplainPriceSuggestionInputSchema,
    outputSchema: ExplainPriceSuggestionOutputSchema,
  },
  async input => {
    // Mock data for weather, holidays, and worker availability can be used here.
    // This is just a placeholder - replace this with data from a service.
    const weather = 'Sunny';
    const isHoliday = false;
    const workerAvailability = 'High';

    const enrichedInput = {
      ...input,
      weather,
      isHoliday,
      workerAvailability,
    };
    const {output} = await prompt(enrichedInput);
    return output!;
  }
);
