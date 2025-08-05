'use server';

/**
 * @fileOverview Generates compelling product descriptions using AI based on keywords and design file.
 *
 * - generateProductDescription - A function that handles the product description generation.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  keywords: z.string().describe('Keywords describing the product.'),
  designFile: z
    .string()
    .optional()
    .describe(
      "The design file (STL/OBJ) of the product as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Sen ürün açıklamaları konusunda uzmanlaşmış bir metin yazarısın.

  Sağlanan anahtar kelimelere ve tasarım dosyasına dayanarak, etkileyici ve çekici bir ürün açıklaması oluştur.

  Anahtar Kelimeler: {{{keywords}}}
  {{#if designFile}}
  Tasarım Dosyası: {{media url=designFile}}
  {{/if}}

  Açıklama:`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
