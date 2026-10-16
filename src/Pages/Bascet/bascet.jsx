import React from 'react';
import './bascet.css';
import { Link } from "react-router-dom";

const Basket = () => {
    return (
        <>
            <h1>
                <div className="bascet">Корзина</div>
            </h1>

            <nav>
                <Link to="/" className="back-card">
                    <div className="back"></div>
                    <div className="back-text">Вернутся</div>
                </Link>
            </nav>

            <div className="Selected-items">Выбранные позиции:</div>

            <div className="card1">
                <div className="card1-text">Пицца пепперони</div>
                <div className="card1-img"></div>
                <div className="Kol-vo"> - 1 шт.</div>
                <div
                    style={{
                        fontSize: '30px',
                        position: 'absolute',
                        top: '83%',
                        left: '70%',
                        color: 'white',
                    }}
                >
                    +
                </div>
            </div>

            <div className="card2">
                <div className="card2-text">Пицца пепперони</div>
                <div className="card2-img"></div>
                <div className="Kol-vo2"> - 1 шт.</div>
                <div
                    style={{
                        fontSize: '30px',
                        position: 'absolute',
                        top: '83%',
                        left: '70%',
                        color: 'white',
                    }}
                >
                    +
                </div>
            </div>

            <div className="Positions">
                <div className="Name">Наименование</div>
                <div className="Volume-Length">Обьем/Длина</div>
                <div className="kol-vo">Количество</div>
                <div className="price">Цена</div>

                <div className="name1">Пицца пеперони</div>
                <div className="Kol2-vo2"> - 1 шт.</div>
                <div className="volume-length1">30 См</div>
                <div className="Kol-vo1"> - 1 шт.</div>
                <div className="price1">400 Руб</div>

                <div className="name2">Кола обычная</div>
                <div className="volume-length2">500 Мл</div>
                <div className="price2">150 Руб</div>

                <div className="promotional-code">Промокод</div>
                <input
                    type="text"
                    placeholder="Ввести..."
                    className="promotional-code-input"
                />
                <button className="promotional-code-button">Применить</button>

                <div className="Pizza-Coins">Pizza Coins</div>
                <div className="pizza-Coins">450 шт.</div>
                <div className="Write-off">Списать</div>

                <div className="Total">Итого:</div>
                <div className="total">550 Рублей</div>

                <button className="payment-button">Перейти к оплате</button>
            </div>
        </>
    );
};

export default Basket;