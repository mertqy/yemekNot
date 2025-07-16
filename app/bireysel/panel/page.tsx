"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PersonalRecipe } from "../../../lib/interfaces";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RecipeDetailDialog } from "@/components/recipe/RecipeDetailDialog";
import { supabase } from "@/lib/supabaseClient";

const exampleCategories = [
  "Ana Yemek",
  "Tatlı",
  "Çorba",
  "Salata",
  "Atıştırmalık",
];

export default function BireyselPanel() {
  const [recipes, setRecipes] = useState<PersonalRecipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // Artık Supabase'den gelecek
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailRecipeId, setDetailRecipeId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcıyı al
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Kullanıcıya ait tarifleri çek
  useEffect(() => {
    if (!user) return;
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Tarifler yüklenemedi: " + error.message);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, [user]);

  // Kullanıcının favori tariflerini Supabase'den çek
  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("recipe_id")
        .eq("user_id", user.id);
      if (error) {
        toast.error("Favoriler yüklenemedi: " + error.message);
      } else {
        setFavoriteIds((data || []).map((fav: any) => fav.recipe_id));
      }
    };
    fetchFavorites();
  }, [user]);

  // Kategorileri: sistemde tanımlı + tariflerden gelenler (tekrarsız)
  const categories = useMemo(() => {
    const userCats = recipes.map(r => r.category).filter(Boolean) as string[];
    return Array.from(new Set([...exampleCategories, ...userCats]));
  }, [recipes]);

  // Ekle veya düzenle
  const handleSave = async ({ title, note, ingredients, category }: { title: string; note: string; ingredients: string[]; category: string }) => {
    if (!user) return;
    if (editId) {
      // Güncelle
      const { error } = await supabase
        .from("recipes")
        .update({ title, note, ingredients, category })
        .eq("id", editId)
        .eq("user_id", user.id);
      if (error) {
        toast.error("Tarif güncellenemedi: " + error.message);
      } else {
        setRecipes(recipes => recipes.map(r => r.id === editId ? { ...r, title, note, ingredients, category } : r));
        toast.success("Tarif güncellendi!");
      }
      setEditId(null);
    } else {
      // Yeni tarif ekle
      const { data, error } = await supabase
        .from("recipes")
        .insert([{ user_id: user.id, title, note, ingredients, category }])
        .select();
      if (error) {
        toast.error("Tarif eklenemedi: " + error.message);
      } else if (data && data[0]) {
        setRecipes(recipes => [data[0], ...recipes]);
        toast.success("Tarif eklendi!");
      }
    }
    setShowForm(false);
  };

  // Sil
  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId !== null && user) {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", confirmDeleteId)
        .eq("user_id", user.id);
      if (error) {
        toast.error("Tarif silinemedi: " + error.message);
      } else {
        setRecipes(recipes => recipes.filter(r => r.id !== confirmDeleteId));
        setFavoriteIds(favs => favs.filter(fid => fid !== confirmDeleteId));
        // Favorilerden de sil
        await supabase
          .from("favorites")
          .delete()
          .eq("recipe_id", confirmDeleteId)
          .eq("user_id", user.id);
        toast.success("Tarif silindi!");
      }
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Favori ekle/çıkar (Supabase ile)
  const handleFavorite = async (id: string) => {
    if (!user) return;
    const isFav = favoriteIds.includes(id);
    if (isFav) {
      // Favoriden çıkar
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", id);
      if (error) {
        toast.error("Favori çıkarılamadı: " + error.message);
      } else {
        setFavoriteIds(favs => favs.filter(fid => fid !== id));
        toast.success("Favorilerden çıkarıldı.");
      }
    } else {
      // Favoriye ekle
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, recipe_id: id }]);
      if (error) {
        toast.error("Favoriye eklenemedi: " + error.message);
      } else {
        setFavoriteIds(favs => [...favs, id]);
        toast.success("Favorilere eklendi!");
      }
    }
  };

  // Düzenle
  const handleEdit = (id: string) => {
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
        <h1 className="text-2xl font-bold mb-4">Hoş geldin, {user?.email || "Kullanıcı"}!</h1>
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
            loading={loading}
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
        {filteredRecipes.length === 0 && !loading && (
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
        {loading && (
          <div className="text-zinc-400 text-center mt-8">Yükleniyor...</div>
        )}
      </section>
    </div>
  );
}
