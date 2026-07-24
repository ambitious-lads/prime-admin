"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  ExternalLink,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  File as FileIcon,
  Search,
  StickyNote,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils/cn";

type NoteFilter = "all" | "documents" | "images" | "videos" | "other";

const NOTE_FILTERS: { id: NoteFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "documents", label: "Documents" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "other", label: "Other" },
];

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

function noteFilterFor(mimeType: string | null): Exclude<NoteFilter, "all"> {
  const mime = mimeType ?? "";
  if (mime.startsWith("image/")) return "images";
  if (mime.startsWith("video/")) return "videos";
  if (mime.includes("pdf") || mime.startsWith("text/")) return "documents";
  return "other";
}

function noteTypeLabel(note: Note) {
  const extension = note.fileName.split(".").pop();
  return extension && extension !== note.fileName
    ? extension.toUpperCase()
    : "FILE";
}

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");

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

  const list = useMemo(() => notes.data ?? [], [notes.data]);
  const filteredNotes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return list.filter((note) => {
      const matchesFilter =
        filter === "all" || noteFilterFor(note.mimeType) === filter;
      const matchesSearch =
        !search ||
        note.title?.toLowerCase().includes(search) ||
        note.description?.toLowerCase().includes(search) ||
        note.fileName.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [filter, list, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <StickyNote className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-black text-ink">Notes</h1>
            <p className="mt-1 text-sm leading-6 text-muted">
              Keep your PDFs, written material, images, and revision files in one place.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted">
          <BookOpen className="h-4 w-4 text-brand" />
          {list.length} {list.length === 1 ? "study note" : "study notes"}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-4">
          <div className="space-y-3 border-b border-line pb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes and file names"
                className="h-10 pl-9"
                aria-label="Search notes"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1" aria-label="Filter notes">
              {NOTE_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "h-8 shrink-0 cursor-pointer rounded-md px-3 text-xs font-bold transition-colors",
                    filter === item.id
                      ? "bg-brand text-white"
                      : "bg-surface text-muted hover:text-ink",
                  )}
                  aria-pressed={filter === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {notes.isLoading ? (
            <CardGridSkeleton count={6} />
          ) : list.length === 0 ? (
            <EmptyState
              icon={<FileText />}
              title="Your notebook is empty"
              message="Add your first study file using the upload panel."
            />
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              icon={<Search />}
              title="No matching notes"
              message="Try another search or file type."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={() => remove.mutate(note.id)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="order-first xl:order-last xl:self-start">
          <div className="space-y-4 rounded-lg border border-line bg-white p-5 xl:sticky xl:top-24">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Add a study note</h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                Upload a file and give it a useful title for revision.
              </p>
            </div>
            <Dropzone
              accept="*"
              maxSizeMb={50}
              imagePreview={false}
              onFile={setFile}
              label="Choose a study file"
              hint="PDF, image, video, text, or archive · up to 50MB"
            />
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Algebra revision"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-description">Description</Label>
              <Textarea
                id="note-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this note about?"
                className="min-h-24 resize-none"
                rows={4}
              />
            </div>
            <Button
              className="w-full cursor-pointer"
              onClick={submit}
              disabled={upload.isPending || !file}
            >
              {upload.isPending ? <Spinner /> : <Upload className="h-4 w-4" />}
              Add to notes
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NoteCard({ note, onDelete }: { note: Note; onDelete: () => void }) {
  return (
    <article className="group flex min-h-48 flex-col rounded-lg border border-line bg-white p-4 transition-colors hover:border-brand/40 hover:bg-brand-50/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
            {iconFor(note.mimeType)}
          </span>
          <span className="rounded bg-surface px-2 py-1 text-[10px] font-black text-muted">
            {noteTypeLabel(note)}
          </span>
        </div>
        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer text-muted hover:text-red-600"
              aria-label={`Delete ${note.title || note.fileName}`}
            >
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
      <a
        href={note.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex flex-1 cursor-pointer flex-col"
      >
        <h2 className="line-clamp-2 font-display text-base font-bold leading-6 text-ink transition-colors group-hover:text-brand">
          {note.title || note.fileName}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
          {note.description || "Open this file to review your study material."}
        </p>
        <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-bold text-brand">
          Open note <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span>{fileSizeLabel(note.fileSize)}</span>
        <RelativeTime value={note.createdAt} />
      </div>
    </article>
  );
}
