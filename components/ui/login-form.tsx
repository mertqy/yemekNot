"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function LoginForm({ userType }: { userType: "bireysel" | "firma" }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada ileride Supabase login işlemi olacak
    alert(`${userType} login: ${email} / ${password}`);
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
      >
        Giriş Yap
      </Button>
    </form>
  );
}
