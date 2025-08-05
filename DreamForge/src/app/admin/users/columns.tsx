// src/app/admin/users/columns.tsx

import { ColumnDef } from "@tanstack/react-table";
import { Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const columns: ColumnDef<Profile>[] = [
    {
        accessorKey: "name",
        header: "İsim",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.avatar_url ?? undefined} />
                    <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "E-posta",
    },
    {
        accessorKey: "role",
        header: "Rol",
        cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>
    },
    {
        accessorKey: "created_at",
        header: "Kayıt Tarihi",
        cell: ({ row }) => {
            const date = row.original.created_at;
            if (!date) return 'Tarih yok';
            return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: tr });
        },
    },
];