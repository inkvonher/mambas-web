"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md border border-[#d6ad4a]/30 rounded-2xl p-8 bg-[#050505]"
      >
        <p className="text-[#d6ad4a] tracking-[0.4em] text-xs mb-3">
          MAMBAS ADMIN
        </p>

        <h1 className="text-3xl font-bold mb-8">Acceso privado</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3"
        />

        <button className="w-full bg-[#d6ad4a] text-black font-bold py-3 rounded">
          Entrar
        </button>
      </form>
    </main>
  );
}
