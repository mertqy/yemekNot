"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PersonalRecipe } from "../../../lib/interfaces";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RecipeDetailDialog } from "@/components/recipe/RecipeDetailDialog";

const exampleCategories = [
  "Ana Yemek",
  "Tatlı",
  "Çorba",
  "Salata",
  "Atıştırmalık",
];

export default function BireyselPanel() {
  const dummyUser = "Demo Kullanıcı";
  const [recipes, setRecipes] = useState<PersonalRecipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [detailRecipeId, setDetailRecipeId] = useState<number | null>(null);

  // Kategorileri: sistemde tanımlı + tariflerden gelenler (tekrarsız)
  const categories = useMemo(() => {
    const userCats = recipes.map(r => r.category).filter(Boolean) as string[];
    return Array.from(new Set([...exampleCategories, ...userCats]));
  }, [recipes]);

  // Ekle veya düzenle
  const handleSave = ({ title, note, ingredients, category }: { title: string; note: string; ingredients: string[]; category: string }) => {
    if (editId) {
      setRecipes(recipes => recipes.map(r => r.id === editId ? { ...r, title, note, ingredients, category } : r));
      setEditId(null);
      toast.success("Tarif güncellendi!");
    } else {
      const newRecipe: PersonalRecipe = {
        id: Date.now(),
        userId: 1,
        title,
        note,
        ingredients,
        category,
      };
      setRecipes([...recipes, newRecipe]);
      toast.success("Tarif eklendi!");
    }
    setShowForm(false);
  };

  // Sil
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      setRecipes(recipes => recipes.filter(r => r.id !== confirmDeleteId));
      setFavoriteIds(favs => favs.filter(fid => fid !== confirmDeleteId));
      toast.success("Tarif silindi!");
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Favori
  const handleFavorite = (id: number) => {
    setFavoriteIds(favs => {
      const isFav = favs.includes(id);
      const newFavs = isFav ? favs.filter(fid => fid !== id) : [...favs, id];
      toast.success(isFav ? "Favorilerden çıkarıldı." : "Favorilere eklendi!");
      return newFavs;
    });
  };

  // Düzenle
  const handleEdit = (id: number) => {
    setEditId(id);
    setShowForm(true);
  };

  // Formu kapat
  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
  };

  const editingRecipe = recipes.find(r => r.id === editId);
  const selectedRecipe = recipes.find(r => r.id === detailRecipeId);

  // Arama, kategori ve favori filtresi birlikte çalışsın
  const filteredRecipes = recipes.filter(r => {
    const q = search.toLowerCase();
    const matchesCategory = !categoryFilter || r.category === categoryFilter;
    const matchesFavorite = !showFavorites || favoriteIds.includes(r.id);
    const matchesSearch =
      r.title.toLowerCase().includes(q) ||
      (r.note && r.note.toLowerCase().includes(q)) ||
      (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(q))) ||
      (r.category && r.category.toLowerCase().includes(q));
    return matchesCategory && matchesFavorite && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row gap-8">
      {/* Sol Panel: Filtreler */}
      <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 sticky top-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Filtreler</h2>
            <Input
              placeholder="Tariflerde ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          <div>
            <h3 className="text-sm text-zinc-400 mb-1">Kategoriler</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                size="sm"
                variant={!categoryFilter ? "default" : "secondary"}
                onClick={() => setCategoryFilter("")}
              >
                Tümü
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  size="sm"
                  variant={categoryFilter === cat ? "default" : "secondary"}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant={showFavorites ? "default" : "secondary"}
              onClick={() => setShowFavorites(fav => !fav)}
              className="w-full"
            >
              {showFavorites ? "Tüm Tarifler" : "Favoriler"}
            </Button>
          </div>
        </div>
      </aside>
      {/* Sağ Panel: Tarifler ve Form */}
      <section className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Hoş geldin, {dummyUser}!</h1>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Tariflerin</h2>
          <Button onClick={() => { setShowForm(true); setEditId(null); }}>
            + Tarif Ekle
          </Button>
        </div>
        {showForm && (
          <RecipeForm
            initialTitle={editingRecipe?.title}
            initialNote={editingRecipe?.note}
            initialIngredients={editingRecipe?.ingredients ?? [""]}
            initialCategory={editingRecipe?.category ?? ""}
            onSubmit={handleSave}
            onCancel={handleCancel}
            submitLabel={editId ? "Güncelle" : "Ekle"}
          />
        )}
        <ul className="space-y-4">
          {filteredRecipes.map(recipe => (
            <li key={recipe.id}>
              <RecipeCard
                title={recipe.title}
                note={recipe.note}
                ingredients={recipe.ingredients}
                category={recipe.category}
                isFavorite={favoriteIds.includes(recipe.id)}
                onEdit={() => handleEdit(recipe.id)}
                onDelete={editId === recipe.id ? undefined : () => handleDelete(recipe.id)}
                onFavorite={() => handleFavorite(recipe.id)}
                onDetail={() => setDetailRecipeId(recipe.id)}
              />
            </li>
          ))}
        </ul>
        <RecipeDetailDialog
          open={detailRecipeId !== null && !!selectedRecipe}
          onOpenChange={open => setDetailRecipeId(open && selectedRecipe ? selectedRecipe.id : null)}
          title={selectedRecipe?.title || ""}
          note={selectedRecipe?.note}
          ingredients={selectedRecipe?.ingredients}
          category={selectedRecipe?.category}
          isFavorite={selectedRecipe ? favoriteIds.includes(selectedRecipe.id) : false}
          onEdit={selectedRecipe ? () => { setEditId(selectedRecipe.id); setShowForm(true); setDetailRecipeId(null); } : undefined}
          onDelete={selectedRecipe ? () => { handleDelete(selectedRecipe.id); setDetailRecipeId(null); } : undefined}
          onFavorite={selectedRecipe ? () => handleFavorite(selectedRecipe.id) : undefined}
        />
        <ConfirmDialog
          open={confirmDeleteId !== null}
          title="Tarifi silmek istediğinize emin misiniz?"
          description="Bu işlem geri alınamaz."
          confirmText="Evet, sil"
          cancelText="İptal"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-12 gap-4 animate-fade-in">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
              <ellipse cx="60" cy="100" rx="32" ry="8" fill="#27272a" />
              <rect x="30" y="30" width="60" height="50" rx="12" fill="#3f3f46" />
              <rect x="40" y="40" width="40" height="8" rx="4" fill="#71717a" />
              <rect x="40" y="54" width="40" height="6" rx="3" fill="#52525b" />
              <rect x="40" y="66" width="24" height="6" rx="3" fill="#52525b" />
              <circle cx="80" cy="70" r="5" fill="#facc15" />
            </svg>
            <div className="text-zinc-400 text-lg text-center">Hiç tarif bulunamadı.<br />Yeni bir tarif ekleyin veya filtreleri değiştirin.</div>
          </div>
        )}
      </section>
    </div>
  );
}
