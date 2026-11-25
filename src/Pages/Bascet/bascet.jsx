import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api";
import "./bascet.css";

const images = import.meta.glob("../../assets/*", {
    eager: true,
    query: "?url",
    import: "default",
});

const normalizeImageName = (imageName) => {
    if (!imageName) return "";

    return decodeURIComponent(
        imageName
            .split(/[\\/]/)
            .pop()
            .split("?")[0]
            .trim()
            .toLowerCase()
            .replace(/\.(png|jpg|jpeg|webp|svg)$/i, "")
    );
};

const getImage = (imageName) => {
    const targetName = normalizeImageName(imageName);

    if (!targetName) return "";

    const foundImage = Object.entries(images).find(([path]) => {
        return normalizeImageName(path) === targetName;
    });

    if (!foundImage) {
        console.warn("Изображение не найдено:", imageName);
        return "";
    }

    return foundImage[1];
};

const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("ru-RU")} ₽`;
};

const Basket = () => {
    const [cart, setCart] = useState({
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadCart = async () => {
        try {
            setError("");

            const data = await apiRequest("/cart");

            setCart({
                items: data.items || [],
                total: data.total || 0,
            });
        } catch (err) {
            console.error("Ошибка загрузки корзины:", err);
            setError("Не удалось загрузить корзину. Попробуйте обновить страницу.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 0 || newQuantity > 50) return;

        try {
            setUpdatingId(item.variantId);

            const data = await apiRequest(
                `/cart/items/${item.variantId}`,
                {
                    method: "PATCH",
                    body: {
                        quantity: newQuantity,
                    },
                }
            );

            setCart({
                items: data.items || [],
                total: data.total || 0,
            });
        } catch (err) {
            console.error("Ошибка изменения количества:", err);
            setError("Не удалось изменить количество товара.");
        } finally {
            setUpdatingId(null);
        }
    };

    const removeItem = async (variantId) => {
        try {
            setUpdatingId(variantId);

            const data = await apiRequest(
                `/cart/items/${variantId}`,
                {
                    method: "DELETE",
                }
            );

            setCart({
                items: data.items || [],
                total: data.total || 0,
            });
        } catch (err) {
            console.error("Ошибка удаления товара:", err);
            setError("Не удалось удалить товар.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <main className="basket-page">
            <header className="basket-header">
                <Link to="/" className="back-card">
                    <span className="back-arrow">‹</span>
                    <span className="back-text">Вернуться</span>
                </Link>

                <h1 className="bascet">Корзина</h1>
            </header>

            <div className="basket-content">
                <section className="basket-preview">
                    <h2 className="Selected-items">
                        Выбранные позиции:
                    </h2>

                    {loading ? (
                        <p className="basket-message">
                            Загружаем корзину...
                        </p>
                    ) : error ? (
                        <p className="basket-error">{error}</p>
                    ) : cart.items.length === 0 ? (
                        <p className="basket-message">
                            Корзина пока пуста
                        </p>
                    ) : (
                        <div className="basket-preview-list">
                            {cart.items.map((item) => {
                                const image = getImage(item.image);

                                return (
                                    <article
                                        className="basket-preview-card"
                                        key={item.variantId}
                                    >
                                        <div className="basket-preview-text">
                                            {item.name}
                                        </div>

                                        {image ? (
                                            <img
                                                className="basket-preview-img"
                                                src={image}
                                                alt={item.name}
                                            />
                                        ) : (
                                            <div className="basket-preview-no-image">
                                                Нет изображения
                                            </div>
                                        )}

                                        <div className="basket-preview-quantity">
                                            {item.quantity} шт.
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="Positions">
                    <h2 className="basket-table-title">
                        Состав заказа
                    </h2>

                    {loading ? (
                        <p className="basket-message">
                            Загружаем товары...
                        </p>
                    ) : error ? (
                        <p className="basket-error">{error}</p>
                    ) : cart.items.length === 0 ? (
                        <p className="basket-message">
                            Добавьте товары из каталога
                        </p>
                    ) : (
                        <div className="basket-table">
                            <div className="basket-table-header">
                                <span>Наименование</span>
                                <span>Объём / размер</span>
                                <span>Количество</span>
                                <span>Цена</span>
                            </div>

                            <div className="basket-rows">
                                {cart.items.map((item) => (
                                    <div
                                        className="basket-row"
                                        key={item.variantId}
                                    >
                                        <div className="basket-product-name">
                                            {item.name}
                                        </div>

                                        <div className="basket-product-size">
                                            {item.label || "—"}
                                        </div>

                                        <div className="basket-product-quantity">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    updatingId === item.variantId
                                                }
                                                aria-label="Уменьшить количество"
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    updatingId === item.variantId ||
                                                    item.quantity >= 50
                                                }
                                                aria-label="Увеличить количество"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="basket-product-price">
                                            {formatPrice(
                                                item.price * item.quantity
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="basket-remove-button"
                                            onClick={() =>
                                                removeItem(item.variantId)
                                            }
                                            disabled={
                                                updatingId === item.variantId
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="basket-extra">
                        <div className="basket-promo">
                            <h3 className="promotional-code">
                                Промокод
                            </h3>

                            <div className="basket-promo-controls">
                                <input
                                    type="text"
                                    placeholder="Ввести..."
                                    className="promotional-code-input"
                                />

                                <button
                                    type="button"
                                    className="promotional-code-button"
                                >
                                    Применить
                                </button>
                            </div>
                        </div>

                        <div className="basket-coins">
                            <h3 className="Pizza-Coins">
                                Pizza Coins
                            </h3>

                            <div className="pizza-Coins">
                                450 шт.
                            </div>

                            <button
                                type="button"
                                className="Write-off"
                            >
                                Списать
                            </button>
                        </div>
                    </div>

                    <div className="basket-footer">
                        <div className="basket-total">
                            <span className="Total">Итого:</span>

                            <span className="total">
                                {formatPrice(cart.total)}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="payment-button"
                            disabled={loading || cart.items.length === 0}
                        >
                            Перейти к оплате
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Basket;