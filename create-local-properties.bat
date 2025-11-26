@echo off
REM Скрипт для создания local.properties

echo Создаю файл local.properties...

REM Определяем возможные пути к SDK
set SDK_PATH1=D:\Android\Sdk
set SDK_PATH2=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set SDK_PATH3=C:\Android\Sdk

REM Проверяем какой путь существует
if exist "%SDK_PATH1%" (
    set FINAL_SDK_PATH=%SDK_PATH1%
    echo Найден SDK: %SDK_PATH1%
) else if exist "%SDK_PATH2%" (
    set FINAL_SDK_PATH=%SDK_PATH2%
    echo Найден SDK: %SDK_PATH2%
) else if exist "%SDK_PATH3%" (
    set FINAL_SDK_PATH=%SDK_PATH3%
    echo Найден SDK: %SDK_PATH3%
) else (
    echo ОШИБКА: Android SDK не найден!
    echo.
    echo Проверьте что Android Studio установлен и SDK скачан.
    echo Откройте Android Studio: Tools -^> SDK Manager
    echo.
    pause
    exit /b 1
)

REM Конвертируем путь (заменяем \ на /)
set FINAL_SDK_PATH=%FINAL_SDK_PATH:\=/%

REM Создаём файл local.properties
cd platforms\android
echo sdk.dir=%FINAL_SDK_PATH% > local.properties

echo.
echo Готово! Файл local.properties создан:
echo sdk.dir=%FINAL_SDK_PATH%
echo.
echo Теперь откройте проект в Android Studio и попробуйте собрать APK.
echo.
pause
