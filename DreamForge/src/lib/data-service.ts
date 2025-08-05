// src/lib/data-service.ts

import { supabase } from "./supabase";
import { User, ProductIdea } from "./types";
import { type User as SupabaseUser } from '@supabase/supabase-js';

export async function addProfile(
  id: string,
  name: string,
  email: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id, name, email }])
    .select()
    .single();

  if (error) {
    console.error("Profil oluşturma hatası:", error);
    return null;
  }

  return data;
}

export async function getProfileById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Profil getirme hatası:", error);
    return null;
  }

  return data;
}

export async function getIdeas(): Promise<ProductIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    // upvote_count ve status sütunları eklendi
    .select("*, profiles:author_id(*), upvote_count, status"); 

  if (error) {
    console.error("Fikirleri getirme hatası:", error);
    return [];
  }

  return data as ProductIdea[];
}

export async function getIdeaById(id: string): Promise<ProductIdea | null> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*, profiles:author_id(*), comments(*, author:user_id(*)), preorders(*), votes(*)")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fikir getirme hatası:", error);
    return null;
  }

  return data as ProductIdea;
}

export async function addIdea(
  ideaData: {
    title: string;
    description: string;
    category: string;
    fundingGoal: number;
    timeline: string;
    photoUrl: string | null;
  },
  user: SupabaseUser
): Promise<ProductIdea | null> {
  if (!user) {
    throw new Error("Kullanıcı oturum açmamış.");
  }

  const { data, error } = await supabase
    .from("ideas")
    .insert([
      {
        user_id: user.id,
        product_name: ideaData.title,
        description: ideaData.description,
        category: ideaData.category,
        funding_goal: ideaData.fundingGoal,
        timeline: ideaData.timeline,
        photo_url: ideaData.photoUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Fikir ekleme hatası:", error);
    return null;
  }
  return data as ProductIdea;
}

export async function addVote(
  ideaId: string,
  voteType: 'upvote',
  idea: ProductIdea
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı oturum açmamış.");
  }

  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("id, vote_type")
    .eq("user_id", user.id)
    .eq("idea_id", ideaId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Mevcut oyu çekerken hata oluştu:", fetchError);
      throw new Error(fetchError.message);
  }

  // Eğer mevcut bir oy varsa, oyu sil ve upvote sayısını azalt
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);
    if (deleteError) {
      console.error("Oy silinirken hata oluştu:", deleteError);
      throw new Error(deleteError.message);
    }

    const { error: updateCountError } = await supabase
      .from('ideas')
      .update({ upvote_count: (idea.upvote_count || 0) - 1 }) // <-- upvote_count kontrolü eklendi
      .eq('id', ideaId);
    if (updateCountError) {
      console.error("Upvote sayısını azaltma hatası:", updateCountError);
    }
  } 
  // Eğer mevcut oy yoksa, yeni bir upvote ekle ve upvote sayısını artır
  else {
    const { error: insertError } = await supabase
      .from("votes")
      .insert([{ user_id: user.id, idea_id: ideaId, vote_type: voteType }]);
    if (insertError) {
      console.error("Oy ekleme hatası:", insertError);
      throw new Error(insertError.message);
    }

    const { error: updateCountError } = await supabase
      .from('ideas')
      .update({ upvote_count: (idea.upvote_count || 0) + 1 }) // <-- upvote_count kontrolü eklendi
      .eq('id', ideaId);
    if (updateCountError) {
      console.error("Upvote sayısını artırma hatası:", updateCountError);
    }
  }

  // Fikrin güncel upvote sayısını çekerek eşiği kontrol et
  const { data: updatedIdea, error: ideaFetchError } = await supabase
    .from('ideas')
    .select('upvote_count, status')
    .eq('id', ideaId)
    .single();

  if (ideaFetchError) {
    console.error("Güncel fikir verisini çekerken hata oluştu:", ideaFetchError);
    return;
  }

  if (updatedIdea.upvote_count >= 1 && updatedIdea.status !== 'in_production') {
    const { error: updateStatusError } = await supabase
      .from("ideas")
      .update({ status: "in_production" })
      .eq("id", ideaId);

    if (updateStatusError) {
      console.error("Fikir durumu güncelleme hatası:", updateStatusError);
    }
  }
}


// ... (Diğer fonksiyonlar)

export async function addComment(
  ideaId: string,
  text: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı oturum açmamış.");
  }

  const { error } = await supabase
    .from("comments")
    .insert([{ user_id: user.id, idea_id: ideaId, text }]);

  if (error) {
    console.error("Yorum ekleme hatası:", error);
    throw new Error(error.message);
  }
}

export async function addPreorder(ideaId: string, amount: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı oturum açmamış.");
  }

  const { data: existingPreorder, error: fetchError } = await supabase
    .from("preorders")
    .select("id, amount")
    .eq("user_id", user.id)
    .eq("idea_id", ideaId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Mevcut ön siparişi çekerken hata oluştu:", fetchError);
      throw new Error(fetchError.message);
  }

  if (existingPreorder) {
    const { error: updateError } = await supabase
      .from("preorders")
      .update({ amount: existingPreorder.amount + amount })
      .eq("id", existingPreorder.id);
    
    if (updateError) {
      console.error("Ön sipariş güncellenirken hata oluştu:", updateError);
      throw new Error(updateError.message);
    }

  } else {
    const { error: insertError } = await supabase
      .from("preorders")
      .insert([{ user_id: user.id, idea_id: ideaId, amount }]);
      
    if (insertError) {
      console.error("Ön sipariş ekleme hatası:", insertError);
      throw new Error(insertError.message);
    }
  }
}


export async function getProductionIdeas(): Promise<ProductIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*, profiles:author_id(*), upvote_count, status")
    .eq('status', 'in_production'); // Sadece durumu 'in_production' olanları çek

  if (error) {
    console.error("Üretime hazır fikirleri getirme hatası:", error);
    return [];
  }

  return data as ProductIdea[];
}

// src/lib/data-service.ts
// ... (Mevcut kodlar ve importlar aynı)

// src/lib/data-service.ts
// ... (Diğer kodlar)

export async function addPurchase(ideaId: string): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Kullanıcı oturum açmamış.");
    }
    
    // Kullanıcının bu ürün için zaten bir kaydı olup olmadığını kontrol et
    const { data: existingPreorder, error: fetchError } = await supabase
        .from('preorders')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', ideaId)
        .single();
    
    // Eğer bir kayıt varsa, tekrar eklemeye çalışma
    if (existingPreorder) {
        // Bu durumda fonksiyonu başarıyla tamamla, hata fırlatma
        return;
    }

    // Satın alma miktarını sabit bir değer olarak belirliyoruz.
    const amount = 500;

    const { error } = await supabase
        .from('preorders')
        .insert([{ user_id: user.id, idea_id: ideaId, amount: amount }]);

    if (error) {
        console.error('Satın alma işlemi sırasında veritabanı hatası:', error);
        throw new Error(error.message);
    }
}


export async function getVotingIdeas(): Promise<ProductIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*, profiles:author_id(*), upvote_count, status, preorders(*), votes(*)")
    .eq('status', 'voting'); // Sadece durumu 'voting' olanları çek

  if (error) {
    console.error("Oylamadaki fikirleri getirme hatası:", error);
    return [];
  }

  return data as ProductIdea[];
}
