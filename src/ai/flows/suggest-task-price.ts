'use server';

/**
 * @fileOverview An AI agent that suggests the optimal price for a task based on its description, location and time.
 *
 * - suggestTaskPrice - A function that handles the task price suggestion process.
 * - SuggestTaskPriceInput - The input type for the suggestTaskPrice function.
 * - SuggestTaskPriceOutput - The return type for the suggestTaskPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskPriceInputSchema = z.object({
  description: z.string().describe('The description of the task.'),
  location: z.string().describe('The location where the task needs to be performed.'),
  dateTime: z.string().describe('The date and time when the task needs to be performed in ISO format (e.g., 2024-04-22T14:00:00Z).'),
});
export type SuggestTaskPriceInput = z.infer<typeof SuggestTaskPriceInputSchema>;

const SuggestTaskPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price for the task.'),
  explanation: z.string().describe('The explanation for the suggested price, including factors like weather, holidays, and worker availability.'),
});
export type SuggestTaskPriceOutput = z.infer<typeof SuggestTaskPriceOutputSchema>;

export async function suggestTaskPrice(input: SuggestTaskPriceInput): Promise<SuggestTaskPriceOutput> {
  return suggestTaskPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskPricePrompt',
  input: {schema: SuggestTaskPriceInputSchema},
  output: {schema: SuggestTaskPriceOutputSchema},
  prompt: `You are an AI assistant that suggests the optimal price for a task.

  Consider the following factors when suggesting the price:
  - Task description: {{{description}}}
  - Location: {{{location}}}
  - Date and Time: {{{dateTime}}}

  Take into account mock data for weather, holidays, and worker availability.

  Provide a suggested price and an explanation for your decision.

  Respond with a JSON object that contains the suggested price and explanation.  The suggested price should be a number.
  The explanation should be a string that includes factors like weather, holidays, and worker availability.

  Make sure the suggestedPrice is reasonable given the inputs.
  `,
});

const suggestTaskPriceFlow = ai.defineFlow(
  {
    name: 'suggestTaskPriceFlow',
    inputSchema: SuggestTaskPriceInputSchema,
    outputSchema: SuggestTaskPriceOutputSchema,
  },
  async input => {
    // In a real application, you would fetch mock data for weather, holidays,
    // and worker availability based on the input location and time.
    // For this example, we'll use hardcoded mock data.

    const {output} = await prompt(input);
    return output!;
  }
);
