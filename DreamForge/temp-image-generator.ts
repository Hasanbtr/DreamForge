/**
 * @fileOverview A temporary script to generate images for existing product ideas.
 * This script will read the data.json file, find ideas with placeholder images,
 * generate new images using AI, and print the updated JSON to the console.
 */
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { getIdeas, addIdea } from '@/lib/data-service'; // We need these functions
import { generateProductImage } from '@/ai/flows/generate-product-image';
import type { ProductIdea } from '@/lib/types';
import { config } from 'dotenv';
config();

// Define the path to the data.json file
const dataPath = path.join(process.cwd(), 'src/lib/data.json');

async function main() {
  console.log('Fetching existing product ideas...');
  
  // Directly read the data to avoid dependencies on a running server
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(fileContent);
  const ideas: ProductIdea[] = data.productIdeas;

  console.log(`Found ${ideas.length} ideas. Checking for placeholders...`);

  const updatedIdeas = await Promise.all(
    ideas.map(async (idea) => {
      // Check if the image is a placeholder
      if (idea.imageUrl.includes('placehold.co')) {
        console.log(`Generating new image for: "${idea.name}"`);
        try {
          const prompt = `A photorealistic product shot of a ${idea.name}, ${idea.description}`;
          const imageResult = await generateProductImage({ promptText: prompt });

          if (imageResult && imageResult.imageUrl) {
            console.log(` -> Success! New image generated for "${idea.name}".`);
            return { ...idea, imageUrl: imageResult.imageUrl };
          } else {
            console.log(` -> Failed to generate image, keeping placeholder.`);
            return idea;
          }
        } catch (e) {
          console.error(` -> Error generating image for "${idea.name}":`, e);
          return idea; // Return original idea on error
        }
      }
      // If it's not a placeholder, just return it as is
      return idea;
    })
  );

  console.log('\nImage generation complete.');
  console.log('Please copy the following JSON and replace the "productIdeas" array in src/lib/data.json:\n');

  // Print the final, updated JSON to the console
  console.log(JSON.stringify(updatedIdeas, null, 2));
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
});
