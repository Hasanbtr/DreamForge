// app/ideas/page.tsx

import { getIdeas } from "@/lib/data-service";
import { Suspense } from "react";
import Link from "next/link";
import Image from 'next/image';

const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/?d=retro&s=200';
const DEFAULT_IDEA_PHOTO_URL = 'https://picsum.photos/600/400';

// Fikir kartını render eden bileşen
function IdeaCard({ idea }: { idea: any }) {
  const authorName = (idea.author && idea.author.name) || 'Bilinmeyen Kullanıcı';
  const authorAvatar = (idea.author && idea.author.avatar_url) || DEFAULT_AVATAR_URL;
  const ideaPhoto = idea.photo_url || DEFAULT_IDEA_PHOTO_URL;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
      <Link href={`/ideas/${idea.id}`}>
        {/*
          Buradaki div'e hem relative hem de sabit bir yükseklik verdik.
          aspect-ratio yerine "h-48" gibi sabit bir değer kullanmak daha garantidir.
        */}
        <div className="cursor-pointer relative h-48 md:h-56 lg:h-64">

<Image
  src={idea.photo_url || "/placeholder.png"}
  alt={idea.product_name} // Veya idea.title ya da idea.description kullanabilirsiniz
  width={300}
  height={200}
  // ...
/>
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
            <h3 className="font-bold text-lg text-gray-800">{idea.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{idea.description}</p>
            <div className="flex items-center mt-2">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{authorName}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Ana fikirler sayfasını render eden bileşen
export default async function IdeasPage() {
  const ideas = await getIdeas();
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Fikirler</h1>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.length > 0 ? (
            ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))
          ) : (
            <p className="text-gray-500">Henüz gönderilmiş bir fikir yok. İlk fikir sizin olsun!</p>
          )}
        </div>
      </Suspense>
    </main>
  );
}