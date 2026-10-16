import { Link } from "react-router-dom";
import { useState } from "react";
import { useSignUp } from "../../components/hooks/auth";
import "./Register.css";
import { formatBirthday } from "../../components/hooks/formatBirthday";
import { isValidBirthday } from "../../components/hooks/dateUtils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const { signUp, loading, message } = useSignUp();

  async function handleSignUp(e) {
    e.preventDefault();
    await signUp({
      email,
      password,
      firstName,
      lastName,
      number,
      address,
      birthday,
      avatarFile,
    });
  }

  return (
    <>
      <form>
        <button className="reg-btn-back" type="button">
          <Link to="/">← На страницу входа</Link>
        </button>
      </form>

      <form onSubmit={handleSignUp}>
        <div className="reg-title">Регистрация</div>

        <div className="Your-photo">Ваше фото:</div>
        <div className="upload-container">
          <input
            type="file"
            className="upload-button"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>

        <div className="Birthday"><h1>Дата рождения:</h1></div>
        <input
          className="birthday"
          value={birthday}
          onChange={(e) => setBirthday(formatBirthday(e.target.value))}
          onBlur={() => {
            if (birthday && !isValidBirthday(birthday)) {
            setBirthday("");
            alert("По вашей дате вы ещё не родились, исправьте пожалуйста)");
            }
          }}
          placeholder="дд.мм.гггг"
        />

        <div className="name"><h1>Ваше Имя:</h1></div>
        <input
          type="text"
          placeholder="Иван"
          className="Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <div className="mail"><h1>Электронная почта:</h1></div>
        <input
          type="email"
          placeholder="Ivanov@gmail.com"
          className="Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="second-name"><h1>Ваша Фамилия:</h1></div>
        <input
          type="text"
          placeholder="Иванов"
          className="Second-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <div className="reg-number"><h1>Номер телефона:</h1></div>
        <input
          type="text"
          placeholder="+Х ХХХ ХХХ ХХ ХХ"
          className="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <div className="addres"><h1>Адрес:</h1></div>
        <input
          type="text"
          placeholder="Москва"
          className="City"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="Password"><h1>Пароль:</h1></div>
        <input
          type="password"
          placeholder="Введите пароль"
          className="reg-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button id="Confirm" type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Подтвердить"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </>
  );
};

export default Register;