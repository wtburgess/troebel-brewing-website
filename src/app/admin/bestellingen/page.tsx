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
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
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

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
        prev.map((o) => o.id === order.id ? { ...o, is_processed: !o.is_processed } : o)
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
        <p className="text-warm-white" style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: ".1em" }}>
          Laden...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ── Top Nav ── */}
      <nav className="admin-nav">
        <div className="admin-nav-left">
          <Link href="/admin/bieren" className="admin-nav-brand">
            <span className="admin-nav-logo">TROEBEL</span>
            <span className="admin-nav-tag">/ admin</span>
          </Link>
          <div className="admin-nav-links">
            <Link href="/admin/bieren" className="admin-nav-link">
              Bieren
            </Link>
            <Link href="/admin/bestellingen" className="admin-nav-link admin-nav-link--active">
              Bestellingen
            </Link>
            <Link href="/" target="_blank" className="admin-nav-link">
              ↗ Site
            </Link>
          </div>
        </div>
        <div className="admin-nav-right">
          <span className="admin-nav-email">admin@troebel.be</span>
          <button onClick={handleLogout} className="btn-outline admin-nav-logout">
            Uitloggen
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="admin-body">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Page Header */}
          <div className="admin-page-header" style={{ marginBottom: "2rem" }}>
            <div>
              <span className="section-label" style={{ fontSize: ".85rem" }}>admin / bestellingen</span>
              <h1 className="admin-page-title">Bestellingen</h1>
              <p style={{ fontFamily: "var(--font-b)", fontSize: ".9rem", color: "var(--mid)", marginTop: ".3rem" }}>
                {orders.length} totaal · {openCount} te verwerken
              </p>
            </div>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {(["all", "open", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterProcessed(f)}
                  className={filterProcessed === f ? "admin-filter-btn admin-filter-btn--active" : "admin-filter-btn"}
                >
                  {f === "all" ? "Alle" : f === "open" ? "Te verwerken" : "Verwerkt"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="admin-error-banner">
              <p>{error}</p>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div className="admin-table-wrap" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", textTransform: "uppercase", color: "var(--mid)" }}>
                Geen bestellingen gevonden
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`admin-order-card${order.is_processed ? " admin-order-card--done" : ""}`}
                >
                  <div className="admin-order-inner">
                    {/* Left: meta */}
                    <div style={{ flex: 1 }}>
                      <div className="admin-order-header-row">
                        <span className="admin-order-number">{order.order_number}</span>
                        <span className={order.is_processed ? "admin-badge admin-badge--verwerkt" : "admin-badge admin-badge--open"}>
                          {order.is_processed ? "Verwerkt" : "Open"}
                        </span>
                        <span className="admin-order-date">{formatDate(order.created_at)}</span>
                      </div>

                      <p className="admin-order-customer">{order.customer_name}</p>
                      <p className="admin-order-contact">
                        {order.customer_email}
                        {order.customer_phone && ` · ${order.customer_phone}`}
                      </p>
                      <p className="admin-order-meta">
                        <strong>{order.fulfillment === "pickup" ? "Afhalen" : "Verzending"}</strong>
                        {" · "}
                        {order.customer_type}
                      </p>

                      <div className="admin-order-items">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="admin-order-item">
                            <span className="admin-order-qty">{item.quantity}</span>
                            <span>{item.beer_name} — {item.variant_label}</span>
                            <span className="admin-order-item-price">{formatCurrency(item.total_incl_vat)}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="admin-order-notes">Nota: {order.notes}</p>
                      )}
                    </div>

                    {/* Right: totals + toggle */}
                    <div className="admin-order-right">
                      <div className="admin-order-totals">
                        <div className="admin-order-total-row">
                          <span>excl. BTW</span>
                          <span>{formatCurrency(order.total_excl_vat)}</span>
                        </div>
                        <div className="admin-order-total-final">
                          {formatCurrency(order.total_incl_vat)}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleProcessed(order)}
                        disabled={toggling === order.id}
                        className={order.is_processed ? "admin-order-toggle admin-order-toggle--reopen" : "admin-order-toggle admin-order-toggle--process"}
                      >
                        {toggling === order.id ? "..." : order.is_processed ? "↩ Heropen" : "✓ Verwerkt"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
