"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Layers, Plus } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { topicSchema, type TopicInput } from "@/lib/validation/content";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/loading";
import { Dropzone } from "@/components/shared/dropzone";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Topic } from "@/lib/api/types";

export default function TopicsPage() {
  const qc = useQueryClient();
  const [categoryId, setCategoryId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });

  const { data: topics = [], isLoading: loadingTopics } = useQuery({
    queryKey: qk.topics(categoryId),
    queryFn: () => practiceApi.topics(categoryId),
    enabled: Boolean(categoryId),
  });

  const form = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      accentColor: "",
      displayOrder: 0,
    },
  });

  const create = useMutation({
    mutationFn: (v: TopicInput) => {
      const fd = new FormData();
      fd.append("categoryId", v.categoryId);
      fd.append("name", v.name);
      if (v.description) fd.append("description", v.description);
      if (v.accentColor) fd.append("accentColor", v.accentColor);
      if (v.displayOrder != null)
        fd.append("displayOrder", String(v.displayOrder));
      if (image) fd.append("image", image);
      return practiceApi.createTopic(fd);
    },
    onSuccess: (_data, v) => {
      qc.invalidateQueries({ queryKey: qk.topics(v.categoryId) });
      qc.invalidateQueries({ queryKey: qk.categories });
      toast.success("Topic created.");
      form.reset({
        categoryId: v.categoryId,
        name: "",
        description: "",
        accentColor: "",
        displayOrder: 0,
      });
      setImage(null);
    },
    onError: toastApiError,
  });

  const columns = useMemo<ColumnDef<Topic>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.imageUrl ? (
              <Image
                src={row.original.imageUrl}
                alt={row.original.name}
                width={40}
                height={40}
                unoptimized
                className="size-10 rounded-lg border border-line object-cover"
              />
            ) : (
              <span
                className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface text-xs font-semibold text-muted"
                style={
                  row.original.accentColor
                    ? { backgroundColor: `${row.original.accentColor}1a` }
                    : undefined
                }
              >
                {row.original.name.slice(0, 2).toUpperCase()}
              </span>
            )}
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
        id: "sets",
        header: "Sets",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.setCount ?? 0}</Badge>
        ),
      },
    ],
    [],
  );

  function pickCategory(id: string) {
    setCategoryId(id);
    form.setValue("categoryId", id, { shouldValidate: true });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topics"
        subtitle="Topics live inside a category. Pick a category to view or create."
      />

      {loadingCategories ? null : categories.length === 0 ? (
        <EmptyState
          icon={<Layers />}
          title="Create a category first"
          message="Topics need a parent category before they can be created."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-3">
            <div className="max-w-xs">
              <Label className="mb-1.5 block">Category</Label>
              <Select value={categoryId} onValueChange={pickCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {categoryId ? (
              <DataTable
                columns={columns}
                data={topics}
                loading={loadingTopics}
                emptyMessage="No topics in this category yet."
              />
            ) : (
              <EmptyState
                icon={<Layers />}
                title="Select a category"
                message="Choose a category above to see its topics."
              />
            )}
            <p className="text-xs text-muted">
              Editing and deleting topics is coming soon.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="size-5 text-brand" /> Create topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit((v) => create.mutate(v))}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={form.watch("categoryId")} onValueChange={pickCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId ? (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.categoryId.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-name">Name</Label>
                  <Input id="t-name" {...form.register("name")} />
                  {form.formState.errors.name ? (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.name.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-desc">Description</Label>
                  <Textarea id="t-desc" rows={3} {...form.register("description")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="t-accent">Accent color</Label>
                    <Input
                      id="t-accent"
                      placeholder="#0c5bfe"
                      {...form.register("accentColor")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t-order">Display order</Label>
                    <Input id="t-order" type="number" {...form.register("displayOrder")} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Image (optional)</Label>
                  <Dropzone
                    onFile={setImage}
                    label="Upload topic image"
                    hint="PNG or JPG · up to 5MB"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={create.isPending}
                >
                  {create.isPending ? <Spinner /> : <Plus />} Create topic
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
