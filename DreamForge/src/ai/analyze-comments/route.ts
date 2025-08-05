// src/app/api/ai/analyze-comments/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API anahtarınızı çevre değişkeninden alın
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY çevre değişkeni tanımlı değil.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { comments } = await req.json();

    if (!comments || comments.length === 0) {
      return NextResponse.json({ error: 'Yorumlar boş.' }, { status: 400 });
    }

    const commentTexts = comments.map((comment: any) => `- ${comment.text}`).join('\n');

    const prompt = `
      Aşağıdaki ürün fikri yorumlarını oku. Bunları özetle ve yorumlardaki ana temaları, olumlu ve olumsuz noktaları Türkçe olarak listele. Sadece yorumların özetini ve analizini yaz, başka bir şey ekleme.

      Yorumlar:
      ${commentTexts}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const commentSummary = response.text();

    return NextResponse.json({ commentSummary });

  } catch (error) {
    console.error('Yorum analizi hatası:', error);
    return NextResponse.json({ error: 'Yorumlar analiz edilirken bir hata oluştu.' }, { status: 500 });
  }
}