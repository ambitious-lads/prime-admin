"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/loading";

export function SubmitDialog({
  trigger,
  unanswered,
  total,
  submitting,
  onConfirm,
}: {
  trigger: React.ReactNode;
  unanswered: number;
  total: number;
  submitting: boolean;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit exam?</DialogTitle>
          <DialogDescription>
            {unanswered > 0
              ? `You have ${unanswered} of ${total} question${total === 1 ? "" : "s"} unanswered. You won't be able to change your answers after submitting.`
              : "You've answered every question. You won't be able to change your answers after submitting."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Keep working
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? <Spinner /> : null}
            Submit exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
