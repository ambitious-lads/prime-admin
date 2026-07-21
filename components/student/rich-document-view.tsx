"use client";

import { cn } from "@/lib/utils/cn";
import type { RichContentBlock, RichDocument, RichInline } from "@/lib/api/types";

function InlineContent({ children }: { children: RichInline[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
      {children.map((child, index) =>
        child.type === "text" ? (
          <span
            key={`text-${index}`}
            className={cn(
              child.bold && "font-bold",
              child.italic && "italic",
              child.superscript && "align-super text-[0.7em]",
              child.subscript && "align-sub text-[0.7em]",
            )}
          >
            {child.text}
          </span>
        ) : (
          <img
            key={`inline-image-${index}`}
            src={child.uri}
            alt={child.alt || "Equation"}
            width={child.width}
            height={child.height}
            className={cn(
              "inline-block max-w-full object-contain align-middle",
              child.role === "equation" ? "max-h-8" : "max-h-32",
            )}
          />
        ),
      )}
    </span>
  );
}

function Block({ block }: { block: RichContentBlock }) {
  if (block.type === "paragraph") {
    return <p className="text-base leading-7 text-ink"><InlineContent>{block.children}</InlineContent></p>;
  }
  if (block.type === "figure") {
    return (
      <figure className="space-y-2">
        <img src={block.uri} alt={block.alt || "Geometry figure"} className="mx-auto max-h-[34rem] max-w-full rounded-lg object-contain" />
        {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="px-3 py-2 text-left text-sm text-muted">{block.caption}</caption>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={rowIndex < (block.headerRows || 0) ? "bg-surface font-semibold" : ""}>
              {row.cells.map((cell, cellIndex) => (
                <td key={`cell-${cellIndex}`} colSpan={cell.colSpan} rowSpan={cell.rowSpan} className="border border-line px-3 py-2 align-top">
                  <div className="space-y-2">{cell.blocks.map((cellBlock, blockIndex) => <Block key={`block-${blockIndex}`} block={cellBlock} />)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RichDocumentView({ document }: { document?: RichDocument | null }) {
  if (!document?.blocks?.length) return null;
  return <div className="protected-content space-y-3" onCopy={(event) => event.preventDefault()} onCut={(event) => event.preventDefault()} onContextMenu={(event) => event.preventDefault()} onDragStart={(event) => event.preventDefault()}>{document.blocks.map((block, index) => <Block key={`rich-block-${index}`} block={block} />)}</div>;
}
