import { useEffect, useState } from "react";
import "./callback.css";

const CallbackModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Закрытие по Esc + блокировка скролла страницы, когда модалка открыта
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName("");
        setPhone("");
        setSent(false);
        setError("");
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Имитация отправки заявки
    console.log("Заявка на обратный звонок:", { name, phone });

    setError("");
    setSent(true);

    setTimeout(() => {
      onClose();
    }, 2500);
  };

  // Клик по затемнённому фону — закрыть
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {!sent ? (
          <>
            <h2 className="modal-title">Заказать обратный звонок</h2>
            <p className="modal-sub">
              Оставьте номер — перезвоним в течение 5 минут
            </p>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="modal-input"
                autoFocus
              />
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="modal-input"
              />
              <button type="submit" className="modal-btn">
                Отправить
              </button>
            </form>

            {error && <div className="modal-error">{error}</div>}
          </>
        ) : (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <div className="modal-success-title">Спасибо!</div>
            <div className="modal-success-text">
              Мы свяжемся с вами в ближайшее время
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackModal;