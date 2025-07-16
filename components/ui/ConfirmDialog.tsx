import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title = "Emin misiniz?",
  description = "Bu işlemi geri alamazsınız.",
  confirmText = "Evet, sil",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v: boolean) => !v && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 animate-fade-in" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-4 animate-fade-in">
          <Dialog.Title className="text-lg font-semibold text-white mb-1">{title}</Dialog.Title>
          <Dialog.Description className="text-zinc-300 text-sm mb-3">{description}</Dialog.Description>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={onCancel} disabled={loading}>{cancelText}</Button>
            <Button variant="destructive" onClick={onConfirm} disabled={loading}>{confirmText}</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 