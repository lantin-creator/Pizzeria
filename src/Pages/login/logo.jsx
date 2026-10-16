import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./logo.css";
import { useSignIn } from "../../components/hooks/auth";

const Logo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, message } = useSignIn();
  const navigate = useNavigate(); // ← получаем функцию

  async function handleSignIn(e) {
    e.preventDefault();
    const result = await signIn({ email, password });

    if (result.success) {
      navigate("/account"); // ← ведём на /account, а не на /profile
    }
  }

  return (
    <>
      <form>
        <button className="btn-back" type="button">
          <Link to="/">← На главную</Link>
        </button>
      </form>

      <div className="card-logo">
        <form className="login-front" onSubmit={handleSignIn}>
          <div className="Entrance">
            <h1>Вход</h1>
          </div>

          <input
            className="number-logo"
            placeholder="Введите вашу почту"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            className="password-logo"
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="Register-logo">
            <Link to="/register">Зарегистрироваться</Link>
          </div>

          <button className="Send-code" type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </>
  );
};

export default Logo;