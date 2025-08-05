// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState } from "react";
import { getUsers } from "@/lib/data-service";
import type { Profile } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // DataTable bileşeninin projenizde mevcut olduğunu varsayıyoruz.
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Kullanıcılar</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={users} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}