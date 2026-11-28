import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { errorText } from "../../errorTexts";
import "./topup.css";

const PRESETS = [500, 1000, 2000, 5000];

export default function TopUpModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();

    const value = Number(amount);
    if (!Number.isInteger(value) || value < 1 || value > 100000) {
      setError("Введите целую сумму от 1 до 100 000 ₽.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/wallet/topup", {
        method: "POST",
        body: { amount: value },
      });
      onSuccess(result.balance);
      onClose();
    } catch (err) {
      console.error("Top-up error:", err);
      setError(errorText(err, "Не удалось пополнить баланс. Попробуйте ещё раз."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className="modal-title">Пополнение баланса</h2>
        <p className="modal-sub">Выберите сумму или введите свою</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="topup-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="topup-preset"
                onClick={() => setAmount(String(preset))}
              >
                {preset.toLocaleString("ru-RU")} ₽
              </button>
            ))}
          </div>

          <input
            type="number"
            min="1"
            max="100000"
            step="1"
            placeholder="Сумма, ₽"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="modal-input"
            autoFocus
          />

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? "Пополняем..." : "Пополнить"}
          </button>
        </form>

        {error && <div className="modal-error">{error}</div>}

        <p className="topup-note">
          Тестовое пополнение: реальные деньги не списываются.
        </p>
      </div>
    </div>
  );
}