import { Button } from "../ui/button";
import { ReactNode } from "react";

const categoryColors: Record<string, string> = {
  "Ana Yemek": "bg-orange-700/70 text-orange-200",
  "Tatlı": "bg-pink-700/70 text-pink-100",
  "Çorba": "bg-green-700/70 text-green-100",
  "Salata": "bg-lime-700/70 text-lime-100",
  "Atıştırmalık": "bg-blue-700/70 text-blue-100",
};

interface RecipeCardProps {
  title: string;
  note?: string;
  ingredients?: string[];
  category?: string;
  isFavorite?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  actions?: ReactNode; // İstenirse custom action butonları
  onDetail?: () => void; // Detay modalı için
}

export function RecipeCard({
  title,
  note,
  ingredients,
  category,
  isFavorite,
  onEdit,
  onDelete,
  onFavorite,
  actions,
  onDetail,
}: RecipeCardProps) {
  const badgeClass = category && categoryColors[category]
    ? categoryColors[category]
    : "bg-zinc-700/60 text-zinc-200";

  return (
    <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-5 flex flex-col shadow-md w-full transition-all duration-200 hover:shadow-2xl hover:scale-[1.025] md:p-7 md:rounded-3xl">
      {category && (
        <span className={`inline-block mb-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit ${badgeClass} md:text-sm md:px-3 md:py-1`}>
          {category}
        </span>
      )}
      <span className="font-semibold text-lg mb-1 text-white truncate md:text-xl">{title}</span>
      {note && (
        <div
          className="text-zinc-300 text-[15px] mb-2 break-words block w-full whitespace-pre-line leading-relaxed md:text-base"
          style={{ minHeight: "24px" }}
        >
          {note}
        </div>
      )}
      {ingredients && ingredients.length > 0 && ingredients.some(i => i.trim() !== "") && (
        <ul className="text-zinc-200 text-sm mb-2 list-disc list-inside space-y-1 md:text-base">
          {ingredients.filter(i => i.trim() !== "").map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex gap-2 flex-wrap">
        {onEdit && (
          <Button variant="ghost" className="text-blue-400 px-2" onClick={onEdit}>
            Düzenle
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" className="text-red-400 px-2" onClick={onDelete}>
            Sil
          </Button>
        )}
        {onFavorite && (
          <Button
            variant="ghost"
            className={
              (isFavorite ? "text-yellow-300 " : "text-yellow-400 ") +
              "px-2 transition-transform duration-200 hover:scale-110"
            }
            onClick={onFavorite}
          >
            {isFavorite ? "Favori ✓" : "Favori"}
          </Button>
        )}
        {actions}
        {/* Detay butonu */}
        {onDetail && (
          <Button variant="secondary" className="px-2" onClick={onDetail}>
            Detay
          </Button>
        )}
      </div>
    </div>
  );
}
