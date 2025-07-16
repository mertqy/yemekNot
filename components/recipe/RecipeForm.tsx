import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const exampleCategories = [
  "Ana Yemek",
  "Tatlı",
  "Çorba",
  "Salata",
  "Atıştırmalık",
];

interface RecipeFormProps {
  initialTitle?: string;
  initialNote?: string;
  initialIngredients?: string[];
  initialCategory?: string;
  onSubmit: (data: { title: string; note: string; ingredients: string[]; category: string }) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function RecipeForm({
  initialTitle = "",
  initialNote = "",
  initialIngredients = [""],
  initialCategory = "",
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Kaydet",
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote);
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [category, setCategory] = useState(initialCategory);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // Autosize textarea
  useEffect(() => {
    if (noteRef.current) {
      noteRef.current.style.height = "auto";
      noteRef.current.style.height = noteRef.current.scrollHeight + "px";
    }
  }, [note]);

  const handleIngredientChange = (idx: number, value: string) => {
    setIngredients(ings => ings.map((ing, i) => (i === idx ? value : ing)));
  };

  const handleAddIngredient = () => {
    setIngredients(ings => [...ings, ""]);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ings => ings.length > 1 ? ings.filter((_, i) => i !== idx) : ings);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__custom__") {
      setShowCustomCategory(true);
      setCategory("");
    } else {
      setShowCustomCategory(false);
      setCategory(e.target.value);
      setCustomCategory("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalCategory = showCustomCategory && customCategory.trim() ? customCategory : category;
    onSubmit({
      title,
      note,
      ingredients: ingredients.filter(i => i.trim() !== ""),
      category: finalCategory || "",
    });
    setTitle("");
    setNote("");
    setIngredients([""]);
    setCategory("");
    setCustomCategory("");
    setShowCustomCategory(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 flex flex-col gap-3">
      <Input
        placeholder="Tarif Başlığı"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <textarea
        ref={noteRef}
        placeholder="Not (isteğe bağlı)"
        value={note}
        onChange={e => setNote(e.target.value)}
        disabled={loading}
        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none resize-y overflow-hidden"
        rows={2}
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-400">Malzemeler</span>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              placeholder={`Malzeme #${idx + 1}`}
              value={ing}
              onChange={e => handleIngredientChange(idx, e.target.value)}
              disabled={loading}
            />
            <Button type="button" variant="ghost" className="text-red-400 px-2" onClick={() => handleRemoveIngredient(idx)} disabled={loading || ingredients.length === 1}>
              Sil
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={handleAddIngredient} disabled={loading}>
          + Malzeme Ekle
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-400">Kategori</span>
        <select
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none"
          value={showCustomCategory ? "__custom__" : category}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <option value="">Kategori seçin...</option>
          {exampleCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="__custom__">+ Yeni kategori ekle</option>
        </select>
        {showCustomCategory && (
          <Input
            placeholder="Yeni kategori adı"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
            disabled={loading}
          />
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Button type="submit" variant="default" disabled={loading}>
          {loading ? "Kaydediliyor..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            İptal
          </Button>
        )}
      </div>
    </form>
  );
} 