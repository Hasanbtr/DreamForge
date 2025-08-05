// src/app/page.tsx
import Link from 'next/link';
import { getVotingIdeas, getProductionIdeas } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default async function Home() {
    const votingIdeas = await getVotingIdeas();
    const productionIdeas = await getProductionIdeas();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Üretime Geçen Ürünler Bölümü */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Üretime Geçen Ürünler</h1>
                    <Link href="/products">
                        <Button variant="ghost">Hepsini Gör</Button>
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {productionIdeas.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Henüz üretime geçmiş bir ürün yok.</p>
                    ) : (
                        productionIdeas.slice(0, 3).map(idea => ( // Sadece ilk 3 ürünü göster
                            <Card key={idea.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-semibold">{idea.product_name}</CardTitle>
                                        <Badge variant="default">Üretimde</Badge>
                                    </div>
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
                                    <Link href={`/ideas/${idea.id}`}>
                                        <Button variant="outline">Detayları Gör</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Oylamada Olan Fikirler Bölümü */}
            <div>
                <h1 className="text-3xl font-bold mb-6">Oylamada Olan Fikirler</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {votingIdeas.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Şu anda oylamada olan bir fikir yok.</p>
                    ) : (
                        votingIdeas.map(idea => (
                            <Card key={idea.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-semibold">{idea.product_name}</CardTitle>
                                        <Badge variant="secondary">Oylamada</Badge>
                                    </div>
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
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">{idea.upvote_count}</span>
                                        <p className="text-sm text-gray-500">oy</p>
                                    </div>
                                    <Link href={`/ideas/${idea.id}`}>
                                        <Button variant="outline">Detayları Gör</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}