// src/app/check-email/page.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">E-posta Adresini Kontrol Et</CardTitle>
          <CardDescription>
            Kaydını tamamlamak için e-posta adresine gönderdiğimiz doğrulama linkini kontrol et.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            E-postayı görmüyorsan, spam veya istenmeyen klasörünü kontrol etmeyi unutma.
          </p>
          <div className="mt-4">
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}