
"use server";

import { generateProductDescription as generateProductDescriptionFlow } from "@/ai/flows/generate-product-description";
import { z } from "zod";
import type { GenerateProductDescriptionInput } from "@/ai/flows/generate-product-description";

const actionSchema = z.object({
  keywords: z.string().min(1, 'Keywords are required.'),
  designFile: z.string().nullable().optional(),
});

export async function generateDescriptionAction(formData: FormData) {
  const keywords = formData.get("keywords") as string;
  const designFile = formData.get("designFile") as string | null;

  const validatedInput = actionSchema.safeParse({ keywords, designFile });

  if (!validatedInput.success) {
    // Return the validation error message
    return {
      error: validatedInput.error.errors[0].message,
    };
  }
  
  const flowInput: GenerateProductDescriptionInput = {
    keywords: validatedInput.data.keywords,
  };

  // Only include designFile if it's a valid data URI and not null.
  if (validatedInput.data.designFile && validatedInput.data.designFile.startsWith('data:')) {
      flowInput.designFile = validatedInput.data.designFile;
  }

  try {
    const result = await generateProductDescriptionFlow(flowInput);
    return { description: result.description };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate description. Please try again." };
  }
}
