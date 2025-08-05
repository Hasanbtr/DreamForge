"use client"

import type { ProductIdea } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, MessageCircle, Heart } from "lucide-react";

type IdeaCardProps = {
  idea: ProductIdea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const fundingPercentage = (idea.fundingCurrent / idea.fundingGoal) * 100;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/ideas/${idea.id}`} className="block">
          <div className="aspect-[3/2] relative">
            <Image
              src={idea.imageUrl}
              alt={idea.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={idea.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <div className="flex justify-between items-start">
            <Badge variant="secondary" className="mb-2">{idea.category}</Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>{idea.votes}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{idea.comments.length}</span>
                </div>
            </div>
        </div>
        <Link href={`/ideas/${idea.id}`} className="block">
            <CardTitle className="text-lg font-semibold leading-snug hover:text-primary transition-colors">
                {idea.name}
            </CardTitle>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>${idea.fundingCurrent.toLocaleString()}</span>
            <span>${idea.fundingGoal.toLocaleString()}</span>
          </div>
          <Progress value={fundingPercentage} aria-label={`%${fundingPercentage.toFixed(0)} fonlandı`} />
          <div className="text-right text-sm font-medium text-primary mt-1">
            %{fundingPercentage.toFixed(0)} fonlandı
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/ideas/${idea.id}`}>
            Detayları Görüntüle <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
