// Tarifler ve kullanıcılar için interface'ler

// Ortak alanlar
export interface BaseRecipe {
  id: number;
  title: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  ingredients?: string[];
  category?: string;
}

// Bireysel kullanıcıya ait tarif
export interface PersonalRecipe extends BaseRecipe {
  userId: number;
  // İleride favori, kategori, fotoğraf vs. eklenebilir
  ingredients?: string[];
  category?: string;
}

// Firma tarifleri
export interface CompanyRecipe extends BaseRecipe {
  companyId: number;
  cost?: number;
  portion?: number;
  // İzinler, malzeme listesi, personel notları vs. eklenebilir
}

// Kullanıcılar
export interface User {
  id: number;
  name: string;
  email: string;
}

// Firma rolleri ve yetkileri
export interface CompanyRole {
  id: number;
  companyId: number;
  name: string; // Örn: "Şef", "Yardımcı", "Stajyer"
  permissions: Permission[];
}

export interface Permission {
  key: string; // Örn: "edit_recipe", "view_inventory"
  label: string; // İnsan tarafından okunabilir açıklama
}

// Firma personeli
export interface CompanyUser {
  id: number;
  companyId: number;
  name: string;
  email: string;
  roleId: number; // Dinamik rol
} 