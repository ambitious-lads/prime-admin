"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { FolderTree, Plus } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { categorySchema, type CategoryInput } from "@/lib/validation/content";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Spinner } from "@/components/shared/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Category } from "@/lib/api/types";

export default function CategoriesPage() {
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      iconName: "",
      accentColor: "",
      displayOrder: 0,
    },
  });

  const create = useMutation({
    mutationFn: (v: CategoryInput) => practiceApi.createCategory(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.categories });
      toast.success("Category created.");
      form.reset();
    },
    onError: toastApiError,
  });

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.accentColor ? (
              <span
                className="size-3 rounded-full border border-line"
                style={{ backgroundColor: row.original.accentColor }}
              />
            ) : null}
            <span className="font-semibold text-ink">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-sm text-muted">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "displayOrder",
        header: "Order",
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-muted">
            {row.original.displayOrder ?? "—"}
          </span>
        ),
      },
      {
        id: "topics",
        header: "Topics",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.topicCount ?? 0}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Top level of the content hierarchy."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <DataTable
            columns={columns}
            data={categories}
            loading={isLoading}
            emptyMessage="No categories yet. Create one to get started."
          />
          <p className="text-xs text-muted">
            Editing and deleting categories is coming soon — the backend does not
            expose those endpoints yet.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="size-5 text-brand" /> Create category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit((v) => create.mutate(v))}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...form.register("description")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="iconName">Icon name</Label>
                  <Input
                    id="iconName"
                    placeholder="e.g. Calculator"
                    {...form.register("iconName")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accentColor">Accent color</Label>
                  <Input
                    id="accentColor"
                    placeholder="#0c5bfe"
                    {...form.register("accentColor")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="displayOrder">Display order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  {...form.register("displayOrder")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? <Spinner /> : <Plus />} Create category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
