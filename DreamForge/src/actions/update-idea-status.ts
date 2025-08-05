
'use server';

import { revalidatePath } from 'next/cache';
import { updateIdeaStatus as updateStatus } from '@/lib/data-service';
import type { ProductIdea } from '@/lib/types';

export async function updateIdeaStatus(
  ideaId: string,
  status: ProductIdea['status']
) {
  try {
    await updateStatus(ideaId, status);
    // Revalidate the ideas page to show the updated status
    revalidatePath('/admin/ideas');
    revalidatePath('/');
    return { success: true, message: `Fikir başarıyla ${status} olarak işaretlendi.` };
  } catch (error) {
    console.error('Failed to update idea status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
    return { success: false, error: errorMessage };
  }
}
