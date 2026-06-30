"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

type DropzoneProps = {
  accept?: string;
  maxSizeMb?: number;
  imagePreview?: boolean;
  onFile: (file: File | null) => void;
  label?: string;
  hint?: string;
};

export function Dropzone({
  accept = "image/*",
  maxSizeMb = 5,
  imagePreview = true,
  onFile,
  label = "Upload a file",
  hint,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File | null) {
    if (!file) return;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File must be under ${maxSizeMb}MB.`);
      return;
    }
    setFileName(file.name);
    if (imagePreview && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    onFile(file);
  }

  function clear() {
    setPreview(null);
    setFileName(null);
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-brand bg-brand-50/50" : "border-line hover:border-brand/40 hover:bg-surface",
        )}
      >
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={240}
              height={240}
              className="max-h-48 w-auto rounded-xl border border-line object-contain"
              unoptimized
            />
          </div>
        ) : (
          <>
            <UploadCloud className="mb-3 h-8 w-8 text-brand" />
            <p className="text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-xs text-muted">
              {hint ?? `Drag & drop or click to browse · up to ${maxSizeMb}MB`}
            </p>
          </>
        )}
        {fileName && (
          <p className="mt-3 truncate text-xs font-medium text-muted">{fileName}</p>
        )}
      </div>
      {fileName && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
        >
          <X className="h-3 w-3" /> Remove file
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
