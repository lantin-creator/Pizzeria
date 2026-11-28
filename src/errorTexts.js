const TEXTS = {
  PROMO_NOT_FOUND: "Такого промокода нет.",
  PROMO_EXPIRED: "Срок действия промокода истёк.",
  PROMO_MIN_TOTAL: "Сумма заказа слишком мала для этого промокода.",
  PROMO_EXHAUSTED: "Промокод уже закончился.",
  PROMO_ALREADY_USED: "Вы уже использовали этот промокод.",
  CART_EMPTY: "Корзина пуста.",
  INSUFFICIENT_FUNDS: "Недостаточно средств на балансе.",
  BAD_AMOUNT: "Сумма пополнения указана неверно.",
  BAD_INPUT: "Проверьте введённые данные.",
  WALLET_NOT_FOUND: "Кошелёк не найден.",
  ORDER_NOT_FOUND_OR_UNAVAILABLE: "Часть товаров из этого заказа сейчас недоступна.",
  NO_TOKEN: "Войдите в аккаунт, чтобы продолжить.",
  BAD_TOKEN: "Войдите в аккаунт, чтобы продолжить.",
};

export function errorText(err, fallback) {
  if (err?.code && TEXTS[err.code]) return TEXTS[err.code];
  if (err && !err.status) {
    return "Нет связи с сервером. Проверьте соединение и попробуйте ещё раз.";
  }
  return fallback;
}   