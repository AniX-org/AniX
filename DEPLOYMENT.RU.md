# Развёртывание приложения AniX

## Доступные переменные окружения

- NEXT_PUBLIC_BASE_PATH (префикс пути, например `/anixart`; задаётся до сборки без завершающего `/`)
- NEXT_PUBLIC_PLAYER_PARSER_URL ([player-parser](https://github.com/AniX-org/anix-player-parser) суб-сервис, если был развёрнут)
- NEXT_PUBLIC_API_URL ([api-prox](https://github.com/AniX-org/anix-api-prox) суб-сервис, если был развёрнут)
- NEXT_PUBLIC_SHARE_PREFIX ([anix-preview](https://github.com/AniX-org/anix-preview) суб-сервис, если был развёрнут, не указывайте, для использования официальной ссылки anixart "Поделится")
- METADATA_BASE_URL (DEPRECATED: используйте anix-preview | установите значение на домен по которому будет доступен клиент, превью не будет работать, если требуется доступ с авторизацией перед заходом на сайт)
- NEXT_PUBLIC_ANILIBRIA_API_URL - Ссылка на API Anilibria, заполняется если основной домен не доступен, используется для поиска торрентов анилибрии
- NEXT_PUBLIC_TORAPI_API_URL - Ссылка на [torApi](https://github.com/Lifailon/TorAPI), используется для поиска торрентов rutracker, rutor, kinozal, nonameclub

## Vercel

Требования:

- аккаунт GitHub
- аккаунт Vercel

1. Создайте форк репозитория

    ![fork button](./docs/deploy/fork.png)

2. Войдите в аккаунт Vercel

> [!IMPORTANT]
> Аккаунт Vercel должен быть связан с аккаунтом GitHub.
>
> Если у вас нет аккаунта Vercel, то создайте его через вход с помощью GitHub.

3. Нажмите кнопку создать новый проект

    ![vercel new project button](./docs/deploy/vercel_new_project.png)

4. Нажмите кнопку импортировать напротив названия репозитория

    ![vercel import button](./docs/deploy/vercel_import.png)

5. (опционально) добавьте переменные для использования своего плеера и\или API прокси:

    [Доступные переменные окружения](#доступные-переменные-окружения)

    ![vercel project settings](./docs/deploy/vercel_project.png)

6. нажмите кнопку "Deploy" и ожидайте пока не появится подтверждение
7. нажмите кнопку "Continue to Dashboard"
8. клиент будет доступен по ссылке такого вида, нажмите на неё чтобы его открыть
    ![vercel project url](./docs/deploy/vercel_url.png)

## Netlify

Требования:

- аккаунт GitHub
- аккаунт Netlify

1. Создайте форк репозитория

    ![fork button](./docs/deploy/fork.png)

2. Войдите в аккаунт Netlify

> [!IMPORTANT]
> Аккаунт Netlify должен быть связан с аккаунтом GitHub.
>
> Если у вас нет аккаунта Netlify, то создайте его через вход с помощью GitHub.

3. Нажмите кнопку создать новый проект

    ![netlify new project button](./docs/deploy/netlify_new_project.png)

4. Нажмите кнопку GitHub

    ![netlify provider choice](./docs/deploy/netlify_provider.png)

5. Нажмите на название репозитория

    ![netlify import button](./docs/deploy/netlify_import.png)

6. (опционально) заполните название проекта

    ![netlify project name](./docs/deploy/netlify_project_name.png)

7. (опционально) добавьте переменную для использования своего плеера и\или API прокси::

    [Доступные переменные окружения](#доступные-переменные-окружения)

    1. ![alt text](./docs/deploy/netlify_env_1.png)

    2. ![alt text](./docs/deploy/netlify_env_2.png)

8. нажмите кнопку "Deploy" и ожидайте пока не появится подтверждение

9. клиент будет доступен по ссылке такого вида, нажмите на неё чтобы его открыть

    ![netlify project url](./docs/deploy/netlify_url.png)

## Docker

Требования:

- [docker](https://docs.docker.com/engine/install/)

### Пре-билд

1. выполните команду:

`docker run -d --name anix -p 3000:3000 radiquum/anix:latest`

### Ручной билд

Доп. Требования:

- [git](https://git-scm.com/)

1. Клонируйте репозиторий `git clone https://github.com/Radiquum/AniX`
2. Переместитесь в директорию репозитория `cd AniX`
3. Выполните команду `docker build -t anix .`
4. После окончания, выполните команду: `docker run -d --restart always --name anix -p 3000:3000 anix`

### docker/Обозначения

- -d - запустить контейнер в фоне
- --restart always - всегда запускать после перезагрузки сервера
- --name - название контейнера
- -p - порт контейнера который будет доступен извне. ПОРТ:3000

> [!NOTE]
> ПОДСКАЗКА: для установки переменных, необходимо использовать `-e ПЕРЕМЕННАЯ=ЗНАЧЕНИЕ` до последнего слова anix
>
> `NEXT_PUBLIC_BASE_PATH` задаётся во время ручной сборки: `docker build --build-arg NEXT_PUBLIC_BASE_PATH=/anixart -t anix .`

[Доступные переменные окружения](#доступные-переменные-окружения)

[команда docker run](https://docs.docker.com/reference/cli/docker/container/run/)

### docker/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP><:ВАШ ПОРТ>/`

### docker/Примечание

Для использования своего домена и поддержки протокола HTTPS, вы можете использовать Traefik или другой reverse-proxy, с сертификатом SSL.

Полезные ссылки:

- [Конвертер из команды docker run в синтакс для docker compose](https://it-tools.tech/docker-run-to-docker-compose-converter)
- [Как настроить Traefik + свой домен + SSL](https://letmegooglethat.com/?q=how+to+setup+traefik+with+custom+domain+and+ssl+certificate+from+lets+encrypt%3F)

## pm2

Требования:

- [Node.js 24 LTS с npm](https://nodejs.org/)
- [pm2](https://pm2.keymetrics.io/)

Если вы используете nvm, команда `nvm install` в каталоге проекта установит и сразу активирует версию из `.nvmrc`.

```bash
git clone https://github.com/AniX-org/AniX.git
cd AniX
npm ci
npm run build
pm2 start .next/standalone/server.js --name anix
```

Для собственных настроек скопируйте `.env.sample` в `.env` и заполните [переменные окружения](#доступные-переменные-окружения) перед `npm run build`.

Используйте `npm ci`, чтобы установить версии из `package-lock.json`. Не запускайте `npm audit fix --force`: эта команда может заменить зависимости несовместимыми мажорными версиями и сломать сборку.

### pm2/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP>:3000/`

Стандартные значения — `HOSTNAME=0.0.0.0` и `PORT=3000`. Задавайте их перед `pm2 start` только если требуется другой адрес или порт.

### pm2/Автозапуск после перезагрузки

Автозапуск не нужен для первого запуска приложения. Чтобы включить его:

1. Выполните `pm2 startup`.
2. Выполните команду, которую выведет PM2.
3. Сохраните текущий список процессов командой `pm2 save`.
