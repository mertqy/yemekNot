"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
    // Oturum değişimini dinle
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-zinc-900/90 backdrop-blur border-b border-zinc-800 shadow-sm rounded-b-2xl px-2 md:px-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-2 md:px-6 py-3 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="inline-block w-7 h-7 rounded-lg bg-[#f6e58d] mr-1"></span>
            YemekNot
          </span>
          <Link href="/">
            <span className="hidden md:inline text-xs font-medium text-zinc-400 ml-2">
              Tarif & Mutfak Yönetimi
            </span>
          </Link>
        </div>
        {!loading && (
          <div className="hidden md:flex flex-row gap-6 text-sm font-semibold items-center">
            {user ? (
              <>
                <Link
                  href={"/bireysel/panel"}
                  className="hover:text-[#f6e58d] transition-colors"
                >
                  Panel
                </Link>
                <Button onClick={handleLogout} className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-red-400 transition-colors">
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/bireysel/giris"
                  className="hover:text-[#f6e58d] transition-colors"
                >
                  Bireysel Giriş
                </Link>
                <Link
                  href="/firma/giris"
                  className="hover:text-[#f6e58d] transition-colors"
                >
                  Firma Giriş
                </Link>
                <Link href="/bireysel/giris">
                  <Button className="bg-[#f6e58d] text-zinc-900 font-bold px-5 py-2 rounded-xl shadow hover:bg-[#f9eec0] transition-colors">
                    Hemen Başla
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
        {/* Mobil menü butonu */}
        <div className="md:hidden flex items-center">
          {/* Buraya ileride hamburger menü eklenebilir */}
        </div>
      </div>
    </nav>
  );
}
