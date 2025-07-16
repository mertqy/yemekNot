"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm({ userType }: { userType: "bireysel" | "firma" }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada ileride Supabase register işlemi olacak
    alert(
      userType === "bireysel"
        ? `Bireysel kayıt: ${name} - ${email}`
        : `Firma kayıt: ${company} - ${name} - ${email}`
    );
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
      <Button type="submit" className="w-full">
        Kayıt Ol
      </Button>
    </form>
  );
}