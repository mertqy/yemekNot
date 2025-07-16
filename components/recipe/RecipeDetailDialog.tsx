import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

interface RecipeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  note?: string;
  ingredients?: string[];
  category?: string;
  isFavorite?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
}

export function RecipeDetailDialog({
  open,
  onOpenChange,
  title,
  note,
  ingredients,
  category,
  isFavorite,
  onEdit,
  onDelete,
  onFavorite,
}: RecipeDetailDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 animate-fade-in" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 w-full max-w-[95vw] sm:p-8 md:p-12 md:max-w-2xl flex flex-col gap-6 animate-fade-in">
          <Dialog.Title className="text-3xl font-bold text-white mb-3">{title}</Dialog.Title>
          {category && (
            <span className="inline-block mb-3 px-4 py-1.5 rounded-full text-lg font-medium bg-zinc-700/60 text-zinc-200 w-fit">{category}</span>
          )}
          {note && (
            <div className="text-zinc-300 text-lg mb-3 whitespace-pre-line leading-relaxed">
              {note}
            </div>
          )}
          {ingredients && ingredients.length > 0 && ingredients.some(i => i.trim() !== "") && (
            <ul className="text-zinc-200 text-base mb-6 list-disc list-inside space-y-2">
              {ingredients.filter(i => i.trim() !== "").map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          )}
          <div className="flex gap-3 justify-end mt-6">
            {onFavorite && (
              <Button variant="ghost" className={isFavorite ? "text-yellow-300" : "text-yellow-400"} onClick={onFavorite}>
                {isFavorite ? "Favori ✓" : "Favori"}
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" className="text-blue-400" onClick={onEdit}>
                Düzenle
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" className="text-red-400" onClick={onDelete}>
                Sil
              </Button>
            )}
            <Dialog.Close asChild>
              <Button variant="secondary">Kapat</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 