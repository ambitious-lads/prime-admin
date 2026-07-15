"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, FileText, Folder, Trash2 } from "lucide-react";
import { savedApi } from "@/lib/api/endpoints";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavedLibraryPage() {
  const [tab, setTab] = useState("questions");
  const [folderId, setFolderId] = useState<string>();
  const qc = useQueryClient();
  const questions = useQuery({ queryKey: ["saved", "questions"], queryFn: savedApi.questions });
  const folders = useQuery({ queryKey: ["saved", "folders"], queryFn: savedApi.folders });
  const notes = useQuery({
    queryKey: ["saved", "notes", folderId ?? "all"],
    queryFn: () => savedApi.notes(folderId),
  });
  const removeQuestion = useMutation({
    mutationFn: savedApi.unsaveQuestion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", "questions"] }),
  });
  const removeNote = useMutation({
    mutationFn: savedApi.deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved", "notes"] });
      qc.invalidateQueries({ queryKey: ["saved", "folders"] });
    },
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Saved Library" subtitle="Questions and notes you kept for revision." />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="questions"><Bookmark /> Questions</TabsTrigger>
          <TabsTrigger value="notes"><FileText /> Notes</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "questions" ? (
        questions.isLoading ? <RowsSkeleton /> : !questions.data?.length ? (
          <EmptyState title="No saved questions yet" message="Bookmark a practice question and it will appear here." />
        ) : (
          <div className="divide-y divide-line border-y border-line bg-white">
            {questions.data.map((question) => (
              <article key={question.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-brand">
                      {question.practiceSetTitle} · Question {question.orderIndex + 1}
                    </p>
                    <h2 className="mt-2 font-semibold leading-7 text-ink">{question.questionText}</h2>
                    <p className="mt-2 text-xs text-muted">{question.categoryName} / {question.topicName}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion.mutate(question.questionId)}>
                    <Bookmark className="fill-brand text-brand" />
                  </Button>
                </div>
                <div className="mt-4 border-l-2 border-brand bg-surface px-4 py-3 text-sm">
                  <p className="font-semibold text-ink">Answer: {question.correctOption}</p>
                  {question.explanation ? <p className="mt-1 leading-6 text-muted">{question.explanation}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <aside className="border-r border-line pr-4">
            <button onClick={() => setFolderId(undefined)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink">
              <Folder className="h-4 w-4 text-brand" /> All notes
            </button>
            {folders.data?.map((folder) => (
              <button key={folder.id} onClick={() => setFolderId(folder.id)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-muted hover:text-ink">
                <span>{folder.name}</span><span>{folder.notesCount}</span>
              </button>
            ))}
          </aside>
          <section className="divide-y divide-line border-y border-line bg-white">
            {notes.isLoading ? <RowsSkeleton /> : !notes.data?.length ? (
              <EmptyState title="No notes available" message="Save a Prime AI response to this folder." />
            ) : notes.data.map((note) => (
              <article key={note.id} className="group px-4 py-5 sm:px-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-brand">{note.folderName}</p>
                    <h2 className="mt-1 font-semibold text-ink">{note.title}</h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{note.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeNote.mutate(note.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
