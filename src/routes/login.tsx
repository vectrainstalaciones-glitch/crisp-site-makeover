import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/vectra-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Acceso Admin | Vectra" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Inicia sesión.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4">
      <div className="premium-card w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src={logo} alt="" className="h-12 w-12" />
          <div>
            <p className="text-xl font-black text-white">VECTRA</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#e60012]">Panel admin</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-[#00d2ff]"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Contraseña (mín. 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-[#00d2ff]"
          />
          <button
            disabled={loading}
            className="glow-button w-full rounded-xl bg-[#0046ff] py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-white"
        >
          {mode === "signin" ? "¿No tienes cuenta? Crear" : "¿Ya tienes cuenta? Entrar"}
        </button>
      </div>
    </div>
  );
}
