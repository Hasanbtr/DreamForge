'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Target, Lightbulb, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalyzeIdeaOutput } from "@/ai/flows/analyze-idea";

interface AIAnalysisProps {
  analysis: AnalyzeIdeaOutput | null;
}

export function AIAnalysis({ analysis }: AIAnalysisProps) {
  if (!analysis) {
    return null;
  }

  const { marketability, suggestions, targetAudience } = analysis;

  const getBadgeVariant = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 5) return "default";
    return "destructive";
  };
  
  const getBadgeClass = (score: number) => {
    if (score >= 8) return "bg-green-600 hover:bg-green-700";
    if (score >= 5) return "bg-primary/90";
    return "bg-destructive/90";
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          <span>Yapay Zeka Fikir Analizi</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold">Pazarlanabilirlik Puanı</h3>
          <Badge className={`text-lg py-1 px-3 text-white ${getBadgeClass(marketability)}`}>
            {marketability}/10
          </Badge>
        </div>
        
        <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Target /> Hedef Kitle</h3>
            <p className="text-muted-foreground">{targetAudience}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Lightbulb /> Geliştirme Önerileri</h3>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
