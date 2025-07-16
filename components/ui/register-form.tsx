"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export function RegisterForm({ userType }: { userType: "bireysel" | "firma" }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Supabase ile kullanıcı kaydı
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          company: userType === "firma" ? company : null,
          userType,
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Ekstra kullanıcı bilgilerini ayrı bir tabloya kaydetmek istersen:
    // await supabase.from('users').insert([{ id: data.user?.id, name, company, userType }]);
    setSuccess("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın ve giriş yapın.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">
        {userType === "bireysel" ? "Bireysel Kayıt" : "Firma Kayıt"}
      </h2>
      {userType === "firma" && (
        <Input
          placeholder="Firma Adı"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />
      )}
      <Input
        placeholder="Ad Soyad"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
    </form>
  );
}