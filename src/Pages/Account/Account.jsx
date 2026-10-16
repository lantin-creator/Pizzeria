import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../../components/hooks/useProfile";
import { supabase } from "../../components/lib/supabase";
import "./Account.css";

export default function Account() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/logo");
    });
  }, [navigate]);
  const { profile, loading, error, updateProfile } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setNumber(profile.number ?? "");
    setAddress(profile.addres ?? "");
    setBirthday(profile.birthday ?? "");
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      first_name: firstName,
      last_name: lastName,
      number,
      addres: address,
      birthday,
    });
    setSaving(false);
  }

  if (loading) return <p style={{ color: "white" }}>Загрузка профиля...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error.message}</p>;
  if (!profile) return <p style={{ color: "white" }}>Профиль не найден</p>;

  return (
    <div className="account-page">
      <button className="account-btn-back" type="button">
        <Link to="/">← На главную</Link>
      </button>

      <img
        src={profile.avatar || "https://via.placeholder.com/150?text=No+Avatar"}
        alt="Аватар"
        className="account-avatar"
      />

      <form onSubmit={handleSave}>
        <div className="account-info-row">
          <div className="account-name-label">Имя:</div>
          <input
            className="account-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="account-info-row">
          <div className="account-second-name-label">Фамилия:</div>
          <input
            className="account-second-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="account-info-row">
          <div className="account-number-label">Номер телефона:</div>
          <input
            className="account-number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div className="account-info-row">
          <div className="account-mail-label">Электронная почта:</div>
          <div className="account-mail">{profile.email}</div>
        </div>

        <div className="account-info-row">
          <div className="account-birthday-label">Дата рождения:</div>
          <div className="account-birthday-wrap">
            <input
              className="account-birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <span className="account-god">г.</span>
          </div>
        </div>

        <div className="account-info-row">
          <div className="account-city-label">Город проживания:</div>
          <input
            className="account-city"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button className="account-save" type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
}