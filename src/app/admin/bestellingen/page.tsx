"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface OrderItem {
  id: string;
  beer_name: string;
  variant_label: string;
  quantity: number;
  unit_price: number;
  total_incl_vat: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_type: string;
  fulfillment: string;
  status: string;
  is_processed: boolean;
  total_excl_vat: number;
  vat_amount: number;
  total_incl_vat: number;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return `€ ${amount.toFixed(2).replace(".", ",")}`;
}

export default function AdminBestellingenPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [filterProcessed, setFilterProcessed] = useState<"all" | "open" | "done">("all");

  const loadOrders = useCallback(async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data as Order[]) ?? []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Kon bestellingen niet laden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("troebel-admin-auth");
    if (isAuth !== "true") {
      router.push("/admin");
      return;
    }
    loadOrders();
  }, [router, loadOrders]);

  const handleLogout = () => {
    sessionStorage.removeItem("troebel-admin-auth");
    router.push("/admin");
  };

  const toggleProcessed = async (order: Order) => {
    setToggling(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_processed: !order.is_processed }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, is_processed: !o.is_processed } : o
        )
      );
    } catch {
      alert("Kon status niet bijwerken.");
    } finally {
      setToggling(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterProcessed === "open") return !o.is_processed;
    if (filterProcessed === "done") return o.is_processed;
    return true;
  });

  const openCount = orders.filter((o) => !o.is_processed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white font-body text-lg">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b-2 border-primary">
        <div className="flex items-center gap-6">
          <span className="font-heading text-xl text-primary">TROEBEL ADMIN</span>
          <nav className="flex gap-4 text-sm font-body">
            <Link href="/admin/bieren" className="text-white/70 hover:text-white transition-colors">
              Bieren
            </Link>
            <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Bestellingen</span>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-body text-white/60 hover:text-white transition-colors"
        >
          Uitloggen
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Title + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-4xl text-dark uppercase tracking-wide">
              Bestellingen
            </h1>
            <p className="font-body text-gray-500 mt-1">
              {orders.length} totaal · {openCount} te verwerken
            </p>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(["all", "open", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterProcessed(f)}
                className={`px-4 py-2 border-2 border-dark font-body font-bold text-sm transition-all ${
                  filterProcessed === f
                    ? "bg-dark text-white"
                    : "bg-white text-dark hover:bg-primary/10"
                }`}
              >
                {f === "all" ? "Alle" : f === "open" ? "Te verwerken" : "Verwerkt"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 mb-6 font-body">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white border-2 border-dark p-12 text-center shadow-[6px_6px_0_#1C1C1C]">
            <p className="font-heading text-2xl text-dark/50">Geen bestellingen gevonden</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white border-2 border-dark p-6 shadow-[4px_4px_0_#1C1C1C] transition-all ${
                  order.is_processed ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left: meta */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-heading text-xl text-primary">{order.order_number}</span>
                      <span
                        className={`text-xs font-body font-bold px-2 py-0.5 border ${
                          order.is_processed
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-orange-400 text-orange-700 bg-orange-50"
                        }`}
                      >
                        {order.is_processed ? "Verwerkt" : "Open"}
                      </span>
                      <span className="text-xs font-body text-gray-400">{formatDate(order.created_at)}</span>
                    </div>

                    <p className="font-body font-bold text-dark text-lg">{order.customer_name}</p>
                    <p className="font-body text-gray-500 text-sm">
                      {order.customer_email}
                      {order.customer_phone && ` · ${order.customer_phone}`}
                    </p>
                    <p className="font-body text-sm text-gray-500">
                      <span className="font-bold">{order.fulfillment === "pickup" ? "Afhalen" : "Verzending"}</span>
                      {" · "}
                      {order.customer_type}
                    </p>

                    {/* Items */}
                    <div className="mt-3 space-y-1">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm font-body text-gray-700">
                          <span className="w-6 h-6 bg-dark text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {item.quantity}
                          </span>
                          <span>
                            {item.beer_name} — {item.variant_label}
                          </span>
                          <span className="text-gray-400 ml-auto">{formatCurrency(item.total_incl_vat)}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="mt-2 text-sm font-body text-gray-500 italic">
                        Nota: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: totals + toggle */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-body text-xs text-gray-400">excl. BTW</p>
                      <p className="font-body text-sm text-gray-600">{formatCurrency(order.total_excl_vat)}</p>
                      <p className="font-body text-xs text-gray-400 mt-1">incl. BTW</p>
                      <p className="font-heading text-2xl text-dark">{formatCurrency(order.total_incl_vat)}</p>
                    </div>

                    <button
                      onClick={() => toggleProcessed(order)}
                      disabled={toggling === order.id}
                      className={`px-4 py-2 border-2 font-body font-bold text-sm transition-all disabled:opacity-50 ${
                        order.is_processed
                          ? "border-gray-400 text-gray-500 hover:border-dark hover:text-dark"
                          : "border-dark bg-dark text-white hover:bg-primary hover:text-dark hover:border-primary"
                      }`}
                    >
                      {toggling === order.id
                        ? "..."
                        : order.is_processed
                        ? "↩ Heropen"
                        : "✓ Verwerkt"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
