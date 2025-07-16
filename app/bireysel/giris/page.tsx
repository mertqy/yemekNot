"use client"

import { useState } from "react";
import { LoginForm } from "@/components/ui/login-form";
import { RegisterForm } from "@/components/ui/register-form";
import { Button } from "@/components/ui/button";

export default function BireyselGiris() {
  const [flipped, setFlipped] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden px-2">
      {/* Animated blob background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-5%] top-[18%] w-[320px] h-[320px] bg-[#f6e58d] opacity-40 rounded-full blur-xl animate-blob1" />
        <div className="absolute right-[-5%] top-[30%] w-[220px] h-[220px] bg-blue-400 opacity-30 rounded-full blur-lg animate-blob2" />
        <div className="absolute left-1/4 bottom-[-8%] w-[320px] h-[320px] bg-purple-500 opacity-25 rounded-full blur-lg animate-blob3" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="perspective-[1200px]">
          <div
            className={`relative w-full min-h-[440px] transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}
            style={{ height: 'auto' }}
          >
            {/* Login Face */}
            <div className="absolute inset-0 [backface-visibility:hidden] min-h-[440px] flex flex-col">
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center backdrop-blur-md h-full">
                <div className="w-full flex justify-end mb-2">
                  <Button variant="ghost" className="text-[#f6e58d] font-bold" onClick={() => setFlipped(true)}>
                    Kayıt Ol
                  </Button>
                </div>
                <LoginForm userType="bireysel"/>
              </div>
            </div>
            {/* Register Face */}
            <div className="absolute inset-0 [backface-visibility:hidden] rotate-y-180 min-h-[440px] flex flex-col">
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center backdrop-blur-md h-full">
                <div className="w-full flex justify-end mb-2">
                  <Button variant="ghost" className="text-[#f6e58d] font-bold" onClick={() => setFlipped(false)}>
                    Giriş Yap
                  </Button>
                </div>
                <RegisterForm userType="bireysel" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .perspective-\[1200px\] {
          perspective: 1200px;
        }
      `}</style>
    </main>
  );
}
