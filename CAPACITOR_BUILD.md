# 🚀 Сборка APK с Capacitor

Capacitor - современный фреймворк для создания мобильных приложений. Он намного проще в настройке чем Cordova!

## ✅ Преимущества Capacitor

- Автоматическая настройка Android SDK
- Проще интеграция с Android Studio
- Меньше ошибок при сборке
- Современный API
- Лучшая производительность

## 📋 Требования

1. **Node.js** 16+
2. **Android Studio** (последняя версия)
3. **Java JDK** 17+ (встроенный в Android Studio)

## 🎯 Установка за 3 шага

### Шаг 1: Установка зависимостей

```bash
cd snake
npm install
```

Это установит Capacitor CLI и все необходимые пакеты.

### Шаг 2: Инициализация Android платформы

```bash
npx cap add android
```

Эта команда:
- Создаст папку `android/` с полноценным Android проектом
- Автоматически настроит все пути
- Скопирует ваши файлы из `www/` в проект

### Шаг 3: Синхронизация кода

```bash
npx cap sync android
```

Эта команда копирует ваш веб-код в Android проект.

**Важно:** Запускайте `cap sync` каждый раз после изменения файлов в `www/`!

## 📱 Сборка APK

### Способ 1: Через Android Studio (Рекомендуется)

```bash
# Открыть проект в Android Studio
npx cap open android
```

Это откроет Android Studio с правильно настроенным проектом!

Затем в Android Studio:

1. Подождите завершения Gradle Sync (внизу справа)
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Готово! APK будет в `android/app/build/outputs/apk/debug/`

### Способ 2: Через командную строку

```bash
# Войти в папку android
cd android

# Собрать debug APK
./gradlew assembleDebug

# APK будет здесь:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Windows PowerShell:
```powershell
cd android
.\gradlew.bat assembleDebug
```

## 🔄 Workflow разработки

После изменения кода в `www/`:

```bash
# 1. Синхронизировать изменения
npx cap sync android

# 2. Открыть в Android Studio (если нужно)
npx cap open android

# 3. Или собрать через CLI
cd android && ./gradlew assembleDebug
```

## 📲 Запуск на устройстве

### На эмуляторе:

```bash
# Запустить эмулятор из Android Studio
# Затем:
npx cap run android
```

### На физическом устройстве:

```bash
# Подключите телефон по USB
# Включите USB debugging
npx cap run android
```

Или в Android Studio просто нажмите зелёную кнопку ▶️ Run!

## 🔐 Создание Release APK

### Шаг 1: Создать Keystore

```bash
keytool -genkey -v -keystore neon-snake.keystore -alias neon-snake -keyalg RSA -keysize 2048 -validity 10000
```

Сохраните пароли!

### Шаг 2: Настроить подпись

Создайте файл `android/keystore.properties`:

```properties
storeFile=../neon-snake.keystore
storePassword=ваш_пароль
keyAlias=neon-snake
keyPassword=ваш_пароль_ключа
```

### Шаг 3: Обновить build.gradle

Откройте `android/app/build.gradle` и добавьте перед `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('keystore.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Шаг 4: Собрать Release APK

```bash
cd android
./gradlew assembleRelease

# APK будет здесь:
# android/app/build/outputs/apk/release/app-release.apk
```

## 🐛 Отладка

### Просмотр логов:

```bash
npx cap run android -l
```

Или используйте Android Studio Logcat:
```
View → Tool Windows → Logcat
```

### Chrome DevTools:

1. Запустите приложение на устройстве
2. Откройте Chrome: `chrome://inspect`
3. Найдите ваше устройство и нажмите "inspect"

## 🔍 Частые проблемы

### "SDK location not found"

**Решение:** Android Studio автоматически настроит SDK при открытии проекта через `npx cap open android`

### "Gradle sync failed"

**Решение:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Изменения не применяются

**Решение:** Всегда запускайте `npx cap sync` после изменения файлов!

```bash
npx cap sync android
```

## 📦 Структура проекта

```
snake/
├── www/                    # Ваш веб-код
│   ├── index.html
│   ├── css/
│   └── js/
├── android/               # Сгенерированный Android проект
│   └── app/
│       └── src/
│           └── main/
│               └── assets/www/   # Копия www/
├── capacitor.config.ts    # Конфигурация Capacitor
└── package.json
```

## 🎨 Изменение иконки и названия

### Название приложения:

В `capacitor.config.ts`:
```typescript
appName: 'Neon Snake'
```

### Иконка:

Поместите иконки в:
```
android/app/src/main/res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

Или используйте инструмент:
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --android
```

## ⚡ Полезные команды

```bash
# Обновить всё
npx cap sync

# Открыть в Android Studio
npx cap open android

# Запустить на устройстве
npx cap run android

# Проверить доктора Capacitor
npx cap doctor

# Обновить Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest
npx cap sync
```

## 🆚 Capacitor vs Cordova

| Особенность | Capacitor | Cordova |
|-------------|-----------|---------|
| Настройка SDK | Автоматическая ✅ | Ручная ❌ |
| Интеграция с IDE | Отличная ✅ | Средняя ⚠️ |
| Современность | Новый ✅ | Устаревший ⚠️ |
| Простота | Проще ✅ | Сложнее ❌ |
| Ошибки сборки | Меньше ✅ | Больше ❌ |

## 📚 Дополнительные ресурсы

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/studio)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

---

**Вот и всё!** Сборка с Capacitor намного проще чем с Cordova 🚀

Если возникнут проблемы - в 90% случаев помогает:
```bash
npx cap sync android
```
