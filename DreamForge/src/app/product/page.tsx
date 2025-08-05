// src/app/products/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { getProductionIdeas, addPurchase } from '@/lib/data-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { ProductIdea } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const { user } = useAuth();
    const [productionIdeas, setProductionIdeas] = useState<ProductIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchIdeas = async () => {
            const ideas = await getProductionIdeas();
            setProductionIdeas(ideas);
            setLoading(false);
        };
        fetchIdeas();
    }, []);

    const handlePurchase = async (ideaId: string) => {
        if (!user) {
            alert("Satın alma işlemi için giriş yapmalısınız.");
            router.push('/login');
            return;
        }

        try {
            await addPurchase(ideaId);
            alert("Ürün başarıyla satın alındı!");
            // Satın alım başarılı olunca sayfayı yenileyerek butonu güncelle
            const updatedIdeas = await getProductionIdeas();
            setProductionIdeas(updatedIdeas);
        } catch (error) {
            console.error("Satın alma işlemi sırasında bir hata oluştu:", error);
            alert("Satın alma işlemi başarısız oldu.");
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Üretime Geçen Ürünler</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {productionIdeas.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">Henüz üretime geçmiş bir ürün yok.</p>
                ) : (
                    productionIdeas.map(idea => {
                        // Kullanıcının bu ürünü zaten satın alıp almadığını kontrol et
                        const hasPurchased = idea.preorders?.some(p => p.user_id === user?.id);

                        return (
                            <Card key={idea.id}>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">{idea.product_name}</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {idea.profiles?.name || 'Bilinmeyen Yazar'}
                                    </CardDescription>
                                    {idea.photo_url && (
                                        <div className="relative h-48 w-full mt-4">
                                            <Image
                                                src={idea.photo_url}
                                                alt={idea.product_name}
                                                fill
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 line-clamp-3">{idea.description}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <p className="font-semibold text-green-600">Satışta!</p>
                                    {hasPurchased ? (
                                        <Button variant="outline" disabled>Satın Alındı</Button>
                                    ) : (
                                        <Button onClick={() => handlePurchase(idea.id)} variant="default">Satın Al (₺500)</Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}