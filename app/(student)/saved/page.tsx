"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, ChevronRight, FileText, Folder, Pencil, Trash2 } from "lucide-react";
import { savedApi } from "@/lib/api/endpoints";
import type { SavedAiNote } from "@/lib/api/types";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton, Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

export default function SavedLibraryPage() {
  const [tab, setTab] = useState("questions");
  const [folderId, setFolderId] = useState<string>();
  const [selectedNote, setSelectedNote] = useState<SavedAiNote | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteFolderId, setNoteFolderId] = useState("");
  const qc = useQueryClient();

  const questions = useQuery({ queryKey: ["saved", "questions"], queryFn: savedApi.questions });
  const folders = useQuery({ queryKey: ["saved", "folders"], queryFn: savedApi.folders });
  const notes = useQuery({ queryKey: ["saved", "notes", folderId ?? "all"], queryFn: () => savedApi.notes(folderId) });

  const removeQuestion = useMutation({
    mutationFn: savedApi.unsaveQuestion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", "questions"] }),
  });
  const removeNote = useMutation({
    mutationFn: savedApi.deleteNote,
    onSuccess: () => {
      setSelectedNote(null);
      qc.invalidateQueries({ queryKey: ["saved", "notes"] });
      qc.invalidateQueries({ queryKey: ["saved", "folders"] });
    },
  });
  const updateNote = useMutation({
    mutationFn: () => savedApi.updateNote(selectedNote!.id, { title: noteTitle.trim(), content: noteContent.trim(), folderId: noteFolderId }),
    onSuccess: () => {
      setSelectedNote(null);
      qc.invalidateQueries({ queryKey: ["saved", "notes"] });
      qc.invalidateQueries({ queryKey: ["saved", "folders"] });
    },
  });


  function openNote(note: SavedAiNote) {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteFolderId(note.folderId);
  }
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div><h1 className="font-display text-xl font-black text-ink">Saved Library</h1><p className="mt-1 text-sm text-muted">Review saved questions and organize Prime AI notes.</p></div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="questions"><Bookmark /> Questions</TabsTrigger>
          <TabsTrigger value="notes"><FileText /> Notes</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "questions" ? (
        questions.isLoading ? <RowsSkeleton /> : !questions.data?.length ? (
          <EmptyState icon={<Bookmark />} title="No saved questions yet" message="Save a practice question and it will appear here." />
        ) : (
          <div className="space-y-3">
            {questions.data.map((question) => (
              <article key={question.id} className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0"><p className="text-xs font-bold text-brand">{question.practiceSetTitle} · Question {question.orderIndex + 1}</p><h2 className="mt-2 font-bold leading-7 text-ink">{question.questionText}</h2><p className="mt-2 text-xs font-medium text-muted">{question.categoryName} / {question.topicName}</p></div>
                  <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={() => removeQuestion.mutate(question.questionId)} disabled={removeQuestion.isPending}><Bookmark className="fill-brand text-brand" /></Button>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const correct = option.label === question.correctOption;
                    return <div key={option.label} className={cn("flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm", correct ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-line bg-surface/40 text-ink")}><span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black", correct ? "bg-emerald-100 text-emerald-700" : "bg-white text-muted")}>{option.label}</span><span className="min-w-0 flex-1 leading-6">{option.text}</span>{correct ? <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" /> : null}</div>;
                  })}
                </div>
                {question.explanation ? <div className="mt-4 rounded-xl border-l-2 border-brand bg-brand-50/50 px-4 py-3"><p className="text-xs font-black uppercase text-brand">Explanation</p><p className="mt-1 text-sm leading-6 text-ink/80">{question.explanation}</p></div> : null}
              </article>
            ))}
          </div>
        )
      ) : (
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="self-start overflow-hidden rounded-2xl border border-line bg-white p-2">
            <button type="button" onClick={() => setFolderId(undefined)} className={cn("flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-bold", !folderId ? "bg-brand-50 text-brand" : "text-ink hover:bg-surface")}><Folder className="h-4 w-4" /> All notes</button>
            {folders.data?.map((folder) => <button type="button" key={folder.id} onClick={() => setFolderId(folder.id)} className={cn("flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm", folderId === folder.id ? "bg-brand-50 font-bold text-brand" : "text-muted hover:bg-surface hover:text-ink")}><span className="truncate">{folder.name}</span><span className="text-xs font-bold">{folder.notesCount}</span></button>)}
          </aside>
          <section className="space-y-3">
            {notes.isLoading ? <RowsSkeleton /> : !notes.data?.length ? (
              <EmptyState icon={<FileText />} title="No notes available" message="Save a Prime AI response to this folder." />
            ) : notes.data.map((note) => (
              <button type="button" key={note.id} onClick={() => openNote(note)} className="group flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 text-left transition-colors hover:border-brand/30 hover:bg-brand-50/20 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand"><FileText className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="text-xs font-bold text-brand">{note.folderName}</span><span className="mt-1 block font-black text-ink">{note.title}</span><span className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted">{note.content}</span></span>
                <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </section>
        </div>
      )}

      <Dialog open={Boolean(selectedNote)} onOpenChange={(open) => !open && setSelectedNote(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-brand" /> Edit saved note</DialogTitle><DialogDescription>Update the note content or move it to another folder.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="saved-note-title">Title</Label><Input id="saved-note-title" value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} maxLength={160} /></div>
            <div className="space-y-1.5"><Label htmlFor="saved-note-folder">Folder</Label><Select value={noteFolderId} onValueChange={setNoteFolderId}><SelectTrigger id="saved-note-folder"><SelectValue placeholder="Choose folder" /></SelectTrigger><SelectContent>{folders.data?.map((folder) => <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label htmlFor="saved-note-content">Content</Label><Textarea id="saved-note-content" value={noteContent} onChange={(event) => setNoteContent(event.target.value)} rows={12} className="resize-y leading-7" /></div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button type="button" variant="outline" className="cursor-pointer text-red-600 hover:bg-red-50" onClick={() => selectedNote && removeNote.mutate(selectedNote.id)} disabled={removeNote.isPending}>{removeNote.isPending ? <Spinner /> : <Trash2 />} Delete note</Button><div className="flex gap-2"><Button type="button" variant="ghost" onClick={() => setSelectedNote(null)}>Cancel</Button><Button type="button" className="cursor-pointer" onClick={() => updateNote.mutate()} disabled={!noteTitle.trim() || !noteContent.trim() || !noteFolderId || updateNote.isPending}>{updateNote.isPending ? <Spinner /> : null} Save changes</Button></div></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}