"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { RequireAdmin } from "@/components/shared/route-guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { swipeQeleme } from "@/lib/qeleme/swipe";
import type { SwipeReport } from "@/lib/qeleme/swipe";

const CONFIRMATION = "SWIPE-QELEME";

export default function SwipePage() {
  const [confirm, setConfirm] = useState("");
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("");
  const [docsDeleted, setDocsDeleted] = useState(0);
  const [filesDeleted, setFilesDeleted] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SwipeReport | null>(null);

  const ready = confirm.trim() === CONFIRMATION && !running;

  const run = async () => {
    setRunning(true);
    setError(null);
    setReport(null);
    setDocsDeleted(0);
    setFilesDeleted(0);
    try {
      const result = await swipeQeleme((progress) => {
        setPhase(progress.phase);
        setDocsDeleted(progress.docsDeleted);
        setFilesDeleted(progress.filesDeleted);
      });
      setPhase("Done");
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Swipe failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <RequireAdmin>
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10">
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Swipe
            </h1>
            <p className="text-sm text-muted">
              Emergency wipe for the Qeleme app (Firestore + Storage). This is
              not in the sidebar — only reachable by this direct link.
            </p>
          </div>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="size-5" />
                Danger zone
              </CardTitle>
              <CardDescription>
                This permanently deletes{" "}
                <strong>everything</strong> in the Qeleme Firebase project:
                all Firestore documents (users, packages, config) and every
                file in Storage. There is no undo and no backup is taken.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="swipe-confirm">
                  Type <span className="font-mono text-red-600">{CONFIRMATION}</span> to
                  unlock the button
                </Label>
                <Input
                  id="swipe-confirm"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder={CONFIRMATION}
                  disabled={running}
                  className="font-mono"
                />
              </div>

              {running ? (
                <div className="rounded-lg border border-line bg-muted/30 p-4 text-sm text-ink">
                  <p className="font-medium">Wiping… {phase}</p>
                  <p className="mt-1 text-muted">
                    Firestore documents deleted: {docsDeleted.toLocaleString()}
                    <br />
                    Storage files deleted: {filesDeleted.toLocaleString()}
                  </p>
                </div>
              ) : null}

              {report ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">Swipe complete</p>
                  <p className="mt-1">
                    Collections: {report.collections.join(", ") || "none"}
                    <br />
                    Firestore documents deleted: {report.docsDeleted.toLocaleString()}
                    <br />
                    Storage files deleted: {report.filesDeleted.toLocaleString()}
                  </p>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <ConfirmDialog
                destructive
                title="Wipe all Qeleme data?"
                description="This deletes every Firestore document and every storage file in the Qeleme project. This cannot be undone."
                confirmLabel="Swipe Qeleme"
                onConfirm={run}
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={!ready}
                    className="w-full cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    Swipe Qeleme
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </RequireAdmin>
  );
}