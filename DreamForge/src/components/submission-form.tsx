// src/components/submission-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2 } from "lucide-react";
import { generateDescriptionAction } from "@/actions/generate-description";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import type { ProductIdea } from "@/lib/types";
import { addIdea } from "@/lib/data-service";
import { supabase } from "@/lib/supabase"; // Supabase istemcisini ekledik

const categories = ["Teknoloji", "Aletler", "Ev", "Yaşam Tarzı", "Sanat", "Verimlilik"];

const formSchema = z.object({
  name: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır."),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalıdır."),
  category: z.string({ required_error: "Lütfen bir kategori seçin." }),
  fundingGoal: z.coerce.number().positive("Fonlama hedefi pozitif bir sayı olmalıdır."),
  timeline: z.string().min(3, "Lütfen tahmini bir zaman çizelgesi belirtin."),
  keywords: z.string().optional(),
  photoFile: z.any().optional(), // Fotoğraf yükleme alanı
});

export function SubmissionForm() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designFileDataUrl, setDesignFileDataUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      fundingGoal: 10000,
      timeline: "",
      keywords: "",
    },
  });

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Yüklenen dosyayı form state'ine kaydet
      form.setValue("photoFile", file);
    }
  };

  const handleGenerateDescription = () => {
    const keywords = form.getValues("keywords");
    if (!keywords) {
      form.setError("keywords", {
        type: "manual",
        message: "Açıklama oluşturmak için lütfen anahtar kelimeler girin.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("keywords", keywords);
    if (designFileDataUrl) {
      formData.append("designFile", designFileDataUrl);
    }

    startTransition(async () => {
      const result = await generateDescriptionAction(formData);
      if (result.error) {
        toast({
            variant: "destructive",
            title: "Oluşturma Başarısız",
            description: result.error,
        });
      } else if (result.description) {
        form.setValue("description", result.description);
        toast({
            title: "Açıklama Oluşturuldu!",
            description: "Yapay zeka, ürününüz için yeni bir açıklama hazırladı.",
        });
      }
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Kimlik Doğrulanamadı",
            description: "Fikir göndermek için giriş yapmalısınız.",
        });
        return;
    }

    setIsSubmitting(true);

    try {
        let photoUrl: string | null = null;

        if (values.photoFile) {
            const file = values.photoFile as File;
            const fileName = `idea_photos/${user.id}-${Date.now()}-${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('idea-images') // Supabase bucket adınızı buraya girin
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) {
              toast({
                variant: "destructive",
                title: "Fotoğraf Yükleme Hatası",
                description: "Fikir fotoğrafı yüklenirken bir sorun oluştu.",
              });
              console.error("Fotoğraf yükleme hatası:", uploadError);
            } else if (uploadData?.path) {
              const { data: publicUrlData } = supabase.storage
                .from('idea-images')
                .getPublicUrl(uploadData.path);
              photoUrl = publicUrlData.publicUrl;
            }
        }

        const newIdeaData = {
            title: values.name,
            description: values.description,
            category: values.category as ProductIdea['category'],
            fundingGoal: values.fundingGoal,
            timeline: values.timeline,
            photoUrl: photoUrl,
        };

        const newIdea = await addIdea(newIdeaData, user);

        toast({
            title: "Fikir Gönderildi!",
            description: "Ürün fikriniz şimdi oylama için akışta yayında.",
        });

        router.push(`/ideas/${newIdea.id}`);
    } catch (error) {
        console.error("Error submitting idea: ", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        toast({
            variant: "destructive",
            title: "Hata",
            description: `Fikir gönderilirken bir sorun oluştu: ${errorMessage}`,
        });
    } finally {
        setIsSubmitting(false);
    }
}


  return (
      <Card>
        <CardHeader>
          <CardTitle>Yeni Fikir Gönder</CardTitle>
          <CardDescription>Ürün konseptinizi dünyayla paylaşmak için aşağıdaki ayrıntıları doldurun.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="örn. Modüler Akıllı Masa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YZ Asistanı Anahtar Kelimeleri</FormLabel>
                      <FormControl>
                          <Input placeholder="örn. ergonomik, özelleştirilebilir, minimalist, teknoloji" {...field} />
                      </FormControl>
                      <FormDescription>
                        Yapay zekamızın sizin için ilgi çekici bir ürün açıklaması oluşturması için anahtar kelimeler sağlayın.
                      </FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Açıklama Oluştur
                </Button>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Açıklaması</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ürününüzün özelliklerini, faydalarını ve onu benzersiz kılan şeyleri açıklayın." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bir kategori seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonlama Hedefi ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahmini Zaman Çizelgesi</FormLabel>
                      <FormControl>
                        <Input placeholder="örn. 6-8 ay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Fotoğrafı</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handlePhotoFileChange} />
                      </FormControl>
                      <FormDescription>
                        Ürününüzün bir fotoğrafını yükleyin (isteğe bağlı).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Fikri Gönder
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}