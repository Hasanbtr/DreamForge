
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSkeleton
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Lightbulb, Settings, PanelLeft } from 'lucide-react';
import { Header } from '@/components/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading to show skeletons
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Settings className="size-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-sidebar-primary-foreground">
                Yönetici Paneli
              </p>
              <p className="text-xs text-sidebar-muted-foreground">
                DreamForge Yönetimi
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
           <SidebarMenu>
            {loading ? (
              <>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </>
            ) : (
                <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive('/admin')}
                    tooltip="Genel Bakış"
                  >
                    <Link href="/admin">
                      <LayoutDashboard />
                      <span>Genel Bakış</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive('/admin/ideas')}
                    tooltip="Fikirler"
                  >
                    <Link href="/admin/ideas">
                      <Lightbulb />
                      <span>Fikir Yönetimi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive('/admin/users')}
                    tooltip="Kullanıcılar"
                  >
                    <Link href="/admin/users">
                      <Users />
                      <span>Kullanıcı Yönetimi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    