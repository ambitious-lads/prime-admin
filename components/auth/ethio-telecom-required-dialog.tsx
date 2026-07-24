"use client";

import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EthioTelecomRequiredDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <Smartphone className="h-5 w-5" />
          </div>
          <DialogTitle>Use an Ethio Telecom number</DialogTitle>
          <DialogDescription className="leading-6">
            SMS verification currently works with Ethio Telecom numbers only.
            Enter a phone number starting with 09 to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Enter another number
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
