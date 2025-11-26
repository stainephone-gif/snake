# 🚀 Быстрый старт

## Тестирование в браузере (самый быстрый способ)

```bash
# Просто откройте файл в браузере
open test-browser.html
# или
firefox test-browser.html
# или
google-chrome test-browser.html
```

Или используйте локальный сервер:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# Затем откройте http://localhost:8000/test-browser.html
```

**Управление в браузере:** Используйте клавиши-стрелки или WASD

## Сборка APK для Android

### Шаг 1: Установка зависимостей

```bash
# Установить npm пакеты
npm install

# Установить Cordova глобально (если еще не установлен)
npm install -g cordova
```

### Шаг 2: Добавление платформы Android

```bash
# Добавить Android
cordova platform add android

# Проверить требования
cordova requirements
```

Если `cordova requirements` показывает ошибки, установите:
- Java JDK 11+
- Android SDK
- Gradle

### Шаг 3: Сборка

```bash
# Debug версия (для тестирования)
cordova build android

# Файл будет здесь:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Шаг 4: Установка на устройство

```bash
# Подключите Android устройство по USB
# Включите режим разработчика и отладку по USB

# Установить и запустить
cordova run android --device
```

## Быстрые команды

```bash
# Очистка проекта
cordova clean

# Пересборка
cordova build android

# Запуск на эмуляторе
cordova run android

# Запуск на устройстве
cordova run android --device

# Просмотр логов
adb logcat | grep Cordova
```

## Структура проекта

```
snake/
├── www/              # Ваш код здесь
│   ├── index.html   # Главный файл
│   ├── css/         # Стили
│   └── js/          # JavaScript
├── config.xml       # Настройки Cordova
└── package.json     # Зависимости
```

## Редактирование игры

Все файлы игры находятся в папке `www/`:

- **www/index.html** - структура интерфейса
- **www/css/style.css** - дизайн и анимации
- **www/js/game.js** - логика игры

После изменений пересоберите:

```bash
cordova build android
```

## Проблемы?

### "cordova: command not found"

```bash
npm install -g cordova
```

### "ANDROID_SDK_ROOT is not set"

Установите переменную окружения:

```bash
# Linux/Mac
export ANDROID_SDK_ROOT=$HOME/Android/Sdk

# Windows
set ANDROID_SDK_ROOT=C:\Users\YourName\AppData\Local\Android\Sdk
```

### "Gradle build failed"

```bash
cordova clean
cordova build android
```

### APK не устанавливается

- Включите "Установка из неизвестных источников" в настройках Android
- Проверьте, что APK подписан правильно

## Дополнительная документация

- [BUILD.md](BUILD.md) - Подробная инструкция по сборке
- [README.md](README.md) - Полное описание игры
- [res/ICONS.md](res/ICONS.md) - Генерация иконок

## Требования

- **Node.js** 14+
- **Java JDK** 11+
- **Android SDK** API Level 24+
- **Cordova** 12+

## Особенности игры

- 🌀 Порталы для телепортации
- ⚡ Power-ups: щит, магнит, удвоенные очки
- 🧱 Препятствия на поле
- 🎨 Неоновый киберпанк дизайн
- 📱 Свайп-управление
- 📳 Вибрация
- 💾 Сохранение прогресса

## Следующие шаги

1. Протестируйте игру в браузере
2. Соберите debug APK
3. Установите на устройство
4. Настройте иконки (см. res/ICONS.md)
5. Соберите release APK для публикации

Удачи! 🎮
