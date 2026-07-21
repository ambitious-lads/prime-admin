"use client";

import { LogOut, ShieldAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/shared/loading";

export function LeaveSessionDialog({
  open,
  title = "Leave this session?",
  description,
  leaving = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  description: string;
  leaving?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && !leaving && onCancel()}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md">
        <AlertDialogHeader>
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={leaving}>Stay here</AlertDialogCancel>
          <AlertDialogAction onClick={(event) => { event.preventDefault(); onConfirm(); }} disabled={leaving} className="bg-red-600 text-white hover:bg-red-700">
            {leaving ? <Spinner /> : <LogOut className="h-4 w-4" />} Leave session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}