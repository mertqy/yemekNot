"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

function DemoRecipeCard() {
  const [fav, setFav] = useState(false);
  const [open, setOpen] = useState(false);
  const handleFavorite = () => {
    setFav(f => {
      toast.success(f ? "Favorilerden çıkarıldı (demo)!" : "Favorilere eklendi (demo)!");
      return !f;
    });
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div
          className="relative bg-zinc-900/80 border border-zinc-700 rounded-2xl shadow-xl p-6 w-full max-w-xs mx-auto flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#f6e58d] group"
          tabIndex={0}
          aria-label="Demo tarif kartı detayını aç"
        >
          <span className="absolute top-2 right-2 bg-[#f6e58d] text-zinc-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">Demo</span>
          <span className="inline-block mb-1 px-3 py-1 rounded-full text-sm font-medium bg-[#f6e58d]/20 text-[#f6e58d] w-fit">Tatlı</span>
          <span className="font-semibold text-xl mb-1 text-white truncate">Çikolatalı Sufle</span>
          <div className="text-zinc-300 text-base mb-2 whitespace-pre-line leading-relaxed">Akışkan çikolata dolgulu, pratik ve lezzetli bir sufle tarifi.</div>
          <ul className="text-zinc-200 text-sm mb-2 list-disc list-inside space-y-1">
            <li>Çikolata</li>
            <li>Yumurta</li>
            <li>Un</li>
            <li>Tereyağı</li>
          </ul>
          <div className="flex gap-2 mt-2">
            <Button
              variant={fav ? "default" : "secondary"}
              className={
                (fav ? "bg-[#f6e58d] text-zinc-900" : "text-[#f6e58d] border-[#f6e58d] border") +
                " font-semibold px-4 py-1.5 rounded-lg transition-colors"
              }
              onClick={e => {
                e.stopPropagation();
                handleFavorite();
              }}
            >
              {fav ? "Favori ✓" : "Favori"}
            </Button>
            <Button
              variant="ghost"
              className="text-blue-400 px-4 py-1.5 rounded-lg"
              onClick={e => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              Detay
            </Button>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 animate-fade-in" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 animate-fade-in"
          data-state={open ? "open" : undefined}
        >
          <Dialog.Title className="text-2xl font-bold text-white mb-2">Çikolatalı Sufle</Dialog.Title>
          <span className="inline-block mb-2 px-3 py-1 rounded-full text-sm font-medium bg-[#f6e58d]/20 text-[#f6e58d] w-fit">Tatlı</span>
          <div className="text-zinc-300 text-base mb-2 whitespace-pre-line leading-relaxed">Akışkan çikolata dolgulu, pratik ve lezzetli bir sufle tarifi.</div>
          <ul className="text-zinc-200 text-sm mb-4 list-disc list-inside space-y-1">
            <li>Çikolata</li>
            <li>Yumurta</li>
            <li>Un</li>
            <li>Tereyağı</li>
          </ul>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant={fav ? "default" : "secondary"}
              className={fav ? "bg-[#f6e58d] text-zinc-900" : "text-[#f6e58d] border-[#f6e58d] border"}
              onClick={handleFavorite}
            >
              {fav ? "Favori ✓" : "Favori"}
            </Button>
            <Dialog.Close asChild>
              <Button variant="secondary">Kapat</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-zinc-950 flex flex-col items-center px-2 py-8 md:py-16 relative overflow-hidden">
      {/* Animated CSS blob background */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <div className="absolute left-[-5%] top-[18%] w-[380px] h-[380px] bg-[#f6e58d] opacity-60 rounded-full blur-xl animate-blob1" />
        <div className="absolute right-[-5%] top-[30%] w-[300px] h-[300px] bg-blue-400 opacity-45 rounded-full blur-lg animate-blob2" />
        <div className="absolute left-1/4 bottom-[-8%] w-[420px] h-[420px] bg-purple-500 opacity-35 rounded-full blur-lg animate-blob3" />
      </div>
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.15) translateY(-40px); }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.08) translateY(60px); }
        }
        @keyframes blob3 {
          0%, 100% { transform: scale(1) translateX(0); }
          50% { transform: scale(1.12) translateX(60px); }
        }
        .animate-blob1 { animation: blob1 12s ease-in-out infinite alternate; }
        .animate-blob2 { animation: blob2 14s ease-in-out infinite alternate; }
        .animate-blob3 { animation: blob3 16s ease-in-out infinite alternate; }
      `}</style>
      {/* Üst Grid: Başlık + Demo Kart */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 z-20">
        {/* Sol: Başlık ve CTA */}
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold text-[#f6e58d] tracking-widest uppercase">YEMEKNOT</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">Tariflerinizi Yönetin, Mutfağınızı Büyütün</h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-2">Hem bireysel hem kurumsal kullanıcılar için modern, güvenli ve hızlı tarif & mutfak yönetimi platformu.</p>
          <div className="flex gap-4 mt-2">
            <a href="/bireysel/kayit">
              <Button className="bg-[#f6e58d] text-zinc-900 font-bold px-6 py-3 rounded-xl shadow hover:bg-[#f9eec0] transition-colors text-lg">Hemen Başla</Button>
            </a>
            <a href="#ozellikler">
              <Button variant="secondary" className="border border-[#f6e58d] text-[#f6e58d] bg-transparent hover:bg-[#f6e58d]/10 text-lg">Özellikler</Button>
            </a>
          </div>
        </div>
        {/* Sağ: Demo Tarif Kartı */}
        <div className="flex justify-center items-center">
          <DemoRecipeCard />
        </div>
      </div>
      {/* Alt Grid: Özellik Kutuları */}
      <div id="ozellikler" className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 z-20">
        {/* Bireysel */}
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-7 flex flex-col gap-3 shadow-md">
          <span className="text-2xl mb-2">👤</span>
          <h3 className="text-xl font-bold text-white mb-1">Bireysel Kullanıcılar İçin</h3>
          <ul className="text-zinc-300 text-base list-disc list-inside space-y-1">
            <li>Kolay tarif ekleme, düzenleme, silme</li>
            <li>Kategori ve favori yönetimi</li>
            <li>Kişisel notlar ve arama/filtreleme</li>
            <li>Mobil uyumlu, modern arayüz</li>
          </ul>
        </div>
        {/* Kurumsal */}
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-7 flex flex-col gap-3 shadow-md">
          <span className="text-2xl mb-2">🏢</span>
          <h3 className="text-xl font-bold text-white mb-1">Kurumsal Kullanıcılar İçin</h3>
          <ul className="text-zinc-300 text-base list-disc list-inside space-y-1">
            <li>Detaylı tarif ve maliyet yönetimi</li>
            <li>Stok/SKT takibi ve envanter</li>
            <li>Rol ve yetki yönetimi</li>
            <li>Çoklu kullanıcı desteği</li>
          </ul>
        </div>
        {/* Ortak Avantajlar */}
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-7 flex flex-col gap-3 shadow-md">
          <span className="text-2xl mb-2">✨</span>
          <h3 className="text-xl font-bold text-white mb-1">Tüm Kullanıcılar İçin</h3>
          <ul className="text-zinc-300 text-base list-disc list-inside space-y-1">
            <li>Güvenli ve hızlı bulut altyapısı</li>
            <li>Şık, karanlık ve responsive tasarım</li>
            <li>Gelişmiş arama ve filtreleme</li>
            <li>Ücretsiz temel kullanım</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
