// src/app/api/ideas/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { 
      product_name, 
      yz_keywords, 
      category,
      funding_goal,
      timeline
    } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        product_name,
        yz_keywords,
        category,
        funding_goal,
        timeline,
        user_id: user.id,
        status: 'pending',
      })
      .select();

    if (error) {
      console.error('Fikir ekleme hatası:', error);
      return NextResponse.json({ error: 'Fikir kaydedilirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json({ idea: data[0] }, { status: 201 });
  } catch (e) {
    console.error('API hatası:', e);
    return NextResponse.json({ error: 'Beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}