'use server';

/**
 * @fileOverview Analyzes a product idea and provides feedback.
 * 
 * - analyzeIdea - A function that handles the product idea analysis.
 * - AnalyzeIdeaInput - The input type for the analyzeIdea function.
 * - AnalyzeIdeaOutput - The return type for the analyzeIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIdeaInputSchema = z.object({
  name: z.string().describe('The name of the product idea.'),
  description: z.string().describe('The description of the product idea.'),
  category: z.string().describe('The category of the product idea.'),
});
export type AnalyzeIdeaInput = z.infer<typeof AnalyzeIdeaInputSchema>;

const AnalyzeIdeaOutputSchema = z.object({
  marketability: z.number().min(1).max(10).describe('A score from 1-10 on the marketability of the idea.'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the product idea.'),
  targetAudience: z.string().describe('The potential target audience for the product.'),
});
export type AnalyzeIdeaOutput = z.infer<typeof AnalyzeIdeaOutputSchema>;

export async function analyzeIdea(input: AnalyzeIdeaInput): Promise<AnalyzeIdeaOutput> {
  return analyzeIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIdeaPrompt',
  input: {schema: AnalyzeIdeaInputSchema},
  output: {schema: AnalyzeIdeaOutputSchema},
  prompt: `Sen dünya standartlarında bir ürün geliştirme uzmanı ve startup kuluçka merkezi jürisisin.
  
  Aşağıdaki ürün fikrini adına, açıklamasına ve kategorisine göre analiz et.
  Fikrin pazarlanabilirliği üzerine 1-10 arasında bir puan ver (1 çok zayıf, 10 mükemmel).
  Fikri veya konumlandırmasını iyileştirmek için 3 somut, eyleme geçirilebilir öneri sun.
  Bu ürün için en olası hedef kitleyi tanımla.

  Analizin eleştirel, dürüst ve yapıcı olmalıdır.

  Ürün Adı: {{{name}}}
  Kategori: {{{category}}}
  Açıklama: {{{description}}}
  `,
});

const analyzeIdeaFlow = ai.defineFlow(
  {
    name: 'analyzeIdeaFlow',
    inputSchema: AnalyzeIdeaInputSchema,
    outputSchema: AnalyzeIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
