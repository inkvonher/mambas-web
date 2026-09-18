"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Detectar si el usuario abrió un enlace de recuperación de contraseña
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsSettingNewPassword(true);
        setMessage({
          type: "ok",
          text: "Enlace verificado. Escribe tu nueva contraseña a continuación.",
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    router.push("/admin");
  }

  async function handleSendReset(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setMessage({ type: "error", text: "Ingresa tu correo electrónico." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin/login` : undefined,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({
      type: "ok",
      text: "¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu clave.",
    });
  }

  async function handleUpdatePassword(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({
      type: "ok",
      text: "¡Contraseña actualizada con éxito! Redirigiendo...",
    });

    setTimeout(() => {
      router.push("/admin");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-[#d6ad4a]/30 rounded-2xl p-8 bg-[#050505] shadow-2xl">
        <p className="text-[#d6ad4a] tracking-[0.4em] text-xs mb-3 font-semibold uppercase">
          MAMBAS ADMIN
        </p>

        <h1 className="text-3xl font-bold mb-6">
          {isSettingNewPassword
            ? "Nueva contraseña"
            : isResetMode
            ? "Recuperar acceso"
            : "Acceso privado"}
        </h1>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-5 ${
              message.type === "ok"
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border border-red-500/40 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {isSettingNewPassword ? (
          <form onSubmit={handleUpdatePassword}>
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full mb-6 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#d6ad4a]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d6ad4a] text-black font-bold py-3 rounded cursor-pointer hover:bg-[#e2bc5e] transition-all disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar contraseña y entrar"}
            </button>
          </form>
        ) : isResetMode ? (
          <form onSubmit={handleSendReset}>
            <p className="text-xs text-zinc-400 mb-4">
              Ingresa tu correo de administrador para recibir el enlace directo de restablecimiento:
            </p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mb-6 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#d6ad4a]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d6ad4a] text-black font-bold py-3 rounded cursor-pointer hover:bg-[#e2bc5e] transition-all disabled:opacity-50 mb-4"
            >
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setMessage(null);
              }}
              className="w-full text-xs text-zinc-400 hover:text-white py-2 transition-colors cursor-pointer"
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mb-4 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#d6ad4a]"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-6 bg-black border border-[#d6ad4a]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#d6ad4a]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d6ad4a] text-black font-bold py-3 rounded cursor-pointer hover:bg-[#e2bc5e] transition-all disabled:opacity-50 mb-4"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex justify-between items-center text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setMessage(null);
                }}
                className="hover:text-[#d6ad4a] transition-colors cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
