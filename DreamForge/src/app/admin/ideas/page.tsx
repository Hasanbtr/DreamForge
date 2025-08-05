
'use client'

import { useEffect, useState } from "react";
import { getIdeas } from "@/lib/data-service";
import type { ProductIdea } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminIdeasPage() {
    const [ideas, setIdeas] = useState<ProductIdea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIdeas = async () => {
            const allIdeas = await getIdeas();
            setIdeas(allIdeas);
            setLoading(false);
        };
        fetchIdeas();
    }, []);

    if (loading) {
        return (
             <div className="p-6">
                <Skeleton className="h-10 w-1/4 mb-4" />
                <Skeleton className="h-96 w-full" />
             </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Fikir Yönetimi</h1>
            <DataTable columns={columns} data={ideas} />
        </div>
    )
}
