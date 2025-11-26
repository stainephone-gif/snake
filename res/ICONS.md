# Генерация иконок и splash-экранов

## Использование готового SVG

В папке `res/icon/` находится `icon.svg` - векторная иконка приложения.

## Автоматическая генерация иконок

### Метод 1: Использование cordova-res (рекомендуется)

```bash
# Установка
npm install -g cordova-res

# Генерация иконок и splash-экранов из SVG
cordova-res android --icon-source res/icon/icon.svg
```

### Метод 2: Использование ImageMagick

Если у вас установлен ImageMagick:

```bash
# Конвертация SVG в PNG разных размеров

# LDPI (36x36)
convert -background none -resize 36x36 res/icon/icon.svg res/icon/android/ldpi.png

# MDPI (48x48)
convert -background none -resize 48x48 res/icon/icon.svg res/icon/android/mdpi.png

# HDPI (72x72)
convert -background none -resize 72x72 res/icon/icon.svg res/icon/android/hdpi.png

# XHDPI (96x96)
convert -background none -resize 96x96 res/icon/icon.svg res/icon/android/xhdpi.png

# XXHDPI (144x144)
convert -background none -resize 144x144 res/icon/icon.svg res/icon/android/xxhdpi.png

# XXXHDPI (192x192)
convert -background none -resize 192x192 res/icon/icon.svg res/icon/android/xxxhdpi.png
```

### Метод 3: Онлайн сервисы

Используйте онлайн конвертеры:
- https://icon.kitchen/
- https://appicon.co/
- https://makeappicon.com/

Загрузите `icon.svg` и скачайте все размеры для Android.

## Размеры иконок для Android

| Плотность | Размер | Файл |
|-----------|--------|------|
| LDPI | 36x36 | ldpi.png |
| MDPI | 48x48 | mdpi.png |
| HDPI | 72x72 | hdpi.png |
| XHDPI | 96x96 | xhdpi.png |
| XXHDPI | 144x144 | xxhdpi.png |
| XXXHDPI | 192x192 | xxxhdpi.png |

## Splash-экраны

### Размеры для Android (Portrait)

| Плотность | Размер | Файл |
|-----------|--------|------|
| LDPI | 200x320 | splash-port-ldpi.png |
| MDPI | 320x480 | splash-port-mdpi.png |
| HDPI | 480x800 | splash-port-hdpi.png |
| XHDPI | 720x1280 | splash-port-xhdpi.png |
| XXHDPI | 960x1600 | splash-port-xxhdpi.png |
| XXXHDPI | 1280x1920 | splash-port-xxxhdpi.png |

### Создание splash-экрана

Создайте изображение с:
- Темный фон (#0a0e27)
- Логотип "NEON SNAKE" в центре
- Неоновое свечение

Пример с ImageMagick:

```bash
# Создание базового splash
convert -size 1280x1920 xc:"#0a0e27" \
  -gravity center \
  -pointsize 120 \
  -fill "#00f3ff" \
  -annotate +0-100 "NEON" \
  -annotate +0+100 "SNAKE" \
  res/screen/android/splash-port-xxxhdpi.png

# Масштабирование для других размеров
convert res/screen/android/splash-port-xxxhdpi.png -resize 960x1600 res/screen/android/splash-port-xxhdpi.png
convert res/screen/android/splash-port-xxxhdpi.png -resize 720x1280 res/screen/android/splash-port-xhdpi.png
convert res/screen/android/splash-port-xxxhdpi.png -resize 480x800 res/screen/android/splash-port-hdpi.png
convert res/screen/android/splash-port-xxxhdpi.png -resize 320x480 res/screen/android/splash-port-mdpi.png
convert res/screen/android/splash-port-xxxhdpi.png -resize 200x320 res/screen/android/splash-port-ldpi.png
```

## Placeholder иконки (минимальный вариант)

Если у вас нет готовых иконок, создайте простые PNG файлы:

```bash
# Создать все размеры с одним цветом (для тестирования)
for size in 36 48 72 96 144 192; do
  convert -size ${size}x${size} xc:"#00f3ff" res/icon/android/icon-${size}.png
done
```

## Проверка иконок

После генерации проверьте:

```bash
# Проверить размеры
identify res/icon/android/*.png

# Пересобрать приложение
cordova build android
```

## Рекомендации

1. Используйте PNG с прозрачным фоном
2. Сохраняйте исходный SVG для будущих изменений
3. Тестируйте иконки на разных устройствах
4. Проверяйте иконку в Google Play Console перед публикацией

## Дополнительные ресурсы

- [Android Asset Studio](http://romannurik.github.io/AndroidAssetStudio/)
- [Cordova Icons Documentation](https://cordova.apache.org/docs/en/latest/config_ref/images.html)
- [Material Design Icons](https://material.io/design/iconography/)
