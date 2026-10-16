import { Link } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
  return (
    <div className="nf-wrapper">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <div className="nf-title">Страница не найдена или пока не добавлена</div>
        <div className="nf-text">
          Возможно, она была удалена, либо вы перешли по неверной ссылке.
          <br />
          Но горячая пицца всегда ждёт вас на главной!
        </div>
        <Link to="/" className="nf-button">
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;