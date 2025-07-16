import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YemekNot | Tarif Platformu",
  description: "Bireysel ve firma kullanıcıları için çok yönlü tarif yönetimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Next.js App Router'da layout'ta usePathname ancak "use client" ile kullanılabilir.
  // Bu yüzden, navbari her sayfada göstermek yerine, panel sayfalarında gizlemek için aşağıdaki gibi bir kontrol yapılabilir.
  // Ancak layout dosyası default olarak server component olduğu için, burada saf bir çözüm: sadece ana sayfa ve giriş/kayıt sayfalarında navbari göster.

  // Panel sayfalarını path ile kontrol et
  const isPanel =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/bireysel/panel");

  return (
    <html lang="tr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        {!isPanel && (
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
              <div className="hidden md:flex flex-row gap-6 text-sm font-semibold items-center">
                
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
              </div>
              <div className="hidden md:block">
                <Link href="/bireysel/giris">
                  <Button className="bg-[#f6e58d] text-zinc-900 font-bold px-5 py-2 rounded-xl shadow hover:bg-[#f9eec0] transition-colors">
                    Hemen Başla
                  </Button>
                </Link>
              </div>
              {/* Mobil menü butonu */}
              <div className="md:hidden flex items-center">
                {/* Buraya ileride hamburger menü eklenebilir */}
              </div>
            </div>
          </nav>
        )}
        <main>{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
