# 🔧 Исправление ошибки Gradle "module()" method

## Проблема

Ошибка:
```
'org.gradle.api.artifacts.Dependency org.gradle.api.artifacts.dsl.DependencyHandler.module(java.lang.Object)'
```

Это происходит потому что метод `module()` был удален в Gradle 8.0+, а старые версии Cordova его используют.

## ✅ Решение 1: Обновление Cordova Android (РЕКОМЕНДУЕТСЯ)

Самый простой и надежный способ:

```bash
cd C:\Users\stain\StudioProjects\snake

# Удалить старую платформу
cordova platform remove android

# Добавить последнюю стабильную версию (12.0.1)
cordova platform add android@12

# Подготовить проект
cordova prepare android
```

После этого откройте проект заново в Android Studio.

## ✅ Решение 2: Ручное исправление build.gradle

Если обновление не помогло:

### Шаг 1: Найти проблемную строку

Откройте файл:
```
platforms/android/app/build.gradle
```

Найдите около строки 20 что-то похожее на:

```gradle
// Старый синтаксис (НЕПРАВИЛЬНО)
compile module('org.apache.cordova:framework:+')
```

или

```gradle
dependencies {
    compile(group: 'org.apache.cordova', name: 'framework', version: '+')
}
```

### Шаг 2: Заменить на современный синтаксис

Замените на:

```gradle
// Новый синтаксис (ПРАВИЛЬНО)
implementation 'org.apache.cordova:framework:+'
```

Также замените все вхождения:
- `compile` → `implementation`
- `testCompile` → `testImplementation`
- `androidTestCompile` → `androidTestImplementation`

### Полный список замен:

```gradle
// БЫЛО:
compile fileTree(...)
compile 'com.android.support:...'
compile project(':CordovaLib')

// СТАЛО:
implementation fileTree(...)
implementation 'com.android.support:...'
implementation project(':CordovaLib')
```

## ✅ Решение 3: Понижение версии Gradle

Если нужна быстрая временная починка:

### Файл: gradle-wrapper.properties

Откройте:
```
platforms/android/gradle/wrapper/gradle-wrapper.properties
```

Измените:
```properties
# БЫЛО (Gradle 8.x)
distributionUrl=https\://services.gradle.org/distributions/gradle-8.2.1-all.zip

# СТАЛО (Gradle 7.6.3 - последняя стабильная версия 7.x)
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-all.zip
```

### Файл: build.gradle (корневой)

Откройте:
```
platforms/android/build.gradle
```

Найдите:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:8.x.x'
}
```

Замените на:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:7.4.2'
}
```

## ✅ Решение 4: Скрипт автоматического исправления

Создайте файл `fix-gradle.ps1` (для Windows PowerShell):

```powershell
# Переход в директорию проекта
cd "C:\Users\stain\StudioProjects\snake"

# Обновление платформы
Write-Host "Удаление старой платформы Android..." -ForegroundColor Yellow
cordova platform remove android

Write-Host "Добавление новой платформы Android..." -ForegroundColor Yellow
cordova platform add android@latest

Write-Host "Подготовка проекта..." -ForegroundColor Yellow
cordova prepare android

Write-Host "Готово! Откройте проект в Android Studio." -ForegroundColor Green
```

Запустите:
```powershell
powershell -ExecutionPolicy Bypass -File fix-gradle.ps1
```

## 🎯 Проверка версий

После исправления проверьте версии:

### Cordova версия:
```bash
cordova -v
# Должно быть 12.0.0 или выше
```

### Cordova Android версия:
```bash
cordova platform version
# android: 12.0.1 или выше
```

### Gradle версия:
Файл `platforms/android/gradle/wrapper/gradle-wrapper.properties`:
```properties
# Рекомендуется 7.6.3 или 8.2.1
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-all.zip
```

### Android Gradle Plugin:
Файл `platforms/android/build.gradle`:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:7.4.2'  // или 8.1.0
}
```

## 📋 Таблица совместимости

| Cordova Android | Gradle | Android Gradle Plugin | Java |
|----------------|--------|----------------------|------|
| 12.0.x         | 7.6.3+ | 7.4.2+              | 17   |
| 11.0.x         | 7.4.2  | 7.2.2               | 11   |
| 10.1.x         | 7.1.1  | 7.0.2               | 11   |

## ⚠️ Важные примечания

1. **Не редактируйте файлы в `platforms/` напрямую** - они перезаписываются при `cordova prepare`

2. **Если нужны постоянные изменения**, используйте хуки Cordova или редактируйте `config.xml`

3. **После обновления платформы** всегда делайте:
   ```bash
   cordova clean
   cordova prepare android
   ```

4. **В Android Studio** после изменений:
   - File → Invalidate Caches / Restart
   - Build → Clean Project
   - Build → Rebuild Project

## 🔍 Отладка

Если проблема остается, запустите с подробными логами:

```bash
cordova build android --verbose
```

Или в Android Studio:
```
View → Tool Windows → Build
```

Там будет полный лог сборки с указанием точной проблемы.

## 📞 Дополнительная помощь

Если ничего не помогает:

1. Удалите папки:
   ```bash
   rmdir /s platforms
   rmdir /s plugins
   rmdir /s node_modules
   ```

2. Переустановите все:
   ```bash
   npm install
   cordova platform add android@12
   cordova prepare android
   ```

3. Откройте проект заново в Android Studio

---

**Рекомендация:** Используйте Решение 1 (обновление Cordova Android) - это самый надежный способ! 🚀
