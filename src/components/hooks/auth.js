import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { ensureISODate } from "./dateUtils.js";

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  async function signUp({
    email,
    password,
    firstName,
    lastName,
    number,
    address,
    birthday,
    avatarFile,
  }) {
    setLoading(true);
    setError(null);
    setMessage("");

    let uploadedAvatarUrl = "";

    // Загрузка аватара
    if (avatarFile) {
  // Берём расширение из оригинального имени, приводим к нижнему регистру
  const ext = avatarFile.name.split(".").pop().toLowerCase();

  // Генерируем безопасное имя: только цифры, дефис и UUID
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(safeName, avatarFile, {
      contentType: avatarFile.type,
    });

  if (uploadError) {
    setError(uploadError);
    setMessage(`Ошибка загрузки аватара: ${uploadError.message}`);
    setLoading(false);
    return { success: false, error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(safeName);

  uploadedAvatarUrl = publicUrl;
}

    // Регистрация пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          number,
          addres: address, 
          birthday: ensureISODate(birthday),
          avatar: uploadedAvatarUrl,
        },
      },
    });

    if (error) {
      setError(error);
      setMessage(`Ошибка: ${error.message}`);
      setLoading(false);
      return { success: false, error };
    }

    setMessage("Регистрация успешна! Проверьте почту для подтверждения.");
    setLoading(false);
    return { success: true, data };
  }

  return { signUp, loading, error, message };
}

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  async function signIn({ email, password }) {
    setLoading(true);
    setError(null);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error);
      setMessage("Неверный email или пароль");
      setLoading(false);
      return { success: false, error };
    }

    setMessage("Вы вошли!");
    setLoading(false);
    return { success: true, data };
  }

  return { signIn, loading, error, message };
}

export function useSignOut() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return { signOut, loading };
}