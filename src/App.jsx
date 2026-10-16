import './App.css';
import Btn from './components/Btn/btn';
import Menu from './components/Menu/Menu';
import Catalog from './components/catalog/catalog';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Basket from './Pages/Bascet/bascet';
import BtnFloat from './components/Btn/btn float';
import NotFound from './Pages/404/NotFound';
import useFloatingBtn from './components/hooks/useFloatingBtn';
import CallbackModal from './components/CallbackForm/CallbackForm';
import { useState } from 'react';
import Logo from './Pages/login/logo';
import Register from './Pages/Register/Register';
import Account from './Pages/Account/Account';

const Home = () => {
  const FloatingBtn = useFloatingBtn('main');
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <div>
      <div id="main">
        <div className="logo"></div>
        <nav>
          <Link to="/logo">
            <div className="user"></div>
          </Link>
        </nav>
        <div className="name-logo">Pizza Online</div>
        <div className="Delivery">
          Доставка по всей <span style={{ color: '#DF4E00' }}>Москве</span>
        </div>
        <div className="min">От 30 минут. Круглосуточно</div>
        <div className="plus-cards">
          <div className="hot"></div>
          <div className="Over100">Более 100 точек</div>
          <div className="Over100-2">по всей Москве</div>
          <div className="like"></div>
          <pre className="Over1500">
            {`Более 1500 
Довольных 
клиентов`}
          </pre>
          <div className="medal"></div>
          <div className="years10">10 лет на</div>
          <div className="years10-2">рынке</div>
        </div>
        <Btn href = "#catalog" className = "btn-order" children = "Заказать пиццу"/>
        <Menu onOpenCallback={() => setIsCallbackOpen(true)} />
        <BtnFloat href = "#main" className = "floating-btn" visible={FloatingBtn}/>
      </div>

      <div id="catalog">
        <Catalog />
      </div>

      <div id="Reviews-about-us">
        <h1 className="Reviews-about-us-title">Отзывы о нас</h1>
        <div className="Reviews1-card">
          <div className="user2"></div>
          <div className="user2-name">Мария Поподько</div>
          <div className="star1"></div>
          <div className="star2"></div>
          <div className="star3"></div>
          <div className="star4"></div>
          <div className="star5"></div>
          <pre className="text-user2">
            {`Доставили быстро, все доставлено в целости 
и сохранности. Пицца тёплая. Сервисом оста- 
-лись довольны`}
          </pre>
        </div>
        <div className="Reviews2-card"></div>
        <div className="Reviews3-card"></div>
      </div>

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />

      <footer id="footer">
        <div className="Text-footer">Мы в соцсетях:</div>
        <div className="instagram"></div>
        <div className="youtube"></div>
        <div className="twiter"></div>
        <div className="tg"></div>
        <div className="Work-with-us">Работать с нами</div>
        <div className="numberApp">+ Х ХХХ ХХХ ХХ ХХ</div>
        <div className="email">RabotaPizzaOnline@gmail.com</div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/Pizzeria/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bascet" element={<Basket />}/>
        <Route path="/logo" element={<Logo />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;