"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  File as FileIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Dropzone } from "@/components/shared/dropzone";
import { RelativeTime } from "@/components/shared/formatting";
import { CardGridSkeleton, Spinner } from "@/components/shared/loading";
import { notesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { formatNumber } from "@/lib/utils/format";
import { toast } from "sonner";
import type { Note } from "@/lib/api/types";

function iconFor(mimeType: string | null) {
  const m = mimeType ?? "";
  const cls = "h-5 w-5";
  if (m.startsWith("image/")) return <FileImage className={cls} />;
  if (m.startsWith("video/")) return <FileVideo className={cls} />;
  if (m.includes("pdf") || m.startsWith("text/"))
    return <FileText className={cls} />;
  if (m.includes("zip") || m.includes("rar") || m.includes("compressed"))
    return <FileArchive className={cls} />;
  return <FileIcon className={cls} />;
}

function fileSizeLabel(bytes: number) {
  if (bytes >= 1024 * 1024)
    return `${formatNumber(Math.round((bytes / (1024 * 1024)) * 10) / 10)} MB`;
  if (bytes >= 1024) return `${formatNumber(Math.round(bytes / 1024))} KB`;
  return `${formatNumber(bytes)} B`;
}

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const notes = useQuery({ queryKey: qk.notes, queryFn: notesApi.list });

  const upload = useMutation({
    mutationFn: (fd: FormData) => notesApi.upload(fd),
    onSuccess: () => {
      toast.success("Note uploaded.");
      setFile(null);
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: qk.notes });
    },
    onError: toastApiError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => notesApi.remove(id),
    onSuccess: () => {
      toast.success("Note deleted.");
      queryClient.invalidateQueries({ queryKey: qk.notes });
    },
    onError: toastApiError,
  });

  function submit() {
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    if (title.trim()) fd.append("title", title.trim());
    if (description.trim()) fd.append("description", description.trim());
    upload.mutate(fd);
  }

  const list = notes.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        subtitle="Upload and keep your study files in one place."
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <Dropzone
            accept="*"
            maxSizeMb={50}
            imagePreview={false}
            onFile={setFile}
            label="Upload a note"
            hint="Drag & drop or click to browse · up to 50MB"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional title"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-description">Description</Label>
              <Textarea
                id="note-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="min-h-10"
                rows={1}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={submit} disabled={upload.isPending || !file}>
              {upload.isPending ? <Spinner /> : <Upload className="h-4 w-4" />}
              Upload note
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.isLoading ? (
        <CardGridSkeleton count={6} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No notes yet"
          message="Upload your first study file to get started."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => remove.mutate(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onDelete }: { note: Note; onDelete: () => void }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
            {iconFor(note.mimeType)}
          </span>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="text-muted hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Delete this note?"
            description="This permanently removes the file. This can't be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={onDelete}
          />
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 font-display text-sm font-bold text-ink hover:text-brand"
          >
            {note.title || note.fileName}
          </a>
          {note.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{note.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{fileSizeLabel(note.fileSize)}</span>
          <RelativeTime value={note.createdAt} />
        </div>
      </CardContent>
    </Card>
  );
}
