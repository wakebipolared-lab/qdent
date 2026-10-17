# Qdent: deployment на Netlify

## Тип проекта

Полностью статическое SPA: Vite 8 + React 19 + TypeScript. В проекте нет Next.js,
SSR, API routes, Server Actions, middleware, базы данных или authentication runtime.
Локали: `sk`, `en`, `de`, `ru`, `ukr`; для `ukr` HTML-язык остаётся `uk`.

## Параметры сборки

- Package manager: npm (`package-lock.json`)
- Node.js: 22.x
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: не требуются

`public/_redirects` отдаёт SPA entry point только для пяти существующих locale URL.
Неизвестные URL не перекрываются универсальным rewrite и остаются 404 Netlify.

## Готовая статическая загрузка

Загрузите `netlify-deploy.zip` через **Netlify Drop / Deploy manually**. Архив содержит
непосредственно содержимое `dist`, без дополнительной папки-обёртки.

## Deployment из проекта

Распакуйте `netlify-project.zip`, импортируйте проект в Netlify и запустите deploy.
Netlify прочитает `netlify.toml`, выполнит `npm run build` и опубликует `dist`.
Дополнительные plugins и environment variables не нужны.

## Проверка после deployment

Откройте `/sk`, `/en`, `/de`, `/ru`, `/ukr`, проверьте переключатель языка,
мобильное меню, форму записи и загрузку файлов из `/assets/`. Затем проверьте, что
несуществующий URL возвращает Netlify 404.
