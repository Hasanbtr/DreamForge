DreamForge
DreamForge, topluluk odaklı bir fikir doğrulama ve geliştirme platformudur. Kullanıcıların ürün fikirleri sunmasına, bu fikirleri oylamasına ve yapay zeka desteğiyle geliştirmesine olanak tanır. Fikirler yeterli oya ulaştığında, üretime geçerek ön sipariş veya satın alma için sunulur.

Özellikler
Kullanıcı Yönetimi: E-posta ile güvenli giriş ve kayıt sistemi.

Fikir Gönderme: Herkesin kolayca yeni fikirlerini açıklamasıyla birlikte paylaşabilmesi.

Topluluk Oylaması: Fikirlerin popülaritesini belirlemek için basit ve etkili bir oylama sistemi.

Yapay Zeka ile Fikir Geliştirme: Kullanıcıların kısa fikir açıklamalarını daha detaylı ve profesyonel metinlere dönüştürme özelliği.

Yapay Zeka ile Yorum Analizi: Yorumlardaki ana temaları, olumlu ve olumsuz geri bildirimleri özetleyerek fikir sahiplerine içgörü sunma.

Ön Sipariş ve Satış: Üretime geçen fikirler için ön sipariş toplama ve basit satın alma işlevselliği.

Duyarlı Tasarım (Responsive Design): Mobil ve masaüstü cihazlarda sorunsuz bir kullanıcı deneyimi.

Kullanılan Teknolojiler
Next.js: Sunucu tarafı render (SSR) ve dosya tabanlı yönlendirme için React çerçevesi.

React: Kullanıcı arayüzü oluşturmak için temel kütüphane.

Supabase: Veritabanı (PostgreSQL) ve kimlik doğrulama çözümü.

Google Gemini API: Yapay zeka destekli metin geliştirme ve analiz için.

Shadcn/ui: Erişilebilirlik odaklı ve özelleştirilebilir UI bileşenleri.

Tailwind CSS: Hızlı ve kolay stil oluşturmak için CSS çerçevesi.

Kurulum
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

Depoyu Klonlayın:

Bash

git clone https://github.com/Hasanbtr/DreamForge
cd DreamForge
Bağımlılıkları Yükleyin:

Bash

npm install
Ortam Değişkenlerini Ayarlayın:
Projenizin kök dizininde .env.local adında bir dosya oluşturun ve Supabase ile Google Gemini API anahtarlarınızı ekleyin.

Kod snippet'i

# .env.local
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="yyy"
GEMINI_API_KEY="zzz"
Uygulamayı Çalıştırın:
Geliştirme sunucusunu başlatın.

Bash

npm run dev
Tarayıcınızda http://localhost:3000 adresini ziyaret ederek uygulamayı görebilirsiniz.

Yol Haritası
Akıllı Ürün Önerileri: Kullanıcı davranışlarına dayalı yapay zeka destekli ürün önerileri.

Tam teşekküllü e-ticaret entegrasyonu: Stripe gibi bir ödeme geçidi ekleme.

Kullanıcı profilleri: Kullanıcıların kendi fikirlerini ve yorumlarını tek bir sayfada yönetebilmesi.
