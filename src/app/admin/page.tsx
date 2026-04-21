"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Ongeldige inloggegevens");
      setLoading(false);
      return;
    }

    router.push("/admin/bieren");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div
        className="bg-white w-full max-w-md p-8 border-4 border-dark"
        style={{ boxShadow: "8px 8px 0px var(--color-yellow)" }}
      >
        <h1 className="text-3xl text-dark text-center mb-2">BEHEER</h1>
        <p className="font-body text-gray-600 text-center mb-8">
          Troebel Brewing Admin
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-heading text-sm text-dark mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-dark font-body focus:outline-none focus:border-yellow"
              placeholder="admin@troebel.be"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block font-heading text-sm text-dark mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-dark font-body focus:outline-none focus:border-yellow"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 font-body text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-dark font-heading py-3 border-2 border-dark hover:bg-dark hover:text-yellow transition-colors disabled:opacity-50"
            style={{ boxShadow: "4px 4px 0px var(--color-dark)" }}
          >
            {loading ? "Even geduld..." : "INLOGGEN"}
          </button>
        </form>

        <p className="font-body text-xs text-gray-400 text-center mt-8">
          Problemen met inloggen?{" "}
          <a href="mailto:hallo@troebelbrewing.be" className="underline">
            Contact
          </a>
        </p>
      </div>
    </div>
  );
}
