# 🎯 Сборка через Android Studio

Это руководство покажет, как собрать Neon Snake APK используя Android Studio вместо командной строки.

## 📋 Предварительные требования

1. **Android Studio** - скачайте с https://developer.android.com/studio
2. **Node.js и npm** - для установки Cordova
3. **Cordova CLI** - установите глобально

```bash
npm install -g cordova
```

## 🚀 Пошаговая инструкция

### Шаг 1: Подготовка проекта Cordova

Сначала нужно подготовить проект через командную строку:

```bash
# Перейти в директорию проекта
cd snake

# Установить зависимости
npm install

# Добавить Android платформу
cordova platform add android

# Подготовить проект (важно!)
cordova prepare android
```

Эта команда создаст полноценный Android проект в папке `platforms/android/`.

### Шаг 2: Открытие проекта в Android Studio

1. Запустите **Android Studio**

2. Выберите **"Open an Existing Project"** (или File → Open)

3. Перейдите в папку вашего проекта и выберите:
   ```
   snake/platforms/android/
   ```

   **Важно:** Открывайте именно папку `platforms/android/`, а не корневую папку проекта!

4. Нажмите **"OK"**

5. Android Studio начнёт импорт проекта и синхронизацию Gradle.
   Дождитесь окончания процесса (может занять несколько минут).

### Шаг 3: Настройка Android Studio

#### 3.1 Проверка SDK

1. Откройте **File → Project Structure** (или Ctrl+Alt+Shift+S)

2. В разделе **"Project"** проверьте:
   - **Android Gradle Plugin Version**: должна быть 7.0+
   - **Gradle Version**: должна быть 7.0+

3. В разделе **"SDK Location"** убедитесь, что путь к Android SDK указан правильно:
   ```
   C:\Users\YourName\AppData\Local\Android\Sdk  (Windows)
   ~/Android/Sdk  (Linux)
   ~/Library/Android/sdk  (Mac)
   ```

#### 3.2 Настройка устройства

**Для эмулятора:**

1. Откройте **Tools → Device Manager**
2. Создайте виртуальное устройство (если нет):
   - Нажмите **"Create Device"**
   - Выберите устройство (например, Pixel 4)
   - Выберите System Image (API 30 или выше)
   - Нажмите **"Finish"**

**Для физического устройства:**

1. На Android устройстве:
   - Включите **"Режим разработчика"** (Settings → About phone → тапните 7 раз по "Build number")
   - Включите **"USB debugging"** (Settings → Developer options → USB debugging)

2. Подключите устройство по USB

3. В Android Studio устройство появится в списке устройств

### Шаг 4: Сборка Debug APK

#### Способ 1: Через меню Build

1. В меню выберите **Build → Build Bundle(s) / APK(s) → Build APK(s)**

2. Дождитесь окончания сборки (внизу справа будет прогресс)

3. Когда сборка завершится, появится уведомление:
   ```
   APK(s) generated successfully
   ```

4. Нажмите **"locate"** чтобы открыть папку с APK:
   ```
   snake/platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Способ 2: Через Gradle Panel

1. Откройте **Gradle Panel** (правая сторона окна)

2. Разверните дерево:
   ```
   :app → Tasks → build
   ```

3. Дважды кликните на **"assembleDebug"**

4. APK будет создан в той же папке

### Шаг 5: Запуск приложения

#### На эмуляторе:

1. Выберите эмулятор в списке устройств (верхняя панель)

2. Нажмите зелёную кнопку **"Run"** (▶️) или Shift+F10

3. Приложение установится и запустится автоматически

#### На физическом устройстве:

1. Убедитесь, что устройство подключено и распознано

2. Выберите устройство в списке

3. Нажмите **"Run"** (▶️)

4. На устройстве разрешите установку (если попросит)

### Шаг 6: Создание Release APK (для публикации)

#### 6.1 Создание Keystore

В терминале Android Studio (View → Tool Windows → Terminal):

```bash
keytool -genkey -v -keystore neon-snake.keystore -alias neon-snake -keyalg RSA -keysize 2048 -validity 10000
```

Введите пароли и данные. Keystore файл будет создан в текущей директории.

**⚠️ Важно:** Сохраните keystore файл и пароли в безопасном месте! Без них вы не сможете обновлять приложение в Google Play.

#### 6.2 Настройка подписи в Android Studio

1. Откройте **Build → Generate Signed Bundle / APK**

2. Выберите **APK** → Next

3. Укажите путь к keystore:
   - **Key store path**: путь к `neon-snake.keystore`
   - **Key store password**: ваш пароль
   - **Key alias**: `neon-snake`
   - **Key password**: ваш пароль ключа

4. Можете сохранить эти данные, поставив галочку **"Remember passwords"**

5. Нажмите **Next**

6. Выберите вариант сборки:
   - **Build Variants**: release
   - **Signature Versions**: V1 и V2 (оба)

7. Нажмите **Finish**

8. APK будет создан в:
   ```
   snake/platforms/android/app/release/app-release.apk
   ```

### Шаг 7: Отладка

#### Просмотр логов (Logcat)

1. Откройте **View → Tool Windows → Logcat**

2. Фильтры для поиска:
   - Поиск по: `Cordova`
   - Или по: `SystemWebChromeClient`
   - Или по: `Console`

3. Здесь вы увидите все console.log() из JavaScript

#### Chrome DevTools для отладки JavaScript

1. Запустите приложение на устройстве/эмуляторе

2. Откройте Chrome браузер на компьютере

3. Перейдите на: `chrome://inspect`

4. В разделе "Remote Target" найдите ваше устройство

5. Нажмите **"inspect"** под именем приложения

6. Откроется полноценный DevTools с:
   - Console для просмотра логов
   - Elements для изучения HTML/CSS
   - Sources для отладки JavaScript
   - Network для мониторинга запросов

### Шаг 8: Внесение изменений

Если вы хотите изменить код игры:

1. **НЕ редактируйте файлы в `platforms/android/`!**

   Эти файлы генерируются автоматически и будут перезаписаны.

2. **Редактируйте файлы в `www/`:**
   - `www/index.html`
   - `www/css/style.css`
   - `www/js/game.js`

3. После изменений выполните в терминале:
   ```bash
   cordova prepare android
   ```

   Эта команда скопирует изменения в `platforms/android/`

4. Android Studio автоматически обнаружит изменения

5. Пересоберите проект (Build → Build Bundle(s) / APK(s))

### Шаг 9: Оптимизация APK

После создания release APK, оптимизируйте его:

```bash
# Найти zipalign (в Android SDK)
# Windows
C:\Users\YourName\AppData\Local\Android\Sdk\build-tools\[версия]\zipalign.exe

# Linux/Mac
~/Android/Sdk/build-tools/[версия]/zipalign

# Использование
zipalign -v 4 app-release.apk neon-snake-final.apk
```

## 🎯 Полезные советы

### Горячие клавиши Android Studio

- **Shift+F10** - Запустить приложение
- **Ctrl+F9** - Собрать проект
- **Shift+F9** - Запустить с отладкой
- **Ctrl+Alt+Shift+S** - Project Structure
- **Alt+6** - Открыть Logcat

### Очистка проекта

Если возникают проблемы:

1. В Android Studio: **Build → Clean Project**
2. Затем: **Build → Rebuild Project**
3. Или через терминал:
   ```bash
   cordova clean
   cordova prepare android
   ```

### Ускорение сборки

В `gradle.properties` (platforms/android/gradle.properties) добавьте:

```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m
org.gradle.parallel=true
org.gradle.daemon=true
org.gradle.configureondemand=true
```

### Изменение версии приложения

Редактируйте `config.xml` в корне проекта:

```xml
<widget id="com.neonsnake.game" version="1.0.1">
```

Затем выполните `cordova prepare android`.

## ❗ Частые проблемы

### "SDK location not found"

**Решение:**
1. File → Project Structure → SDK Location
2. Укажите путь к Android SDK
3. Примените изменения

### "Gradle sync failed"

**Решение:**
1. File → Invalidate Caches / Restart
2. Или удалите папку `.gradle` в `platforms/android/`
3. Rebuild проект

### "Unable to find Java"

**Решение:**
1. Установите Java JDK 11 или 17
2. File → Project Structure → JDK Location
3. Укажите путь к JDK

### Приложение не запускается на устройстве

**Решение:**
1. Проверьте, что USB debugging включен
2. В командной строке: `adb devices` (должно показать устройство)
3. На устройстве разрешите установку из неизвестных источников

## 📦 Публикация в Google Play

1. Создайте release APK с подписью (см. Шаг 6)
2. Зарегистрируйтесь в Google Play Console (одноразовая оплата $25)
3. Создайте новое приложение
4. Загрузите APK в раздел "Production"
5. Заполните:
   - Описание приложения
   - Скриншоты (минимум 2)
   - Иконку (512×512 px)
   - Feature graphic (1024×500 px)
   - Категорию (Games → Arcade)
6. Отправьте на модерацию

## 🔧 Дополнительные настройки

### Изменение минимальной версии Android

В `config.xml`:

```xml
<preference name="android-minSdkVersion" value="24" />
<preference name="android-targetSdkVersion" value="33" />
```

### Включение ProGuard (уменьшение размера APK)

В `platforms/android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Создание AAB (Android App Bundle)

В Android Studio:
1. Build → Generate Signed Bundle / APK
2. Выберите **Android App Bundle**
3. Следуйте инструкциям

AAB предпочтительнее для Google Play (меньший размер загрузки).

## 📚 Полезные ссылки

- [Android Studio Documentation](https://developer.android.com/studio/intro)
- [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
- [Publishing on Google Play](https://developer.android.com/studio/publish)
- [App Signing Guide](https://developer.android.com/studio/publish/app-signing)

---

**Готово!** Теперь вы можете собирать Neon Snake через Android Studio 🎮✨
