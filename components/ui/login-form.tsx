"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function LoginForm({ userType }: { userType: "bireysel" | "firma" }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Supabase ile kullanıcı girişi
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    setSuccess("Giriş başarılı! Yönlendiriliyorsunuz...");
    setLoading(false);
    setTimeout(() => {
      if (userType === "bireysel") {
        router.push("/bireysel/panel");
      } else {
        router.push("/firma/panel");
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      <h2 className="text-2xl font-extrabold text-white mb-1 text-center tracking-tight">
        {userType === "bireysel" ? "Bireysel Giriş" : "Firma Giriş"}
      </h2>
      <p className="text-zinc-400 text-center text-base mb-2">YemekNot platformuna giriş yap</p>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full rounded-lg px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f6e58d] transition"
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full rounded-lg px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f6e58d] transition"
        required
      />
      <Button
        type="submit"
        className="w-full bg-[#f6e58d] text-zinc-900 font-bold rounded-xl px-4 py-3 text-lg shadow hover:bg-[#f9eec0] transition-colors mt-2"
        disabled={loading}
      >
        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
    </form>
  );
}
