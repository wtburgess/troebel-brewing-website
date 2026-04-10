"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const isAuth = sessionStorage.getItem("troebel-admin-auth");
    if (isAuth === "true") {
      router.push("/admin/bieren");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem("troebel-admin-auth", "true");
        router.push("/admin/bieren");
      } else {
        setError("Ongeldig wachtwoord");
      }
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div
        className="bg-white w-full max-w-md p-8 border-4 border-dark"
        style={{ boxShadow: "8px 8px 0px var(--color-yellow)" }}
      >
        <h1 className="text-3xl text-dark text-center mb-2">
          BEHEER
        </h1>
        <p className="font-body text-gray-600 text-center mb-8">
          Troebel Brewing Admin
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              autoFocus
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
