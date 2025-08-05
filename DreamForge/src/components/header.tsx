// src/components/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Çıkış Yapılamadı',
        description: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.',
      });
      console.error('Çıkış hatası:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            DreamForge
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            href="/ideas"
          >
            Fikirler
          </Link>
          {user && (
            <Link
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              href="/submit"
            >
              Fikir Ekle
            </Link>
          )}
        </nav>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.user_metadata?.name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.user_metadata?.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                Panel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={isSigningOut}>
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/signup">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}