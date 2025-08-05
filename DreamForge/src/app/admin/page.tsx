
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, DollarSign, CheckCircle2 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Genel Bakış</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Fikir Sayısı
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              Değerlendirilmeyi bekleyen 12 yeni fikir var.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kullanıcı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              Geçen aydan bu yana %180.1 artış
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Fonlama</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$240,198.00</div>
            <p className="text-xs text-muted-foreground">
              Platform genelinde toplanan toplam miktar.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fonlanan Projeler
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
            <p className="text-xs text-muted-foreground">
              Başarıyla fonlanıp üretime geçen projeler.
            </p>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Yönetici Paneline Hoş Geldiniz</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Burası platformdaki fikirleri, kullanıcıları ve diğer önemli metrikleri yöneteceğiniz merkezi kontrol panelinizdir. Kenar çubuğundaki menüyü kullanarak farklı yönetim bölümlerine erişebilirsiniz.</p>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
