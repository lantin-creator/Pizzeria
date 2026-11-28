import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api";
import { errorText } from "../../errorTexts";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../Toast/useToast";
import "./lastorder.css";

const formatPrice = (value) => `${Number(value || 0).toLocaleString("ru-RU")} ₽`;

export default function LastOrder({ onChanged, fallback = null }) {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [needTopUp, setNeedTopUp] = useState(false);

  const loadLast = useCallback(async () => {
    try {
      const result = await apiRequest("/orders/last");
      setOrder(result?.order ?? null);
    } catch (err) {
      console.error("Last order error:", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setOrder(null);
      setLoaded(true);
      return;
    }

    loadLast();
  }, [authLoading, user, loadLast]);

  if (authLoading || !loaded) return null;
  if (!user || !order) return fallback;

  async function repeat(mode) {
    setBusy(mode);
    setError("");
    setNeedTopUp(false);

    try {
      if (mode === "cart") {
        await apiRequest(`/orders/${order.id}/repeat`, {
          method: "POST",
          body: { mode: "cart" },
        });

        showToast("Прошлый заказ добавлен в корзину");
        onChanged?.();
        return;
      }

      const result = await apiRequest(`/orders/${order.id}/repeat`, {
        method: "POST",
        body: { mode: "pay", address: order.deliveryAddress },
      });

      showToast(
        `Заказ №${result.orderId} оплачен. Остаток: ${formatPrice(result.balance)}`
      );
      setOrder(null);
      onChanged?.();
    } catch (err) {
      console.error("Repeat order error:", err);

      if (err.code === "INSUFFICIENT_FUNDS") {
        setNeedTopUp(true);
        onChanged?.();
      }

      setError(errorText(err, "Не удалось повторить заказ. Попробуйте ещё раз."));
    } finally {
      setBusy("");
    }
  }

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("ru-RU")
    : "";

  return (
    <div className="last-order">
      <div className="last-order-head">
        <h3 className="last-order-title">Повторить прошлый заказ?</h3>
        <span className="last-order-date">
          №{order.id} от {date}
        </span>
      </div>

      <ul className="last-order-items">
        {order.items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} ({item.variantLabel}) × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="last-order-total">
        Тогда было: {formatPrice(order.total)}
        {order.promoCode ? ` (промокод ${order.promoCode})` : ""}
      </div>

      <div className="last-order-actions">
        <button
          type="button"
          className="last-order-btn secondary"
          onClick={() => repeat("cart")}
          disabled={!!busy}
        >
          {busy === "cart" ? "Добавляем..." : "В корзину"}
        </button>

        {order.deliveryAddress && (
          <button
            type="button"
            className="last-order-btn"
            onClick={() => repeat("pay")}
            disabled={!!busy}
          >
            {busy === "pay" ? "Оплачиваем..." : "Оплатить сразу"}
          </button>
        )}
      </div>

      <p className="last-order-note">
        Цены берутся текущие. «Оплатить сразу» спишет сумму с баланса и
        доставит по прежнему адресу.
      </p>

      {error && (
        <p className="last-order-error">
          {error}{" "}
          {needTopUp && (
            <Link to="/account" className="basket-link">
              Пополнить баланс
            </Link>
          )}
        </p>
      )}
    </div>
  );
}