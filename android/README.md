# Android офлайн-сборка

Структура модуля Android соответствует стандартному шаблону React Native CLI. Положите Gradle wrapper, скачанные артефакты и Maven-репозитории в этот каталог до запуска сборки.

## Основные шаги
1. Скопируйте предзагруженные папки `gradle/`, `.gradle/` и offline-репозитории в каталог `android/`.
2. Убедитесь, что `local.properties` указывает на локальные SDK/NDK.
3. Запустите `npm run android:offline` для сборки APK в режиме офлайн.
4. Для варианта с SQLite поместите файл `rf_codes.db` в `android/app/src/main/res/raw/`.
