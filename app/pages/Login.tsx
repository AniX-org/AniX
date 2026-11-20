"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "#/store/auth";
import { setJWT, tryCatchAPI } from "#/api/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeMode } from "flowbite-react";
import { toast } from "react-toastify";
import { ENDPOINTS } from "#/api/config";

export function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const userStore = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || null;
  const theme = useThemeMode();
  const [isSending, setIsSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setIsSending(true);

    const tid = toast.loading("Выполняем вход...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    const { data, error } = await tryCatchAPI(
      fetch(
        `${ENDPOINTS.user.auth}?login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            Sign: "9aa5c7af74e8cd70c86f7f9587bde23d",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      ),
    );

    if (error) {
      let message = `Ошибка получения пользователя, code: ${error.code}`;
      if (error.code == 2) {
        message = "Такого пользователя не существует";
      }
      if (error.code == 3) {
        message = "Неправильно указан логин или пароль";
      }
      toast.update(tid, {
        render: message,
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setIsSending(false);
      return;
    }

    if (!data.profileToken) {
      toast.update(tid, {
        render: "Не удалось войти в аккаунт",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setIsSending(false);
      return;
    }

    userStore.login(data.profile, data.profileToken.token);
    if (remember) {
      setJWT(data.profile.id, data.profileToken.token);
    }

    toast.update(tid, {
      render: "Вход успешен!",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });
  }

  useEffect(() => {
    if (userStore.user) {
      router.push(`${redirect || "/"}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user]);

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Вход в аккаунт Anixart
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              method="POST"
              onSubmit={submit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Логин или эл. почта
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required={true}
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Запомнить вход
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
