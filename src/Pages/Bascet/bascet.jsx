import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api";
import { errorText } from "../../errorTexts";
import { useAuth } from "../../components/auth/useAuth";
import { useProfile } from "../../components/hooks/useProfile";
import LastOrder from "../../components/LastOrder/LastOrder";
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
    const { user, loading: authLoading } = useAuth();
    const { profile } = useProfile();

    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const [balance, setBalance] = useState(null);
    const [address, setAddress] = useState("");

    const [promoInput, setPromoInput] = useState("");
    const [promo, setPromo] = useState(null);
    const [promoMessage, setPromoMessage] = useState("");
    const [promoLoading, setPromoLoading] = useState(false);

    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState("");
    const [paidOrderId, setPaidOrderId] = useState(null);

    const needLogin = !authLoading && !user;

    const loadCart = useCallback(async () => {
        try {
            setError("");
            const data = await apiRequest("/cart");
            setCart({ items: data.items || [], total: data.total || 0 });
        } catch (err) {
            console.error("Ошибка загрузки корзины:", err);
            setError(
                errorText(
                    err,
                    "Не удалось загрузить корзину. Попробуйте обновить страницу."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadBalance = useCallback(async () => {
        try {
            const data = await apiRequest("/wallet");
            setBalance(data.balance);
        } catch (err) {
            console.error("Ошибка загрузки баланса:", err);
        }
    }, []);

    const refreshAfterRepeat = () => {
        loadCart();
        loadBalance();
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        loadCart();
        loadBalance();
    }, [authLoading, user, loadCart, loadBalance]);

    useEffect(() => {
        if (profile?.addres) {
            setAddress((prev) => prev || profile.addres);
        }
    }, [profile]);

    const checkPromo = async (code) => {
        setPromoLoading(true);
        setPromoMessage("");

        try {
            const result = await apiRequest("/promo/check", {
                method: "POST",
                body: { code },
            });

            setPromo({ code: result.code, discount: result.discount });
            setPromoMessage(
                `Промокод ${result.code} применён: −${formatPrice(result.discount)}`
            );
        } catch (err) {
            console.error("Ошибка промокода:", err);
            setPromo(null);
            setPromoMessage(errorText(err, "Не удалось проверить промокод."));
        } finally {
            setPromoLoading(false);
        }
    };

    const applyCart = async (data) => {
        const items = data.items || [];
        setCart({ items, total: data.total || 0 });

        if (!promo) return;

        if (items.length === 0) {
            setPromo(null);
            setPromoMessage("");
        } else {
            await checkPromo(promo.code);
        }
    };

    const handleApplyPromo = () => {
        const code = promoInput.trim();

        if (!code) {
            setPromoMessage("Введите промокод.");
            return;
        }

        if (cart.items.length === 0) {
            setPromoMessage("Сначала добавьте товары в корзину.");
            return;
        }

        checkPromo(code);
    };

    const removePromo = () => {
        setPromo(null);
        setPromoInput("");
        setPromoMessage("");
    };

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 0 || newQuantity > 50) return;

        try {
            setUpdatingId(item.variantId);
            setPayError("");

            const data = await apiRequest(`/cart/items/${item.variantId}`, {
                method: "PATCH",
                body: { quantity: newQuantity },
            });

            await applyCart(data);
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
            setPayError("");

            const data = await apiRequest(`/cart/items/${variantId}`, {
                method: "DELETE",
            });

            await applyCart(data);
        } catch (err) {
            console.error("Ошибка удаления товара:", err);
            setError("Не удалось удалить товар.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePay = async () => {
        if (!address.trim()) {
            setPayError("Укажите адрес доставки.");
            return;
        }

        setPaying(true);
        setPayError("");

        try {
            const result = await apiRequest("/orders/checkout", {
                method: "POST",
                body: {
                    address: address.trim(),
                    promo: promo ? promo.code : undefined,
                },
            });

            setBalance(result.balance);
            setCart({ items: [], total: 0 });
            setPromo(null);
            setPromoInput("");
            setPromoMessage("");
            setPaidOrderId(result.orderId);
        } catch (err) {
            console.error("Ошибка оплаты:", err);

            if (!err.status) {
                setPayError(
                    "Нет ответа от сервера. Проверьте корзину и баланс: возможно, заказ уже оплачен."
                );
                loadCart();
                loadBalance();
            } else {
                setPayError(
                    errorText(err, "Не удалось оплатить заказ. Попробуйте ещё раз.")
                );
                if (err.code === "CART_EMPTY") loadCart();
            }
        } finally {
            setPaying(false);
        }
    };

    const discount = promo ? promo.discount : 0;
    const toPay = Math.max(cart.total - discount, 0);
    const notEnough = balance !== null && toPay > balance;

    const renderState = (emptyContent) => {
        if (needLogin) {
            return (
                <p className="basket-message">
                    Чтобы увидеть корзину,{" "}
                    <Link to="/logo" className="basket-link">
                        войдите в аккаунт
                    </Link>
                    .
                </p>
            );
        }

        if (loading || authLoading) {
            return <p className="basket-message">Загружаем корзину...</p>;
        }

        if (error) {
            return <p className="basket-error">{error}</p>;
        }

        if (cart.items.length === 0) {
            return emptyContent;
        }

        return null;
    };

    const emptyBasketText = (
        <p className="basket-message">Корзина пока пуста</p>
    );

    const emptyOffer = paidOrderId ? (
        emptyBasketText
    ) : (
        <LastOrder onChanged={refreshAfterRepeat} fallback={emptyBasketText} />
    );

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
                    <h2 className="Selected-items">Выбранные позиции:</h2>

                    {renderState(emptyOffer) ?? (
                        <div className="basket-preview-list">
                            {cart.items.map((item) => {
                                const image = getImage(item.image?.split(",")[0]);

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
                    <h2 className="basket-table-title">Состав заказа</h2>

                    {renderState(
                        <p className="basket-message">
                            Добавьте товары из каталога
                        </p>
                    ) ?? (
                        <div className="basket-table">
                            <div className="basket-table-header">
                                <span>Наименование</span>
                                <span>Объём / размер</span>
                                <span>Количество</span>
                                <span>Цена</span>
                            </div>

                            <div className="basket-rows">
                                {cart.items.map((item) => (
                                    <div className="basket-row" key={item.variantId}>
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
                                                    updateQuantity(item, item.quantity - 1)
                                                }
                                                disabled={updatingId === item.variantId}
                                                aria-label="Уменьшить количество"
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(item, item.quantity + 1)
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
                                            {formatPrice(item.price * item.quantity)}
                                        </div>

                                        <button
                                            type="button"
                                            className="basket-remove-button"
                                            onClick={() => removeItem(item.variantId)}
                                            disabled={updatingId === item.variantId}
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
                            <h3 className="promotional-code">Промокод</h3>

                            <div className="basket-promo-controls">
                                <input
                                    type="text"
                                    placeholder="Ввести..."
                                    className="promotional-code-input"
                                    value={promoInput}
                                    onChange={(e) =>
                                        setPromoInput(e.target.value.toUpperCase())
                                    }
                                    disabled={!!promo}
                                    maxLength={40}
                                />

                                {promo ? (
                                    <button
                                        type="button"
                                        className="promotional-code-button"
                                        onClick={removePromo}
                                    >
                                        Убрать
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="promotional-code-button"
                                        onClick={handleApplyPromo}
                                        disabled={
                                            promoLoading ||
                                            needLogin ||
                                            cart.items.length === 0
                                        }
                                    >
                                        {promoLoading ? "Проверяем..." : "Применить"}
                                    </button>
                                )}
                            </div>

                            {promoMessage && (
                                <p className={promo ? "basket-promo-ok" : "basket-promo-error"}>
                                    {promoMessage}
                                </p>
                            )}
                        </div>

                        <div className="basket-coins">
                            <h3 className="Pizza-Coins">Pizza Coins</h3>

                            <div className="pizza-Coins">450 шт.</div>

                            <button type="button" className="Write-off">
                                Списать
                            </button>
                        </div>
                    </div>

                    <div className="basket-footer">
                        <div className="basket-address">
                            <label
                                className="basket-address-label"
                                htmlFor="basket-address-input"
                            >
                                Адрес доставки
                            </label>
                            <input
                                id="basket-address-input"
                                type="text"
                                className="basket-address-input"
                                placeholder="Улица, дом, квартира"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                maxLength={300}
                            />
                        </div>

                        {promo && (
                            <div className="basket-summary">
                                <div className="basket-summary-row">
                                    <span>Сумма:</span>
                                    <span>{formatPrice(cart.total)}</span>
                                </div>
                                <div className="basket-summary-row basket-discount">
                                    <span>Скидка ({promo.code}):</span>
                                    <span>−{formatPrice(promo.discount)}</span>
                                </div>
                            </div>
                        )}

                        <div className="basket-total">
                            <span className="Total">Итого:</span>

                            <span className="total">{formatPrice(toPay)}</span>
                        </div>

                        {!needLogin && (
                            <div className="basket-balance">
                                Баланс: {balance === null ? "…" : formatPrice(balance)}{" "}
                                <Link to="/account" className="basket-link">
                                    Пополнить
                                </Link>
                            </div>
                        )}

                        {notEnough && cart.items.length > 0 && (
                            <p className="basket-warning">
                                Не хватает {formatPrice(toPay - balance)}.{" "}
                                <Link to="/account" className="basket-link">
                                    Пополнить баланс
                                </Link>
                            </p>
                        )}

                        {payError && <p className="basket-error">{payError}</p>}

                        {paidOrderId && (
                            <div className="basket-success">
                                Заказ №{paidOrderId} оплачен. Спасибо!{" "}
                                <Link to="/" className="basket-link">
                                    На главную
                                </Link>
                            </div>
                        )}

                        <button
                            type="button"
                            className="payment-button"
                            onClick={handlePay}
                            disabled={
                                loading ||
                                paying ||
                                needLogin ||
                                cart.items.length === 0
                            }
                        >
                            {paying ? "Оплачиваем..." : "Оплатить с баланса"}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Basket;