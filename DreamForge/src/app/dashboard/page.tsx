// src/app/dashboard/page.tsx (örnek kod)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// ... ui bileşenleri import edebilirsin ...

export default function DashboardPage() {
  const [productName, setProductName] = useState('');
  const [yzKeywords, setYzKeywords] = useState('');
  const [category, setCategory] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_name: productName,
        yz_keywords: yzKeywords,
        category,
        funding_goal: Number(fundingGoal), // `funding_goal` numeric olduğu için dönüştürmelisin
        timeline,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert('Fikir başarıyla kaydedildi!');
      // Formu sıfırla
      setProductName('');
      setYzKeywords('');
      setCategory('');
      setFundingGoal('');
      setTimeline('');
      router.refresh();
    } else {
      const errorData = await res.json();
      alert('Hata: ' + errorData.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ürün Adı" required />
      <input type="text" value={yzKeywords} onChange={(e) => setYzKeywords(e.target.value)} placeholder="YZ Asistanı Anahtar Kelimeleri" required />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori" required />
      <input type="number" value={fundingGoal} onChange={(e) => setFundingGoal(e.target.value)} placeholder="Fonlama Hedefi ($)" required />
      <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Tahmini Zaman Çizelgesi" required />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Kaydediliyor...' : 'Fikir Kaydet'}
      </button>
    </form>
  );
}