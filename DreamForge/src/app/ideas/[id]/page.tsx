// src/app/ideas/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { getIdeaById, addVote, addComment, addPreorder, addPurchase } from "@/lib/data-service";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { type ProductIdea, type User, type Comment, type Vote } from "@/lib/types";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/?d=retro&s=200';
const DEFAULT_IDEA_PHOTO_URL = 'https://picsum.photos/600/400';

export default function IdeaPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState<ProductIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isPreordering, setIsPreordering] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [commentSummary, setCommentSummary] = useState<string | null>(null);
  const [preorderAmount, setPreorderAmount] = useState(100);
  const router = useRouter();

  useEffect(() => {
    async function fetchIdea() {
      if (typeof id === 'string') {
        const fetchedIdea = await getIdeaById(id);
        setIdea(fetchedIdea);
        setLoading(false);
      }
    }
    fetchIdea();
  }, [id]);

  const handleVote = async (voteType: 'upvote') => {
    if (!user || !idea || isVoting) return;
    setIsVoting(true);
    try {
      await addVote(idea.id, voteType, idea);
      const updatedIdea = await getIdeaById(idea.id);
      setIdea(updatedIdea);
    } catch (error) {
      console.error('Oy eklenirken hata oluştu:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleComment = async () => {
    if (!user || !idea || !commentContent || isCommenting) return;
    setIsCommenting(true);
    try {
      await addComment(idea.id, commentContent);
      setCommentContent("");
      const updatedIdea = await getIdeaById(idea.id);
      setIdea(updatedIdea);
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handlePreorder = async () => {
    if (!user || !idea || isPreordering) return;
    setIsPreordering(true);
    try {
      await addPreorder(idea.id, preorderAmount);
      const updatedIdea = await getIdeaById(idea.id);
      setIdea(updatedIdea);
    } catch (error) {
      console.error('Ön sipariş eklenirken hata oluştu:', error);
    } finally {
      setIsPreordering(false);
    }
  };

  const handlePurchase = async () => {
    if (!user || !idea) {
        alert("Satın alma işlemi için giriş yapmalısınız.");
        router.push('/login');
        return;
    }
    try {
        await addPurchase(idea.id);
        alert("Ürün başarıyla satın alındı!");
        const updatedIdea = await getIdeaById(idea.id);
        setIdea(updatedIdea);
    } catch (error) {
        console.error("Satın alma işlemi sırasında bir hata oluştu:", error);
        alert("Satın alma işlemi başarısız oldu.");
    }
  };
  
  const handleSummarizeComments = async () => {
    if (!idea || !idea.comments || idea.comments.length === 0 || isSummarizing) return;

    setIsSummarizing(true);
    setCommentSummary(null);

    try {
        const response = await fetch('/api/ai/analyze-comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comments: idea.comments }),
        });

        if (!response.ok) {
            throw new Error('API yanıtı başarısız oldu.');
        }

        const data = await response.json();
        setCommentSummary(data.commentSummary);
    } catch (error) {
        console.error("Yorum özeti oluşturma hatası:", error);
        alert("Yorum özeti oluşturulurken bir hata oluştu.");
    } finally {
        setIsSummarizing(false);
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Fikir bulunamadı.
      </div>
    );
  }

  const ideaPhoto = idea.photo_url || DEFAULT_IDEA_PHOTO_URL;

  const authorName = idea.profiles?.name || 'Bilinmeyen Yazar';
  const authorAvatarUrl = idea.profiles?.avatar_url || DEFAULT_AVATAR_URL;

  const upvotes = idea.upvote_count;
  
  const currentUserVote = idea.votes?.find(v => v.user_id === user?.id);
  const hasPurchased = idea.preorders?.some(p => p.user_id === user?.id);

  const funding_current = idea.preorders?.reduce((sum: number, preorder) => sum + preorder.amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        {idea.photo_url && (
          <div className="relative h-96 w-full">
            <Image
              src={ideaPhoto}
              alt={idea.product_name}
              fill
              className="rounded-t-lg object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={authorAvatarUrl} />
              <AvatarFallback>{authorName.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{authorName}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(parseISO(idea.created_at), { addSuffix: true, locale: tr })}
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-bold">{idea.product_name}</h1>
          <p className="text-lg text-gray-700">{idea.description}</p>
        </CardHeader>
        <CardContent>
          {/* Diğer detaylar burada */}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {idea.status === 'in_production' ? (
            <div className="flex justify-between items-center w-full">
                <p className="font-semibold text-lg text-green-600">Bu fikir üretime geçti!</p>
                {hasPurchased ? (
                    <Button variant="outline" disabled>Satın Alındı</Button>
                ) : (
                    <Button onClick={handlePurchase} variant="default">Satın Al (₺500)</Button>
                )}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <p className="font-semibold text-gray-700">Oylamada</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleVote('upvote')}
                    disabled={isVoting}
                    variant={currentUserVote?.vote_type === 'upvote' ? 'default' : 'outline'}
                  >
                    Upvote ({upvotes}/100)
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="number"
                  className="w-24 border p-2 rounded-md text-center"
                  value={preorderAmount}
                  onChange={(e) => setPreorderAmount(Number(e.target.value))}
                  min="1"
                />
                <Button onClick={handlePreorder} disabled={isPreordering}>
                  Ön Sipariş Ver ({funding_current})
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>

      <div className="mt-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Yorumlar ({idea.comments?.length || 0})</h2>
            {idea.comments && idea.comments.length > 2 && (
                <Button 
                    onClick={handleSummarizeComments} 
                    disabled={isSummarizing}
                    variant="outline"
                    size="sm"
                >
                    {isSummarizing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Özetleniyor...
                        </>
                    ) : (
                        'Yorumları Özetle'
                    )}
                </Button>
            )}
        </div>
        
        {commentSummary && (
            <Card className="mt-4 bg-gray-50 dark:bg-gray-700">
                <CardHeader>
                    <CardTitle className="text-lg">Yorum Özeti</CardTitle>
                    <CardDescription>Yapay zeka tarafından oluşturulmuştur.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{commentSummary}</p>
                </CardContent>
            </Card>
        )}

        <div className="space-y-4 mt-4">
          {idea.comments?.map(comment => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={comment.author?.avatar_url || DEFAULT_AVATAR_URL} />
                    <AvatarFallback>{comment.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{comment.author?.name || 'Bilinmeyen Yazar'}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true, locale: tr })}
                    </p>
                  </div>
                </div>
                <p className="mt-2">{comment.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <Textarea
            placeholder="Yorumunuzu yazın..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button onClick={handleComment} disabled={isCommenting || !user} className="mt-2">
            Yorum Ekle
          </Button>
        </div>
      </div>
    </div>
  );
}