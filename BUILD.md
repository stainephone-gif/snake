# Инструкция по сборке APK

## Предварительные требования

1. **Node.js и npm** (версия 14 или выше)
   ```bash
   node --version
   npm --version
   ```

2. **Java Development Kit (JDK)** - версия 11 или выше
   ```bash
   java -version
   ```

3. **Android Studio** или **Android SDK Command-line Tools**
   - Скачайте с https://developer.android.com/studio
   - Установите Android SDK (API Level 24 или выше)

4. **Gradle** (обычно устанавливается с Android Studio)

5. **Apache Cordova CLI**
   ```bash
   npm install -g cordova
   ```

## Настройка переменных окружения

### Windows
```bash
set ANDROID_SDK_ROOT=C:\Users\YourUsername\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Java\jdk-11
```

### Linux/Mac
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
```

## Пошаговая сборка

### 1. Установка зависимостей

```bash
# Перейти в директорию проекта
cd snake

# Установить npm пакеты
npm install
```

### 2. Добавление платформы Android

```bash
# Добавить Android платформу
cordova platform add android

# Проверить требования
cordova requirements
```

### 3. Установка плагинов

Плагины уже прописаны в config.xml, но можно установить вручную:

```bash
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-media
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-whitelist
```

### 4. Создание иконок (опционально)

Если у вас есть исходное изображение 1024x1024px:

```bash
# Установить cordova-res
npm install -g cordova-res

# Создать все размеры иконок
cordova-res android --icon-source icon.png --splash-source splash.png
```

Или создать вручную иконки в директориях:
- `res/icon/android/` - размеры: ldpi (36x36), mdpi (48x48), hdpi (72x72), xhdpi (96x96), xxhdpi (144x144), xxxhdpi (192x192)
- `res/screen/android/` - splash экраны различных размеров

### 5. Сборка debug APK

```bash
# Собрать debug версию
cordova build android

# Файл будет в:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 6. Запуск на эмуляторе

```bash
# Запустить Android эмулятор из Android Studio
# Затем запустить:
cordova run android
```

### 7. Запуск на физическом устройстве

```bash
# Включите режим разработчика на Android устройстве
# Включите отладку по USB
# Подключите устройство к компьютеру

# Проверить подключение
adb devices

# Запустить приложение
cordova run android --device
```

### 8. Сборка release APK (для публикации)

#### 8.1 Создание ключа для подписи

```bash
keytool -genkey -v -keystore neon-snake.keystore -alias neon-snake -keyalg RSA -keysize 2048 -validity 10000
```

#### 8.2 Создание файла build.json

Создайте файл `build.json` в корне проекта:

```json
{
  "android": {
    "release": {
      "keystore": "neon-snake.keystore",
      "storePassword": "ваш_пароль",
      "alias": "neon-snake",
      "password": "ваш_пароль_ключа",
      "keystoreType": ""
    }
  }
}
```

#### 8.3 Сборка release APK

```bash
# Собрать release версию
cordova build android --release

# Файл будет в:
# platforms/android/app/build/outputs/apk/release/app-release.apk
```

#### 8.4 Проверка подписи

```bash
jarsigner -verify -verbose -certs platforms/android/app/build/outputs/apk/release/app-release.apk
```

#### 8.5 Оптимизация APK (zipalign)

```bash
# Путь к zipalign обычно:
# $ANDROID_SDK_ROOT/build-tools/[версия]/zipalign

zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release.apk neon-snake-release.apk
```

## Тестирование в браузере

Для быстрого тестирования можно открыть `www/index.html` в браузере:

```bash
# Запустить локальный сервер
python -m http.server 8000
# или
npx http-server www -p 8000

# Открыть в браузере:
# http://localhost:8000
```

**Примечание**: В браузере не будут работать функции Cordova (вибрация), но основная игра будет работать.

## Отладка

### Просмотр логов

```bash
# Android логи
adb logcat | grep Cordova
```

### Chrome DevTools для Android

1. Запустите приложение на устройстве
2. Откройте Chrome и перейдите на `chrome://inspect`
3. Выберите ваше устройство для отладки

## Решение частых проблем

### Ошибка: ANDROID_SDK_ROOT not set

Установите переменную окружения ANDROID_SDK_ROOT (см. выше)

### Ошибка: Gradle build failed

```bash
# Очистить кэш и пересобрать
cordova clean
cordova build android
```

### Ошибка: Unable to find platform

```bash
# Переустановить платформу
cordova platform remove android
cordova platform add android
```

### APK не устанавливается

- Проверьте, что включена установка из неизвестных источников
- Проверьте подпись APK
- Попробуйте пересобрать с `--debug`

## Публикация в Google Play Store

1. Создайте аккаунт разработчика Google Play (единоразовая оплата $25)
2. Подготовьте release APK (подписанный)
3. Создайте новое приложение в Google Play Console
4. Загрузите APK
5. Заполните описание, скриншоты, иконки
6. Отправьте на модерацию

## Обновление приложения

Для новой версии:

1. Измените версию в `config.xml`
2. Пересоберите APK
3. Загрузите новую версию в Google Play

## Дополнительные ресурсы

- [Документация Cordova](https://cordova.apache.org/docs/en/latest/)
- [Документация Android](https://developer.android.com/)
- [Руководство по публикации](https://developer.android.com/studio/publish)
