
"use client"

import { ProductIdea } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { updateIdeaStatus } from "@/actions/update-idea-status"
import { useToast } from "@/components/ui/use-toast"

const StatusBadge = ({ status }: { status: ProductIdea['status'] }) => {
  switch (status) {
    case 'onaylandı':
      return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" />Onaylandı</Badge>
    case 'reddedildi':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Reddedildi</Badge>
    case 'beklemede':
    default:
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Beklemede</Badge>
  }
}

export const columns: ColumnDef<ProductIdea>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fikir Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />
  },
  {
    accessorKey: "author.name",
    header: "Oluşturan",
    cell: ({ row }) => {
        const author = row.original.author;
        return <div>{author.name}</div>
    }
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "fundingCurrent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full justify-end"
        >
          Fonlama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fundingCurrent"))
      const goal = row.original.fundingGoal
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      const percentage = goal > 0 ? (amount / goal) * 100 : 0;

      return (
        <div className="text-right font-medium">
          <div>{formatted}</div>
          <Badge variant={percentage >= 100 ? "default": "secondary"} className={`text-xs ${percentage >= 100 ? 'bg-green-600': ''}`}>
              %{percentage.toFixed(0)}
          </Badge>
        </div>
      )
    },
  },
   {
    accessorKey: "votes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           className="text-right w-full justify-end"
        >
          Oylar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-right">{row.getValue("votes")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const idea = row.original
      const { toast } = useToast()

      const handleStatusChange = async (status: ProductIdea['status']) => {
        const result = await updateIdeaStatus(idea.id, status);
        if (result.success) {
          toast({
            title: "Başarılı!",
            description: result.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Hata",
            description: result.error,
          });
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/ideas/${idea.id}`}>Fikri Görüntüle</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {idea.status !== 'onaylandı' && (
              <DropdownMenuItem onClick={() => handleStatusChange('onaylandı')}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Onayla
              </DropdownMenuItem>
            )}
            {idea.status !== 'reddedildi' && (
              <DropdownMenuItem onClick={() => handleStatusChange('reddedildi')} className="text-red-600 focus:text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Reddet
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
