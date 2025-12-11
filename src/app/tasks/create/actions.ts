"use server";

import { z } from "zod";
import { suggestTaskPrice } from "@/ai/flows/suggest-task-price";

const PriceSuggestionSchema = z.object({
  description: z.string(),
  location: z.string(),
  dateTime: z.string(),
});

export async function handlePriceSuggestion(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedData = PriceSuggestionSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: "Invalid data provided for price suggestion.",
    };
  }

  try {
    const result = await suggestTaskPrice(validatedData.data);
    return {
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to get price suggestion. Please try again.",
    };
  }
}
