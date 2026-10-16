import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toISODate, ensureISODate  } from "./dateUtils.js";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError ?? new Error("Не авторизован"));
        setLoading(false);
        return;
      }

      // Берём из таблицы profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); 

      if (error) {
        console.error("Ошибка загрузки профиля:", error);
        setError(error);
        setLoading(false);
        return;
      }

      if (!data) {
        setProfile({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name ?? "",
          last_name: user.user_metadata?.last_name ?? "",
          number: user.user_metadata?.number ?? "",
          addres: user.user_metadata?.addres ?? "",
          birthday: user.user_metadata?.birthday ?? "",
          avatar: user.user_metadata?.avatar ?? "",
        });
      } else {
        setProfile({ ...data, email: user.email });
      }

      setLoading(false);
    }

    load();
  }, []);


  async function updateProfile(fields) {
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log("USER.ID:", user?.id);
    if (userError || !user) {
      setMessage("Нет активной сессии");
      return { success: false, error: userError };
    }

    const payload = {
    ...fields,
    birthday: ensureISODate(fields.birthday),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Ошибка обновления profiles:", error);
      setMessage(`Ошибка: ${error.message}`);
      return { success: false, error };
    }

    if (!data || data.length === 0) {
      console.warn("UPDATE не изменил ни одной строки. Проверь RLS-политику.");
      setMessage("Не удалось сохранить: проверь политику RLS на profiles.");
      return { success: false };
    }

    // Синхронизируем user_metadata, чтобы при следующем входе данные не «откатились»
    const { error: metaError } = await supabase.auth.updateUser({
      data: fields,
    });

    if (metaError) {
      console.warn("Не удалось обновить user_metadata:", metaError);
    }

    // Обновляем локальный стейт
    setProfile((prev) => ({ ...prev, ...fields }));
    setMessage("Изменения сохранены!");
    return { success: true, data };
  }


  return { profile, loading, error, message, updateProfile };
}