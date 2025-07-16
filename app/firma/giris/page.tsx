import { LoginForm } from "@/components/ui/login-form";

export default function FirmaGiris() {
  return (
    <main>
      {/* <LoginForm userType="firma" /> */}
      <h1 className="text-center text-2xl font-bold mt-24">
        Firma Giriş Özelliği henüz geliştirilme aşamasındadır. Lütfen daha sonra tekrar deneyin.
      </h1>
      <p className="text-center text-sm mt-2">
        Şu anda sadece bireysel kullanıcılar için giriş yapılabilmektedir.
      </p>
    </main>
  );
}